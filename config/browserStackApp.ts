import { readdirSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import BrowserStackAppHelper from '../test/common/browserStackAppHelper';
import { logInfo, logWarn } from '../test/common/logger';

interface BrowserStackAppPreparation {
    platform: 'Android' | 'iOS';
    extension: '.apk' | '.ipa';
    customId: string;
    appUrlEnvVar: 'BROWSERSTACK_ANDROID_APP_URL' | 'BROWSERSTACK_IOS_APP_URL';
}

const appsDirectory = resolve(process.cwd(), 'apps');

function findLatestAppFile(extension: string): string | undefined {
    let files: string[];
    try {
        files = readdirSync(appsDirectory);
    } catch {
        return undefined;
    }
    return files
        .filter((file) => extname(file).toLowerCase() === extension)
        .map((file) => resolve(appsDirectory, file))
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
}

/**
 * Deletes the previously uploaded build with this project's custom ID, uploads the latest
 * local build from apps/, and exposes its bs:// URL via the platform's app URL env var.
 * Runs only in the WDIO launcher process; workers inherit the resulting env var.
 */
export async function prepareBrowserStackApp({
    platform,
    extension,
    customId,
    appUrlEnvVar,
}: BrowserStackAppPreparation): Promise<string> {
    const existingAppUrl = process.env[appUrlEnvVar];
    if (process.env.WDIO_WORKER_ID || process.env.BROWSERSTACK_SKIP_APP_UPLOAD === 'true') {
        return requireAppUrl(appUrlEnvVar, existingAppUrl);
    }

    const appFile = findLatestAppFile(extension);
    if (!appFile) {
        await logWarn(
            `No ${extension} file found in ${appsDirectory}; using ${appUrlEnvVar} for ${platform}.`,
        );
        return requireAppUrl(appUrlEnvVar, existingAppUrl);
    }

    const browserStackApps = new BrowserStackAppHelper();
    const deletedApps = await browserStackApps.deleteAppsByCustomId(customId);
    await logInfo(
        `Deleted ${deletedApps.length} existing BrowserStack ${platform} app(s) with custom ID "${customId}".`,
    );

    await logInfo(`Uploading ${appFile} to BrowserStack...`);
    const { app_url: appUrl } = await browserStackApps.uploadAppFromFile(appFile, { customId });
    process.env[appUrlEnvVar] = appUrl;
    await logInfo(`Uploaded BrowserStack ${platform} app: ${appUrl}`);
    return appUrl;
}

function requireAppUrl(appUrlEnvVar: string, appUrl: string | undefined): string {
    if (!appUrl) {
        throw new Error(
            `${appUrlEnvVar} is not set and no app file was uploaded. Add the app to apps/ or set ${appUrlEnvVar}.`,
        );
    }
    return appUrl;
}

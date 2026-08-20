import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

// port the local Appium server binds to; @wdio/appium-service starts it before the
// suite runs and kills it once the suite completes
export const appiumPort = Number(process.env.APPIUM_PORT ?? 4723);

export function cleanReports(): void {
    for (const reportDirectory of ['allure-results', 'allure-report']) {
        rmSync(resolve(process.cwd(), reportDirectory), { recursive: true, force: true });
    }
    mkdirSync(resolve(process.cwd(), 'allure-results'), { recursive: true });
}

const execFileAsync = promisify(execFile);

// Runs before the Appium service/session starts, so a stale build never lingers
// on the device/simulator when the suite installs the fresh one from ./apps.
export async function uninstallAndroidApp(appId: string, udid?: string): Promise<void> {
    const target = udid ? ['-s', udid] : [];
    try {
        const { stdout } = await execFileAsync('adb', [
            ...target,
            'shell',
            'pm',
            'list',
            'packages',
            appId,
        ]);
        if (!stdout.includes(appId)) {
            console.log(`[onPrepare] Android app ${appId} is not installed, nothing to uninstall`);
            return;
        }
        console.log(`[onPrepare] Uninstalling existing Android app ${appId}`);
        await execFileAsync('adb', [...target, 'uninstall', appId]);
    } catch (err) {
        console.warn(`[onPrepare] Skipped Android uninstall for ${appId}:`, (err as Error).message);
    }
}

export async function uninstallIosApp(bundleId: string, udid?: string): Promise<void> {
    if (!udid) {
        console.warn('[onPrepare] IOS_UDID not set, skipping iOS app uninstall check');
        return;
    }
    try {
        await execFileAsync('xcrun', ['simctl', 'get_app_container', udid, bundleId]);
    } catch {
        console.log(`[onPrepare] iOS app ${bundleId} is not installed, nothing to uninstall`);
        return;
    }
    console.log(`[onPrepare] Uninstalling existing iOS app ${bundleId}`);
    try {
        await execFileAsync('xcrun', ['simctl', 'uninstall', udid, bundleId]);
    } catch (err) {
        console.warn(`[onPrepare] Skipped iOS uninstall for ${bundleId}:`, (err as Error).message);
    }
}

export const baseConfig: Partial<WebdriverIO.Config> = {
    logLevel: 'info',
    waitforTimeout: 20000,
    connectionRetryCount: 3,
    port: appiumPort,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    afterTest: async (_test, _context, { error }) => {
        if (error) {
            await browser.takeScreenshot();
        }
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],
};

export function mergeCommonCapabilities(
    config: WebdriverIO.Config,
    commonCaps: Record<string, any>,
): void {
    config.capabilities?.forEach((caps) => {
        const cap = caps as Record<string, any>;
        for (const [key, value] of Object.entries(commonCaps)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                cap[key] = {
                    ...(typeof cap[key] === 'object' &&
                    cap[key] !== null &&
                    !Array.isArray(cap[key])
                        ? cap[key]
                        : {}),
                    ...value,
                };
            } else {
                cap[key] = cap[key] ?? value;
            }
        }
    });
}

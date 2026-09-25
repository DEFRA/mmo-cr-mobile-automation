import { step, addAttachment } from '@wdio/allure-reporter';

export async function logStep(message: string) {
    console.log(`[STEP] ${new Date().toISOString()} — ${message}`);
    try {
        await step(message, async () => {});
    } catch {
        // Allure reporter may not be available in all contexts
    }
}

export async function logInfo(message: string) {
    console.log(`[INFO] ${new Date().toISOString()} — ${message}`);
}

export async function logWarn(message: string) {
    console.warn(`[WARN] ${new Date().toISOString()} — ${message}`);
}

export async function logError(message: string, error?: unknown) {
    const errorDetail = error instanceof Error ? `: ${error.message}` : '';
    console.error(`[ERROR] ${new Date().toISOString()} — ${message}${errorDetail}`);
}

export async function attachScreenshot(name: string = 'Screenshot') {
    const png = await driver.takeScreenshot();
    addAttachment(name, Buffer.from(png, 'base64'), 'image/png');
}

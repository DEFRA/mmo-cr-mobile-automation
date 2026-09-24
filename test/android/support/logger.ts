import { step, addAttachment } from '@wdio/allure-reporter';

/**
 * Logs a step directly to the Allure HTML report using the step wrapper.
 */
export async function logStep(stepMessage: string) {
    await step(stepMessage, async () => {
        // Step is registered here
    });
}

/**
 * Attaches a screenshot to the current Allure report step.
 */
export async function attachScreenshot(name: string = 'Screenshot') {
    const png = await driver.takeScreenshot();
    addAttachment(name, Buffer.from(png, 'base64'), 'image/png');
}

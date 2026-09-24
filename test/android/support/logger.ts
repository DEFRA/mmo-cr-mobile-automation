import { step, addAttachment } from '@wdio/allure-reporter';

export async function logStep(stepMessage: string) {
    await step(stepMessage, async () => {});
}

export async function attachScreenshot(name: string = 'Screenshot') {
    const png = await driver.takeScreenshot();
    addAttachment(name, Buffer.from(png, 'base64'), 'image/png');
}

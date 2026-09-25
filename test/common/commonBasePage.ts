import { logStep, logInfo, logWarn, logError } from './logger';

export abstract class CommonBasePage {
    protected abstract readonly appId: string;

    async openApp() {
        let lastError: unknown;

        logStep(`Opening app with ID ${this.appId}`);
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await driver.activateApp(this.appId);
                await driver.waitUntil(async () => (await driver.getPageSource()).length > 0, {
                    timeout: 20000,
                    timeoutMsg: 'App did not finish launching.',
                });
                logInfo(`CommonBasePage: Successfully opened app on attempt ${attempt}`);
                return;
            } catch (error) {
                lastError = error;
                logWarn(`CommonBasePage: Failed to open app on attempt ${attempt}. Error: ${error}`);
                if (attempt < 3) {
                    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
                }
            }
        }

        logError(`CommonBasePage: Failed to activate app ${this.appId} after 3 attempts`);
        throw lastError ?? new Error(`Failed to activate app ${this.appId}.`);
    }

    async close() {
        logStep(`Terminating app ${this.appId}`);
        await driver.terminateApp(this.appId);
    }

    async navigateTo(tab: string) {
        logStep(`Navigating to tab ${tab}`);
        const tabElement = await $(`~${tab}`);
        await tabElement.waitForDisplayed({ timeout: 10000 });
        await tabElement.click();
    }

    async switchContext(contextName: string) {
        await driver.switchContext(contextName);
    }

    async getContexts(): Promise<string[]> {
        return (await driver.getContexts()) as string[];
    }

    async switchToWebview() {
        logStep('Switching to WEBVIEW context');
        const contexts = await this.getContexts();
        const webviewContext = contexts.find((context: string) => context.includes('WEBVIEW'));
        if (webviewContext) {
            await this.switchContext(webviewContext);
        } else {
            logError('CommonBasePage: Failed to find WEBVIEW context');
            throw new Error('No webview context found');
        }
    }

    async switchToNativeContext() {
        logStep('Switching to NATIVE_APP context');
        await this.switchContext('NATIVE_APP');
    }

    async acceptAlert() {
        logStep('Accepting alert');
        await driver.acceptAlert();
    }

    async dismissAlert() {
        logStep('Dismissing alert');
        await driver.dismissAlert();
    }

    async getAlertText(): Promise<string> {
        return await driver.getAlertText();
    }

    async dismissSavePasswordPrompt(): Promise<void> {
        try {
            await driver.waitUntil(() => driver.isAlertOpen(), {
                timeout: 5000,
                interval: 250,
            });
            const alertText = await this.getAlertText();
            if (/save password|password/i.test(alertText)) {
                await this.dismissAlert();
            }
        } catch {
            logInfo('CommonBasePage: No save-password alert to dismiss');
        }
    }
}

export abstract class CommonBasePage {
    protected abstract readonly appId: string;

    async openApp() {
        let lastError: unknown;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await driver.activateApp(this.appId);
                await driver.waitUntil(async () => (await driver.getPageSource()).length > 0, {
                    timeout: 20000,
                    timeoutMsg: 'App did not finish launching.',
                });
                return;
            } catch (error) {
                lastError = error;
                if (attempt < 3) {
                    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
                }
            }
        }

        throw lastError ?? new Error(`Failed to activate app ${this.appId}.`);
    }

    async close() {
        await driver.terminateApp(this.appId);
    }

    async navigateTo(tab: string) {
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
        const contexts = await this.getContexts();
        const webviewContext = contexts.find((context: string) => context.includes('WEBVIEW'));
        if (webviewContext) {
            await this.switchContext(webviewContext);
        } else {
            throw new Error('No webview context found');
        }
    }

    async switchToNativeContext() {
        await this.switchContext('NATIVE_APP');
    }

    async acceptAlert() {
        await driver.acceptAlert();
    }

    async dismissAlert() {
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
            // The prompt is optional and may not appear on every simulator run.
        }
    }
}

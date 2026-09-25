import { CommonBasePage } from '../../common/commonBasePage';
import { logStep } from '../../common/logger';

export class BasePage extends CommonBasePage {
    protected readonly appId = process.env.IOS_BUNDLE_ID ?? 'mmo.catchrecordingdev.ios';

    get languageToggle() {
        return $('~Header.languageToggle');
    }

    get homeTab() {
        return $('~TabBar.home');
    }

    get notificationsTab() {
        return $('~TabBar.notifications');
    }

    get settingsTab() {
        return $('~TabBar.settings');
    }

    selector(name: string) {
        return $(`~${name}`);
    }

    textField(name: string) {
        return $(`//XCUIElementTypeTextField[@name="${name}"]`);
    }

    async scrollToElement(element: ReturnType<typeof $>) {
        logStep('scrollToElement');
        await element.waitForExist({ timeout: 500 });
        await this.scrollToElementIfExisting(element);
        await element.waitForDisplayed({ timeout: 500 });
    }

    async scrollToElementIfExisting(element: ReturnType<typeof $>) {
        if ((await element.isExisting()) && !(await element.isDisplayed())) {
            const selectorStr = element.selector as unknown as string;

            if (typeof selectorStr === 'string' && selectorStr.startsWith('~')) {
                try {
                    await browser.execute('mobile: scroll', {
                        direction: 'down',
                        name: selectorStr.substring(1),
                    });
                    return; // Fast scroll succeeded
                } catch {
                    // Fallback if scroll fails
                }
            }

            await browser.execute('mobile: scrollToElement', {
                element: await element.elementId,
            });
        }
    }

    async scrollAndClickIfExisting(element: ReturnType<typeof $>) {
        if (await element.isExisting()) {
            await this.scrollToElementIfExisting(element);
            await element.click();
        }
    }
}

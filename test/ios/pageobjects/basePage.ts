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
        await element.waitForExist();
        await this.scrollToElementIfExisting(element);
        await element.waitForDisplayed();
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
                } catch {}
            }

            const elementId = await element.elementId;

            try {
                await browser.execute('mobile: scrollToElement', {
                    element: elementId,
                });
                return;
            } catch {}

            // 'mobile: scrollToElement' is missing on older XCUITest drivers (e.g. BrowserStack defaults)
            try {
                await browser.execute('mobile: scroll', {
                    elementId: elementId,
                    toVisible: true,
                });
                return;
            } catch {}

            for (let i = 0; i < 10; i++) {
                await browser.execute('mobile: swipe', { direction: 'up' });
                if (await element.isDisplayed()) {
                    return;
                }
            }
        }
    }

    async scrollAndClickIfExisting(element: ReturnType<typeof $>) {
        if (await element.isExisting()) {
            await this.scrollToElementIfExisting(element);
            await element.click();
        }
    }
}

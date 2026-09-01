import { CommonBasePage } from '../../common/commonBasePage';

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
}

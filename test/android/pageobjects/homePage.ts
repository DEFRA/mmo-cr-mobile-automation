import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export class HomePage extends BasePage {
    get bannerTitle() {
        return $('//android.widget.TextView[@text="Important"]');
    }

    get bannerText() {
        return $(
            '//android.widget.TextView[@text="The Catch Records service will be available from 1 October 2026."]',
        );
    }

    get heading() {
        return $('//android.widget.TextView[@text="Your catch records"]');
    }

    get createRecordButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Create a new catch record"]]',
        );
    }

    get webServiceNote() {
        return $(
            '//android.widget.TextView[@text="To edit trips or manage your account settings, use the web service."]',
        );
    }

    get tripEndDateHeader() {
        return $('//android.widget.TextView[@text="Trip end date"]');
    }

    get vesselHeader() {
        return $('//android.widget.TextView[@text="Vessel"]');
    }

    get statusHeader() {
        return $('//android.widget.TextView[@text="Status"]');
    }

    get createdByHeader() {
        return $('//android.widget.TextView[@text="Created by"]');
    }

    get paginationSummary() {
        return $('//android.widget.TextView[starts-with(@text, "Showing")]');
    }

    get nextButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Next"]]',
        );
    }

    get helpLink() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Help with catch recording"]]',
        );
    }

    get statusHelpLink() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Catch record statuses"]]',
        );
    }

    get homeTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Home"]]',
        );
    }

    get notificationsTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Notifications"]]',
        );
    }

    get settingsTab() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Settings"]]',
        );
    }

    tableRowDate(rowIndex: number, date: string) {
        return $(`(//android.widget.TextView[@text="${date}"])[${rowIndex + 1}]`);
    }

    tableRowVessel(rowIndex: number, vessel: string) {
        return $(`(//android.widget.TextView[@text="${vessel}"])[${rowIndex + 1}]`);
    }

    tableRowStatus(rowIndex: number, status: string) {
        return $(`(//android.widget.TextView[@text="${status}"])[${rowIndex + 1}]`);
    }

    tableRowCreatedBy(rowIndex: number, createdBy: string) {
        return $(`(//android.widget.TextView[@text="${createdBy}"])[${rowIndex + 1}]`);
    }

    pageNumber(page: number) {
        return $(`//android.widget.TextView[@text="${page}"]`);
    }

    async clickCreateRecordButton() {
        logStep('Clicking create record button');
        await this.createRecordButton.waitForDisplayed({ timeout: 10000 });
        await this.createRecordButton.click();
    }

    async openHelp() {
        logStep('Opening help');
        await this.helpLink.click();
    }

    async openStatusHelp() {
        logStep('Opening status help');
        await this.statusHelpLink.click();
    }

    async goToNextPage() {
        logStep('Going to next page');
        await this.nextButton.click();
    }

    async goToHome() {
        logStep('Going to home tab');
        await this.homeTab.click();
    }

    async goToNotifications() {
        logStep('Going to notifications tab');
        await this.notificationsTab.click();
    }

    async goToSettings() {
        logStep('Going to settings tab');
        await this.settingsTab.click();
    }
}

export default new HomePage();

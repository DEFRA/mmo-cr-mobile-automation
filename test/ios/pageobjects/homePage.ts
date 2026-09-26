import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export class HomePage extends BasePage {
    get yourTripsHeading() {
        return $('~Your trips');
    }

    get tripsDescription() {
        return $("~View trips you've already submitted.");
    }

    get tripDateDescription() {
        return $('~Select an end date to see the details you recorded.');
    }

    get appUsageNote() {
        return $(
            '~Note: You can only add new trips and view your account settings on the web service, not in this app.',
        );
    }

    get tripEndDateHeader() {
        return $('~Trip end date');
    }

    get vesselHeader() {
        return $('~Vessel');
    }

    get statusHeader() {
        return $('~Status');
    }

    get createdByHeader() {
        return $('~Created by');
    }

    get pagination() {
        return $('~Pagination');
    }

    get currentPage() {
        return $('~Home.pagination.page.1');
    }

    get paginationSummary() {
        return $('~Home.pagination.showing');
    }

    get howToRecordLink() {
        return $('~Home.howToRecord');
    }

    get whatYouNeedToDoHeading() {
        return $('~What you need to do');
    }

    get statusHelpLink() {
        return $('~Understanding catch record statuses');
    }

    get unsentStatusDescription() {
        return $('~Saved on your device and not yet submitted.');
    }

    get createRecordButton() {
        return $('~Home.createRecordButton');
    }

    get warningBox() {
        return $('~Home.warningBox');
    }

    get bannerTitle() {
        return $('~Important');
    }

    get bannerText() {
        return $('~The Catch Records service will be available from 1 October 2026.');
    }

    get contactDefraLink() {
        return $('~Contact Defra');
    }

    get tripsScrollView() {
        return $('//XCUIElementTypeScrollView');
    }

    tableRowDate(rowIndex: number) {
        return $(`~Home.table.row.${rowIndex}.date`);
    }

    tableRowVessel(rowIndex: number, vessel: string) {
        return $(
            `(//XCUIElementTypeStaticText[@name="${vessel}" and @value="${vessel}"])[${rowIndex + 1}]`,
        );
    }

    tableRowStatus(rowIndex: number, status: string) {
        return $(
            `(//XCUIElementTypeStaticText[@name="${status}" and @value="${status}"])[${rowIndex + 1}]`,
        );
    }

    tableRowCreatedBy(rowIndex: number, createdBy: string) {
        return $(
            `(//XCUIElementTypeStaticText[@name="${createdBy}" and @value="${createdBy}"])[${rowIndex + 1}]`,
        );
    }

    async openTrip(rowIndex: number) {
        logStep('openTrip');
        await this.tableRowDate(rowIndex).click();
    }

    async openHowToRecord() {
        logStep('openHowToRecord');
        await this.howToRecordLink.click();
    }

    async openStatusHelp() {
        logStep('openStatusHelp');
        await this.statusHelpLink.click();
    }

    async clickCreateRecordButton() {
        logStep('clickCreateRecordButton');
        await this.scrollAndClickIfExisting(this.createRecordButton);
    }

    async goToNotifications() {
        logStep('goToNotifications');
        await this.notificationsTab.click();
    }

    async goToSettings() {
        logStep('goToSettings');
        await this.settingsTab.click();
    }

    async switchToWelsh() {
        logStep('switchToWelsh');
        await this.languageToggle.click();
    }
}

export default new HomePage();

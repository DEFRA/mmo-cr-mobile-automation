import { BasePage } from './basePage';

export class HomePage extends BasePage {
    get govUk() {
        return $('~GOV.UK');
    }

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

    get statusHelpLink() {
        return $('~Understanding catch record statuses');
    }

    get createRecordButton() {
        return $('~Home.createRecordButton');
    }

    get contactDefraLink() {
        return $('~Contact Defra');
    }

    get tripsScrollView() {
        return $('//XCUIElementTypeScrollView');
    }

    async scrollToElement(element: ReturnType<typeof $>) {
        await element.waitForExist({ timeout: 20000 });
        await browser.execute('mobile: scrollToElement', {
            element: await element.elementId,
        });
        await element.waitForDisplayed({ timeout: 10000 });
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
        await this.tableRowDate(rowIndex).click();
    }

    async clickCreateRecordButton() {
        const button = await this.createRecordButton;

        try {
            await button.waitForDisplayed({ timeout: 4000 });
        } catch {
            await browser.execute('mobile: scrollToElement', {
                element: await button.elementId,
            });
        }

        await button.waitForDisplayed({ timeout: 10000 });
        await button.click();
    }

    async goToNotifications() {
        await this.notificationsTab.click();
    }

    async goToSettings() {
        await this.settingsTab.click();
    }

    async switchToWelsh() {
        await this.languageToggle.click();
    }
}

export default new HomePage();

import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class AddPortPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.addPort.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.addPort.heading');
    }

    get emptyStateText() {
        return $(
            '~No ports added yet. Enter a port name or the nearest port to where you left and will return.',
        );
    }

    get searchLabel() {
        return $('//XCUIElementTypeStaticText[starts-with(@value, "Add port to vessel ")][last()]');
    }

    get searchField() {
        return $('//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]');
    }

    get saveContinueButton() {
        return $('~CatchRecord.addPort.saveContinue');
    }

    portResult(portName: string) {
        return $(`~SearchDropdownField.result.${portName}`);
    }

    async enterPortSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async selectPort(portName: string) {
        await this.enterPortSearch(portName);

        const result = this.portResult(portName);
        await result.waitForExist({ timeout: 10000 });
        await browser.execute('mobile: scrollToElement', {
            element: await result.elementId,
        });
        await result.waitForDisplayed({ timeout: 10000 });
        await result.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new AddPortPage();

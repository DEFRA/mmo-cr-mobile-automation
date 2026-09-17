import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class CatchLocationManualEntryPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.catchLocationManualEntry.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.catchLocationManualEntry.heading');
    }

    get description() {
        return $('~Enter the statistical sub area where most of your catch was caught using Pots');
    }

    get searchField() {
        return $(
            '//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]',
        );
    }

    get saveContinueButton() {
        return $('~CatchRecord.catchLocationManualEntry.saveContinue');
    }

    async searchForArea(term: string) {
        await this.searchField.setValue(term);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new CatchLocationManualEntryPage();

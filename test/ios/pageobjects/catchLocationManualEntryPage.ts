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

    /** Type-ahead dropdown result for a statistical sub area code (SearchDropdownField convention). */
    areaResult(code: string) {
        return $(`~SearchDropdownField.result.${code}`);
    }

    // UNVERIFIED: coordinates sub-element id within a result not confirmed against a live iOS session.
    resultCoordinates(code: string) {
        return $(`~SearchDropdownField.result.${code}.coordinates`);
    }

    // UNVERIFIED: ICES rectangle sub-element id within a result not confirmed against a live iOS session.
    resultIcesRectangle(code: string) {
        return $(`~SearchDropdownField.result.${code}.icesRectangle`);
    }

    // UNVERIFIED: auto-populated coordinates field id not confirmed against a live iOS session.
    get coordinates() {
        return $('~CatchRecord.catchLocationManualEntry.coordinates');
    }

    // UNVERIFIED: validation error id/text not confirmed against a live iOS session.
    get validationError() {
        return $('~Enter a valid statistical sub area code.');
    }

    async searchForArea(term: string) {
        await this.searchField.setValue(term);
    }

    async selectArea(code: string) {
        await this.searchAndSelect(this.searchField, code, this.areaResult(code));
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new CatchLocationManualEntryPage();

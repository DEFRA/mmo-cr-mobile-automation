import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn, logError } from '../../common/logger';

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

    areaResult(code: string) {
        return $(`~SearchDropdownField.result.${code}`);
    }

    resultCoordinates(code: string) {
        return $(`~SearchDropdownField.result.${code}.coordinates`);
    }

    resultIcesRectangle(code: string) {
        return $(`~SearchDropdownField.result.${code}.icesRectangle`);
    }

    get coordinates() {
        return $('~CatchRecord.catchLocationManualEntry.coordinates');
    }

    get validationError() {
        return $('~Enter a valid statistical sub area code.');
    }

    async searchForArea(term: string) {
        logStep('searchForArea');
        await this.searchField.setValue(term);
    }

    async selectArea(code: string) {
        logStep('selectArea');
        await this.searchAndSelect(this.searchField, code, this.areaResult(code));
    }

    async continueToNextStep() {
        logStep('continueToNextStep');
        await this.saveContinueButton.click();
    }
}

export default new CatchLocationManualEntryPage();

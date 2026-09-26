import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class CatchLocationManualEntryPage extends BaseCatchRecordPage {
    protected pageId = 'catchLocationManualEntry';

    get description() {
        return $('~Enter the statistical sub area where most of your catch was caught using Pots');
    }

    get searchField() {
        return $(
            '//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]',
        );
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
}

export default new CatchLocationManualEntryPage();

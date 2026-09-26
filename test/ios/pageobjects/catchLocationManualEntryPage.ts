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
        return $('~Select a statistical subrectangle');
    }

    async searchForArea(term: string) {
        logStep('searchForArea');
        await this.searchField.setValue(term);
    }

    async searchAndSelectArea(searchTerm: string, code: string) {
        logStep(`Searching for ${searchTerm} and selecting area ${code}`);
        await this.searchAndSelect(this.searchField, searchTerm, this.areaResult(code));
    }

    async selectArea(code: string, searchTerm?: string) {
        logStep('selectArea');
        const term = searchTerm || code.substring(0, 2);
        await this.searchAndSelectArea(term, code);
    }
}

export default new CatchLocationManualEntryPage();

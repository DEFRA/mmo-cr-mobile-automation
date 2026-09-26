import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class AddGearPage extends BaseCatchRecordPage {
    protected pageId = 'addGear';

    get emptyStateText() {
        return $('~No gear added yet. Add gear used by this vessel.');
    }

    get exampleText() {
        return $('~For example, Bottom Trawl or Gillnet.');
    }

    get searchLabel() {
        return $('~CatchRecord.addGear.search');
    }

    get searchField() {
        return $(
            '//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]',
        );
    }
    get validationError() {
        return $('~Select the gear you want to add');
    }

    gearResult(gearName: string) {
        return $(`~SearchDropdownField.result.${gearName}`);
    }

    async enterGearSearch(term: string) {
        logStep('enterGearSearch');
        await this.searchField.setValue(term);
    }

    async searchAndSelectGear(searchTerm: string, gearName: string) {
        logStep(`Searching for ${searchTerm} and selecting gear ${gearName}`);
        await this.searchAndSelect(this.searchField, searchTerm, this.gearResult(gearName));
    }

    async selectGear(gearName: string, searchTerm?: string) {
        logStep('selectGear with gear name: ' + gearName);
        const term = searchTerm || gearName.substring(0, 2);
        await this.searchAndSelectGear(term, gearName);
    }
}

export default new AddGearPage();

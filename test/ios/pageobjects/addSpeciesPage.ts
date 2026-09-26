import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class AddSpeciesPage extends BaseCatchRecordPage {
    protected pageId = 'addSpecies';

    get emptyStateText() {
        return $("~You haven't added any species yet.");
    }

    get descriptionText() {
        return $(
            '~Select all species you caught, then enter the live weight for each. For example, Edible crab or Salmon.',
        );
    }

    get searchLabel() {
        return $(
            '//XCUIElementTypeStaticText[starts-with(@value, "Add species to vessel ")][last()]',
        );
    }

    get searchField() {
        return $('//XCUIElementTypeTextField[contains(@placeholderValue, "Type to search")]');
    }

    get mistakenLink() {
        return $('~CatchRecord.addSpecies.mistakenLink');
    }

    get contactLink() {
        return $('~CatchRecord.addSpecies.contactLink');
    }
    get validationError() {
        return $('~CatchRecord.addSpecies.error');
    }

    speciesResult(speciesName: string) {
        return $(`~SearchDropdownField.result.${speciesName}`);
    }

    async enterSpeciesSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async searchAndSelectSpecies(searchTerm: string, speciesName: string) {
        logStep(`Searching for ${searchTerm} and selecting species ${speciesName}`);
        await this.searchAndSelect(this.searchField, searchTerm, this.speciesResult(speciesName));
    }

    async selectSpecies(speciesName: string, searchTerm?: string) {
        logStep('selectSpecies with species name: ' + speciesName);
        const term = searchTerm || speciesName.substring(0, 2);
        await this.searchAndSelectSpecies(term, speciesName);
    }
}

export default new AddSpeciesPage();

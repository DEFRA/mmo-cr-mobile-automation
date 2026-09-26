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
    speciesResult(speciesName: string) {
        return $(`-ios predicate string:name == "SearchDropdownField.result.${speciesName}"`);
    }

    async enterSpeciesSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async selectSpecies(speciesName: string) {
        logStep('selectSpecies with species name: ' + speciesName);
        await this.searchAndSelect(this.searchField, speciesName, this.speciesResult(speciesName));
    }
}

export default new AddSpeciesPage();

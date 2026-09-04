import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class AddSpeciesPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.addSpecies.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.addSpecies.heading');
    }

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
        return $(
            '//XCUIElementTypeTextField[contains(@placeholderValue, "Type to search")]',
        );
    }

    get mistakenLink() {
        return $('~CatchRecord.addSpecies.mistakenLink');
    }

    get contactLink() {
        return $('~CatchRecord.addSpecies.contactLink');
    }

    get saveContinueButton() {
        return $('~CatchRecord.addSpecies.saveContinue');
    }

    speciesResult(speciesName: string) {
        return $(`~SearchDropdownField.result.${speciesName}`);
    }

    async enterSpeciesSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async selectSpecies(speciesName: string) {
        await this.searchAndSelect(this.searchField, speciesName, this.speciesResult(speciesName));
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new AddSpeciesPage();

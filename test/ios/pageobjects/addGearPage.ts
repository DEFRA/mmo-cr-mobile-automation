import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class AddGearPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.addGear.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.addGear.heading');
    }

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
        return $('//XCUIElementTypeTextField[@name="CatchRecord.addGear.search"]');
    }

    get saveContinueButton() {
        return $('~CatchRecord.addGear.saveContinue');
    }

    selector(name: string) {
        return $(`~${name}`);
    }

    async enterGearSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new AddGearPage();

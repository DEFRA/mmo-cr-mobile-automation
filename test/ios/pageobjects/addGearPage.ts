import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn, logError } from '../../common/logger';

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
        return $(
            '//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]',
        );
    }

    get saveContinueButton() {
        return $('~CatchRecord.addGear.saveContinue');
    }

    gearResult(gearName: string) {
        return $(`~SearchDropdownField.result.${gearName}`);
    }

    async enterGearSearch(term: string) {
        logStep('enterGearSearch');
        await this.searchField.setValue(term);
    }

    async selectGear(gearName: string) {
        logStep('selectGear with gear name: ' + gearName);
        await this.searchAndSelect(this.searchField, gearName, this.gearResult(gearName));
    }

    async continueToNextStep() {
        logStep('continueToNextStep');
        await this.saveContinueButton.click();
    }
}

export default new AddGearPage();

import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class AddPortPage extends BaseCatchRecordPage {

    get referenceNumber() {
        return $('~CatchRecord.addPort.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.addPort.heading');
    }

    get emptyStateText() {
        return $('~No ports added yet. Enter a port name or the nearest port to where you left and will return.');
    }

    get searchLabel() {
        return $('~CatchRecord.addPort.search');
    }

    get searchField() {
        return $('//XCUIElementTypeTextField[@name="CatchRecord.addPort.search"]');
    }

    selector(name: string) {
        return $(`~${name}`);
    }

    get saveContinueButton() {
        return $('~CatchRecord.addPort.saveContinue');
    }

    async enterPortSearch(term: string) {
        await this.searchField.setValue(term);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new AddPortPage();

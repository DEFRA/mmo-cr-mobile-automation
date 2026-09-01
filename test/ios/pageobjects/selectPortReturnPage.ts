import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class SelectPortReturnPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.selectPort.return.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.selectPort.return.heading');
    }

    get description() {
        return $('~Select the port name, or the nearest port to where you returned.');
    }

    get radioGroup() {
        return $('~CatchRecord.selectPort.return.radioGroup');
    }

    get peterheadOption() {
        return $('~CatchRecord.selectPort.return.option.peterhead');
    }

    get saveContinueButton() {
        return $('~CatchRecord.selectPort.return.saveContinue');
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.return.addAnother');
    }

    selector(name: string) {
        return $(`~${name}`);
    }

    async selectPeterhead() {
        await this.peterheadOption.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }

    async addAnotherPort() {
        await this.addAnotherPortButton.click();
    }
}

export default new SelectPortReturnPage();

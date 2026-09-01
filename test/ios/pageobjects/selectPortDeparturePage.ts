import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class SelectPortDeparturePage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.selectPort.departure.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.selectPort.departure.heading');
    }

    get description() {
        return $('~Select a port name or the nearest port to where you left.');
    }

    get radioGroup() {
        return $('~CatchRecord.selectPort.departure.radioGroup');
    }

    get peterheadOption() {
        return $('~CatchRecord.selectPort.departure.option.peterhead');
    }

    get saveContinueButton() {
        return $('~CatchRecord.selectPort.departure.saveContinue');
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.departure.addAnother');
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

export default new SelectPortDeparturePage();

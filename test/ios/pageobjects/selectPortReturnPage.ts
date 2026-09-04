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

    portOption(portName: string) {
        return this.selector(`CatchRecord.selectPort.return.option.${portName.toLowerCase()}`);
    }

    get saveContinueButton() {
        return $('~CatchRecord.selectPort.return.saveContinue');
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.return.addAnother');
    }

    async selectPort(portName: string) {
        await this.clickFirstExisting(
            this.optionCandidates('CatchRecord.selectPort.return.option', portName),
            `Could not find return port option: ${portName}`,
        );
    }

    async selectPeterhead() {
        await this.selectPort('Peterhead');
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }

    async addAnotherPort() {
        await this.addAnotherPortButton.click();
    }
}

export default new SelectPortReturnPage();

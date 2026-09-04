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

    portOption(portName: string) {
        return this.selector(`CatchRecord.selectPort.departure.option.${portName.toLowerCase()}`);
    }

    get saveContinueButton() {
        return $('~CatchRecord.selectPort.departure.saveContinue');
    }

    get validationError() {
        return $(
            '//XCUIElementTypeStaticText[contains(@label, "Select a port") or contains(@value, "Select a port")]',
        );
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.departure.addAnother');
    }

    async selectPort(portName: string) {
        await this.clickFirstExisting(
            this.optionCandidates('CatchRecord.selectPort.departure.option', portName),
            `Could not find departure port option: ${portName}`,
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

export default new SelectPortDeparturePage();

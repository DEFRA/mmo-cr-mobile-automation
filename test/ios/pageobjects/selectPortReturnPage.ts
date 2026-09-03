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

    async selectPort(portName: string) {
        const normalized = portName.toLowerCase();
        const candidates = [
            this.selector(`CatchRecord.selectPort.return.option.${normalized}`),
            this.selector(`CatchRecord.selectPort.return.option.${portName}`),
            this.selector(portName),
            this.selector(`CatchRecord.selectPort.return.option.${normalized.replace(/\s+/g, '')}`),
        ];

        for (const candidate of candidates) {
            if (await candidate.isExisting()) {
                await candidate.click();
                return;
            }
        }

        throw new Error(`Could not find return port option: ${portName}`);
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

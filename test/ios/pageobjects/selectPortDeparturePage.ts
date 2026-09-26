import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SelectPortDeparturePage extends BaseCatchRecordPage {
    protected pageId = 'selectPort.departure';

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
    get validationError() {
        return $(
            '//XCUIElementTypeStaticText[contains(@label, "Select a port") or contains(@value, "Select a port")]',
        );
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.departure.addAnother');
    }

    async selectPort(portName: string) {
        logStep('port selection');
        await this.clickFirstExisting(
            this.optionCandidates('CatchRecord.selectPort.departure.option', portName),
            `Could not find departure port option: ${portName}`,
        );
    }

    async selectPeterhead() {
        await this.selectPort('Peterhead');
    }
    async addAnotherPort() {
        await this.addAnotherPortButton.click();
    }
}

export default new SelectPortDeparturePage();

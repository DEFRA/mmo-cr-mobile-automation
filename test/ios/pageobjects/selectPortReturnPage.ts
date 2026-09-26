import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SelectPortReturnPage extends BaseCatchRecordPage {
    protected pageId = 'selectPort.return';

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
    get addAnotherPortButton() {
        return $('~CatchRecord.selectPort.return.addAnother');
    }

    async selectPort(portName: string) {
        logStep('port selection');
        await this.clickFirstExisting(
            this.optionCandidates('CatchRecord.selectPort.return.option', portName),
            `Could not find return port option: ${portName}`,
        );
    }

    async selectPeterhead() {
        await this.selectPort('Peterhead');
    }
    async addAnotherPort() {
        await this.addAnotherPortButton.click();
    }
}

export default new SelectPortReturnPage();

import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SelectGearPage extends BaseCatchRecordPage {
    protected pageId = 'selectGear';

    get description() {
        return $('~Select all the gears used on your vessel.');
    }

    get checkboxGroup() {
        return $('~CatchRecord.selectGear.checkboxGroup');
    }

    gearOption(code: string) {
        return this.selector(`CatchRecord.selectGear.option.${code.toLowerCase()}`);
    }

    get seineNetsLabel() {
        return $('~Seine nets (not specified)');
    }

    meshDetailText(meshSize: string) {
        return $(`~Mesh size (mm): ${meshSize}`);
    }

    get timesShotLabel() {
        return $('~CatchRecord.selectGear.variable.seine nets (not specified).timesShot');
    }

    get timesShotField() {
        return $(
            '//XCUIElementTypeTextField[@name="CatchRecord.selectGear.variable.sx.timesShot"]',
        );
    }

    get validationError() {
        return $('~CatchRecord.selectGear.error');
    }

    get addAnotherGearButton() {
        return $('~CatchRecord.selectGear.addAnother');
    }

    async selectSeineNets() {
        logStep('selectSeineNets');
        await this.gearOption('sx').click();
    }

    async enterTimesShot(value: string) {
        logStep('enterTimesShot');
        await this.timesShotField.setValue(value);
    }
    async addAnotherGear() {
        await this.addAnotherGearButton.click();
    }
}

export default new SelectGearPage();

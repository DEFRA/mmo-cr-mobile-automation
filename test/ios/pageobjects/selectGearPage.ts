import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn, logError } from '../../common/logger';

export class SelectGearPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.selectGear.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.selectGear.heading');
    }

    get description() {
        return $('~Select all the gears used on your vessel.');
    }

    get checkboxGroup() {
        return $('~CatchRecord.selectGear.checkboxGroup');
    }

    get seineNetsOption() {
        return $('~CatchRecord.selectGear.option.sx');
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

    get saveContinueButton() {
        return $('~CatchRecord.selectGear.saveContinue');
    }

    get addAnotherGearButton() {
        return $('~CatchRecord.selectGear.addAnother');
    }

    async selectSeineNets() {
        logStep('selectSeineNets');
        await this.seineNetsOption.click();
    }

    async enterTimesShot(value: string) {
        logStep('enterTimesShot');
        await this.timesShotField.setValue(value);
    }

    async continueToNextStep() {
        logStep('continueToNextStep');
        await this.saveContinueButton.click();
    }

    async addAnotherGear() {
        await this.addAnotherGearButton.click();
    }
}

export default new SelectGearPage();

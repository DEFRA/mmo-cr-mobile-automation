import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn, logError } from '../../common/logger';

export class GearMeasurementsPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.gearMeasurements.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.gearMeasurements.heading');
    }

    get wholeNumbersText() {
        return $('~All gear measurements must be whole numbers.');
    }

    get meshSizeLabel() {
        return $('~CatchRecord.gearMeasurements.field.meshSize');
    }

    get meshSizeField() {
        return $('//XCUIElementTypeTextField[@name="CatchRecord.gearMeasurements.field.meshSize"]');
    }

    get saveContinueButton() {
        return $('~CatchRecord.gearMeasurements.saveContinue');
    }

    async enterMeshSize(value: string) {
        logStep('enterMeshSize');
        await this.meshSizeField.setValue(value);
    }

    async continueToNextStep() {
        logStep('continueToNextStep');
        await this.saveContinueButton.click();
    }
}

export default new GearMeasurementsPage();

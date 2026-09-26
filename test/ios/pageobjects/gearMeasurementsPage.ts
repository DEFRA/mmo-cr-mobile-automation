import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class GearMeasurementsPage extends BaseCatchRecordPage {
    protected pageId = 'gearMeasurements';

    get wholeNumbersText() {
        return $('~All gear measurements must be whole numbers.');
    }

    get meshSizeLabel() {
        return $('~CatchRecord.gearMeasurements.field.meshSize');
    }

    get meshSizeField() {
        return $('//XCUIElementTypeTextField[@name="CatchRecord.gearMeasurements.field.meshSize"]');
    }
    async enterMeshSize(value: string) {
        logStep('enterMeshSize');
        await this.meshSizeField.setValue(value);
    }
}

export default new GearMeasurementsPage();

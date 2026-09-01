import { BaseCatchRecordPage } from './baseCatchRecordPage';

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

    selector(name: string) {
        return $(`~${name}`);
    }

    async enterMeshSize(value: string) {
        await this.meshSizeField.setValue(value);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new GearMeasurementsPage();

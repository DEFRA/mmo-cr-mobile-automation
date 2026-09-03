import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class CheckYourAnswersPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.checkYourAnswers.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.checkYourAnswers.heading');
    }

    get tripSection() {
        return $('~CatchRecord.checkYourAnswers.section.trip');
    }

    get gearSection() {
        return $('~CatchRecord.checkYourAnswers.section.gear');
    }

    get speciesCaughtSection() {
        return $('~CatchRecord.checkYourAnswers.section.speciesCaught');
    }

    vesselValue(value: string) {
        return this.selector(value);
    }

    departurePortValue(value: string) {
        return this.selector(value);
    }

    returnPortValue(value: string) {
        return this.selector(value);
    }

    statisticalAreaValue(value: string) {
        return this.selector(value);
    }

    gearNameValue(value: string) {
        return this.selector(value);
    }

    meshSizeValue(value: string) {
        return this.selector(value);
    }

    timesShotValue(value: string) {
        return this.selector(value);
    }

    speciesNameValue(value: string) {
        return this.selector(value);
    }

    weightAboveValue(value: string) {
        return this.selector(value);
    }

    get saveContinueButton() {
        return $('~CatchRecord.checkYourAnswers.saveContinue');
    }

    get changeTripVesselButton() {
        return $('~CatchRecord.checkYourAnswers.change.trip.vessel');
    }

    get changeDeparturePortButton() {
        return $('~CatchRecord.checkYourAnswers.change.trip.departurePort');
    }

    get changeReturnPortButton() {
        return $('~CatchRecord.checkYourAnswers.change.trip.returnPort');
    }

    get changeStatisticalAreaButton() {
        return $('~CatchRecord.checkYourAnswers.change.trip.statisticalArea');
    }

    get changeGearNameButton() {
        return $('~CatchRecord.checkYourAnswers.change.gear.name');
    }

    get changeMeshSizeButton() {
        return $('~CatchRecord.checkYourAnswers.change.gear.measurement.meshSize');
    }

    get changeTimesShotButton() {
        return $('~CatchRecord.checkYourAnswers.change.gear.variableMeasurement.timesShot');
    }

    get changeSpeciesNameButton() {
        return $('~CatchRecord.checkYourAnswers.change.speciesCaught.European lobster (LBE).name');
    }

    get changeWeightAboveButton() {
        return $('~CatchRecord.checkYourAnswers.change.speciesCaught.European lobster (LBE).above');
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }

    async changeTripVessel() {
        await this.changeTripVesselButton.click();
    }

    async changeDeparturePort() {
        await this.changeDeparturePortButton.click();
    }

    async changeReturnPort() {
        await this.changeReturnPortButton.click();
    }

    async changeStatisticalArea() {
        await this.changeStatisticalAreaButton.click();
    }

    async changeGearName() {
        await this.changeGearNameButton.click();
    }

    async changeMeshSize() {
        await this.changeMeshSizeButton.click();
    }

    async changeTimesShot() {
        await this.changeTimesShotButton.click();
    }

    async changeSpeciesName() {
        await this.changeSpeciesNameButton.click();
    }

    async changeWeightAbove() {
        await this.changeWeightAboveButton.click();
    }
}

export default new CheckYourAnswersPage();

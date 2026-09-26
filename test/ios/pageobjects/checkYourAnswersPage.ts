import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class CheckYourAnswersPage extends BaseCatchRecordPage {
    protected pageId = 'checkYourAnswers';

    get tripSection() {
        return $('~CatchRecord.checkYourAnswers.section.trip');
    }

    get gearSection() {
        return $(
            '-ios predicate string:name BEGINSWITH "CatchRecord.checkYourAnswers.section.gear."',
        );
    }

    get speciesCaughtSection() {
        return $('-ios predicate string:name == "Species"');
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
        return $(
            '-ios predicate string:name BEGINSWITH "CatchRecord.checkYourAnswers.change.gear." AND name ENDSWITH ".statisticalArea"',
        );
    }

    get changeGearNameButton() {
        return $(
            '-ios predicate string:name BEGINSWITH "CatchRecord.checkYourAnswers.change.gear." AND name ENDSWITH ".name" AND NOT (name CONTAINS ".speciesCaught.")',
        );
    }

    get changeMeshSizeButton() {
        return $(
            '-ios predicate string:name BEGINSWITH "CatchRecord.checkYourAnswers.change.gear." AND name ENDSWITH ".measurement.meshSize"',
        );
    }

    get changeTimesShotButton() {
        return $(
            '-ios predicate string:name BEGINSWITH "CatchRecord.checkYourAnswers.change.gear." AND name ENDSWITH ".variableMeasurement.timesShot"',
        );
    }

    get changeSpeciesNameButton() {
        return $('-ios predicate string:name CONTAINS ".speciesCaught." AND name ENDSWITH ".name"');
    }

    get changeWeightAboveButton() {
        return $(
            '-ios predicate string:name CONTAINS ".speciesCaught." AND name ENDSWITH ".above"',
        );
    }
    async changeTripVessel() {
        logStep('changeTripVessel');
        await this.changeTripVesselButton.click();
    }

    async changeDeparturePort() {
        logStep('changeDeparturePort');
        await this.changeDeparturePortButton.click();
    }

    async changeReturnPort() {
        logStep('changeReturnPort');
        await this.changeReturnPortButton.click();
    }

    async changeStatisticalArea() {
        logStep('changeStatisticalArea');
        await this.changeStatisticalAreaButton.click();
    }

    async changeGearName() {
        logStep('changeGearName');
        await this.changeGearNameButton.click();
    }

    async changeMeshSize() {
        logStep('changeMeshSize');
        await this.changeMeshSizeButton.click();
    }

    async changeTimesShot() {
        logStep('changeTimesShot');
        await this.changeTimesShotButton.click();
    }

    async changeSpeciesName() {
        logStep('changeSpeciesName');
        await this.changeSpeciesNameButton.click();
    }

    async changeWeightAbove() {
        logStep('changeWeightAbove');
        await this.changeWeightAboveButton.click();
    }
}

export default new CheckYourAnswersPage();

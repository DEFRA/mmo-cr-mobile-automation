import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class SelectVesselPage extends BaseCatchRecordPage {
    get selectVesselHeading() {
        return $('~Select the vessel for this trip');
    }

    get radioGroup() {
        return $('~CatchRecord.selectVessel.radioGroup');
    }

    get achillesVesselOption() {
        return $('~CatchRecord.selectVessel.option.achilles');
    }

    get herculesVesselOption() {
        return $('~CatchRecord.selectVessel.option.hercules');
    }

    get saveContinueButton() {
        return $('~CatchRecord.selectVessel.saveContinue');
    }

    async selectVessel(vesselName: 'ACHILLES' | 'HERCULES') {
        const vesselOption =
            vesselName === 'ACHILLES' ? this.achillesVesselOption : this.herculesVesselOption;

        await vesselOption.click();
        await this.saveContinueButton.click();
    }
}

export default new SelectVesselPage();

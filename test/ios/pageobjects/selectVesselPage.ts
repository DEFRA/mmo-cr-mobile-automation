import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SelectVesselPage extends BaseCatchRecordPage {
    protected pageId = 'selectVessel';

    get selectVesselHeading() {
        return $('~Select the vessel for this trip');
    }

    get radioGroup() {
        return $('~CatchRecord.selectVessel.radioGroup');
    }

    vesselOption(vesselName: string) {
        return this.selector(`CatchRecord.selectVessel.option.${vesselName.toLowerCase()}`);
    }
    get vesselValidationError() {
        return $('~CatchRecord.selectVessel.error');
    }

    async selectVessel(vesselName: 'ACHILLES' | 'HERCULES') {
        logStep('selectVessel with vessel name: ' + vesselName);
        await this.vesselOption(vesselName).click();
        await this.saveContinueButton.click();
    }
}

export default new SelectVesselPage();

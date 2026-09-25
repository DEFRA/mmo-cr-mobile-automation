import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn, logError } from '../../common/logger';

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

    get vesselValidationError() {
        return $(
            '//XCUIElementTypeStaticText[contains(@label, "Select a vessel") or contains(@value, "Select a vessel")]',
        );
    }

    async selectVessel(vesselName: 'ACHILLES' | 'HERCULES') {
        logStep('selectVessel with vessel name: ' + vesselName);
        const vesselOption =
            vesselName === 'ACHILLES' ? this.achillesVesselOption : this.herculesVesselOption;

        await vesselOption.click();
        await this.saveContinueButton.click();
    }
}

export default new SelectVesselPage();

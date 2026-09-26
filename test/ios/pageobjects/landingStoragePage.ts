import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class LandingStoragePage extends BaseCatchRecordPage {
    protected pageId = 'landingStorage';

    get description() {
        return $(
            '~For example, keeping white fish onboard for bait or storing shellfish in keep pots.',
        );
    }

    get radioGroup() {
        return $('~CatchRecord.landingStorage.radioGroup');
    }

    get yesOption() {
        return $('~CatchRecord.landingStorage.option.yes');
    }

    get noOption() {
        return $('~CatchRecord.landingStorage.option.no');
    }
    async selectLandingStorage(option: 'yes' | 'no') {
        logStep('selectLandingStorage with option: ' + option);
        const selectedOption = option === 'yes' ? this.yesOption : this.noOption;

        await selectedOption.click();
    }
}

export default new LandingStoragePage();

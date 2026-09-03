import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class LandingStoragePage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.landingStorage.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.landingStorage.heading');
    }

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

    get saveContinueButton() {
        return $('~CatchRecord.landingStorage.saveContinue');
    }

    async selectLandingStorage(option: 'yes' | 'no') {
        const selectedOption = option === 'yes' ? this.yesOption : this.noOption;

        await selectedOption.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new LandingStoragePage();

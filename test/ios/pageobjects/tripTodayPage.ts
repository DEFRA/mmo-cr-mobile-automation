import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class TripTodayPage extends BaseCatchRecordPage {

    get referenceNumber() {
        return $('~CatchRecord.tripToday.referenceNumber');
    }

    get questionHeading() {
        return $('~Did your trip start and finish today?');
    }

    get yesOptionText() {
        return $('~Select yes if you\'re recording today\'s trip now.');
    }

    get noOptionText() {
        return $('~Select no if you\'re recording a trip from another day — you\'ll then enter the dates.');
    }

    get radioGroup() {
        return $('~CatchRecord.tripToday.radioGroup');
    }

    get yesOption() {
        return $('~CatchRecord.tripToday.option.yes');
    }

    get noOption() {
        return $('~CatchRecord.tripToday.option.no');
    }

    get saveContinueButton() {
        return $('~CatchRecord.tripToday.saveContinue');
    }

    async selectTripToday(option: 'yes' | 'no') {
        const selectedOption = option === 'yes' ? this.yesOption : this.noOption;

        await selectedOption.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new TripTodayPage();

import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class TripDateDeparturePage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.tripDate.departure.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.tripDate.departure.heading');
    }

    get dateContainer() {
        return $('~When did you leave for your trip?');
    }

    get dateHelperText() {
        return $('~Enter the date you departed. For example, 31/03/2020');
    }

    get dayLabel() {
        return $('~Day');
    }

    get dayField() {
        return $('//XCUIElementTypeTextField[@name="Day"]');
    }

    get monthLabel() {
        return $('~Month');
    }

    get monthField() {
        return $('//XCUIElementTypeTextField[@name="Month"]');
    }

    get yearLabel() {
        return $('~Year');
    }

    get yearField() {
        return $('//XCUIElementTypeTextField[@name="Year"]');
    }

    get saveContinueButton() {
        return $('~CatchRecord.tripDate.departure.saveContinue');
    }

    get validationError() {
        return $('//XCUIElementTypeStaticText[@name="catchRecord.tripDate.validation.none"]');
    }

    async enterDepartureDate(day: string, month: string, year: string) {
        await this.dayField.setValue(day);
        await this.monthField.setValue(month);
        await this.yearField.setValue(year);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new TripDateDeparturePage();

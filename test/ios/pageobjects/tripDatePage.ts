import { BaseCatchRecordPage } from './baseCatchRecordPage';

/** Shared day/month/year date fields used by the departure and return trip date pages. */
export abstract class TripDatePage extends BaseCatchRecordPage {
    protected abstract readonly prefix: string;

    get referenceNumber() {
        return this.selector(`${this.prefix}.referenceNumber`);
    }

    get heading() {
        return this.selector(`${this.prefix}.heading`);
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
        return this.selector(`${this.prefix}.saveContinue`);
    }

    get validationError() {
        return $('//XCUIElementTypeStaticText[@name="catchRecord.tripDate.validation.none"]');
    }

    protected async enterDate(day: string, month: string, year: string) {
        await this.dayField.setValue(day);
        await this.monthField.setValue(month);
        await this.yearField.setValue(year);
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

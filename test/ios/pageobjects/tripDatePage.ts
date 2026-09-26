import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export abstract class TripDatePage extends BaseCatchRecordPage {
    get datePicker() {
        return $(`~CatchRecord.${this.pageId}.picker`);
    }

    get monthPicker() {
        return this.datePicker.$$('XCUIElementTypePickerWheel')[0];
    }

    get dayPicker() {
        return this.datePicker.$$('XCUIElementTypePickerWheel')[1];
    }

    get yearPicker() {
        return this.datePicker.$$('XCUIElementTypePickerWheel')[2];
    }

    get validationError() {
        return $('~catchRecord.tripDate.validation.none');
    }

    protected async enterDate(day: string, monthName: string, year: string) {
        logStep(`date entry: ${day} ${monthName} ${year}`);
        await this.scrollToElementIfExisting(this.datePicker);
        await this.monthPicker.addValue(monthName);
        await this.dayPicker.addValue(parseInt(day, 10).toString());
        await this.yearPicker.addValue(year);
    }
}

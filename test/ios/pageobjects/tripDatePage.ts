import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export abstract class TripDatePage extends BaseCatchRecordPage {
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

    get validationError() {
        return $('//XCUIElementTypeStaticText[@name="catchRecord.tripDate.validation.none"]');
    }

    protected async enterDate(day: string, month: string, year: string) {
        logStep('date entry');
        await this.dayField.setValue(day);
        await this.monthField.setValue(month);
        await this.yearField.setValue(year);
    }
}

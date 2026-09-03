import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class CatchLocationPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.catchLocation.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.catchLocation.heading');
    }

    get nearestAreasDescription() {
        return $('~The statistical areas nearest to your departure port are shown below.');
    }

    get selectAreaDescription() {
        return $('~Select the area where most of your catch was caught.');
    }

    get map() {
        return $('~CatchRecord.catchLocation.map');
    }

    get selectedArea() {
        return $('~CatchRecord.catchLocation.selectedArea');
    }

    get saveContinueButton() {
        return $('~CatchRecord.catchLocation.saveContinue');
    }

    mapPin(area: string) {
        return $(
            `//XCUIElementTypeOther[@name="Map pin"][following-sibling::*[1][@value="${area}"]]`,
        );
    }

    async selectArea(area: string) {
        await this.mapPin(area).click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new CatchLocationPage();

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

    get otherButton() {
        return $('~CatchRecord.catchLocation.otherButton');
    }

    get saveContinueButton() {
        return $('~CatchRecord.catchLocation.saveContinue');
    }

    mapPin(area: string) {
        return $(
            `//XCUIElementTypeOther[@name="Map pin"][following-sibling::*[1][@value="${area}"]]`,
        );
    }

    get firstAreaLabel() {
        return $('(//XCUIElementTypeOther[@name="Map pin"]/following-sibling::*[1])[1]');
    }

    get mapPins() {
        return $$('//XCUIElementTypeOther[@name="Map pin"]');
    }

    async visibleAreaCount() {
        await this.map.waitForDisplayed({ timeout: 10000 });
        const pins = await this.mapPins;
        return pins.length;
    }

    async zoomOut() {
        await this.map.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: pinch', {
            elementId: await this.map.elementId,
            scale: 0.5,
            velocity: -1,
        });
    }

    async zoomIn() {
        await this.map.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: pinch', {
            elementId: await this.map.elementId,
            scale: 2,
            velocity: 1,
        });
    }

    async selectArea(area: string) {
        await this.mapPin(area).click();
    }

    async openManualEntry() {
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    async selectFirstArea() {
        await this.firstAreaLabel.waitForDisplayed({ timeout: 10000 });
        await this.firstAreaLabel.click();
    }

    async selectRandomLocation() {
        await this.map.waitForDisplayed({ timeout: 10000 });

        const size = await this.map.getSize();
        const location = await this.map.getLocation();

        for (let attempt = 0; attempt < 5; attempt++) {
            const x = Math.floor(size.width * (0.2 + Math.random() * 0.6)) + location.x;
            const y = Math.floor(size.height * (0.2 + Math.random() * 0.6)) + location.y;

            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'catch-location-map-tap',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x, y },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerUp', button: 0 },
                    ],
                },
            ]);

            try {
                await this.selectedArea.waitForDisplayed({ timeout: 2000 });
                return;
            } catch {}
        }

        throw new Error('Could not select a random catch location.');
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new CatchLocationPage();

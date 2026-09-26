import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep, logWarn } from '../../common/logger';

export class CatchLocationPage extends BaseCatchRecordPage {
    protected pageId = 'catchLocation';

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
        logStep('zoomOut');
        await this.map.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: pinch', {
            elementId: await this.map.elementId,
            scale: 0.5,
            velocity: -1,
        });
    }

    async zoomIn() {
        logStep('zoomIn');
        await this.map.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: pinch', {
            elementId: await this.map.elementId,
            scale: 2,
            velocity: 1,
        });
    }

    async selectArea(area: string) {
        logStep('selectArea with area code: ' + area);
        await this.mapPin(area).click();
    }

    async openManualEntry() {
        logStep('openManualEntry');
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    async selectFirstArea() {
        logStep('selectFirstArea');
        await this.firstAreaLabel.waitForDisplayed({ timeout: 10000 });
        await this.firstAreaLabel.click();
    }

    async selectRandomLocation() {
        logStep('selectRandomLocation');
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
            } catch {
                logWarn('CatchLocationPage: retry selectRandomLocation');
            }
        }

        throw new Error('Could not select a random catch location.');
    }
}

export default new CatchLocationPage();

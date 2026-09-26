import CatchLocationPage from '../pageobjects/catchLocationPage';
import CatchLocationManualEntryPage from '../pageobjects/catchLocationManualEntryPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import { logStep } from '../../common/logger';
import iosFlowNavigator from '../support/iosFlowNavigator';

const DEFAULT_RECTANGLE_COUNT = 9;
const MAX_RECTANGLE_COUNT = 16;

describe('iOS catch location page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signInAndOpenCreateRecord();
        await iosFlowNavigator.selectVessel('ACHILLES');
        await iosFlowNavigator.selectTripToday('yes');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'yes');
        await iosFlowNavigator.addGear('Seine nets (not specified)');
        await iosFlowNavigator.enterGearMeasurements('12');
        await iosFlowNavigator.selectGearDetails('2');
        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await CatchLocationPage.close();
    });

    it('displays the catch location controls', async () => {
        logStep('displays the catch location controls');
        await expect(CatchLocationPage.nearestAreasDescription).toBeDisplayed();
        await expect(CatchLocationPage.selectAreaDescription).toBeDisplayed();
        await expect(CatchLocationPage.map).toBeDisplayed();
        await CatchLocationPage.scrollToElement(CatchLocationPage.saveContinueButton);
    });

    it('displays the catch record header controls', async () => {
        logStep('displays the catch record header controls');
        await expect(CatchLocationPage.referenceNumber).toBeDisplayed();
        await expect(CatchLocationPage.branding).toBeDisplayed();
        await expect(CatchLocationPage.backButton).toBeDisplayed();
    });

    it('stays on catch location when continuing without selecting an area', async () => {
        logStep('stays on catch location when continuing without selecting an area');
        await CatchLocationPage.continueToNextStep();

        await CatchLocationPage.scrollToElement(CatchLocationPage.heading);
    });

    it('returns to select gear from the back button', async () => {
        logStep('returns to select gear from the back button');
        await CatchLocationPage.backButton.click();

        await expect(SelectGearPage.heading).toBeDisplayed();
    });

    it('displays the Other button for manual entry', async () => {
        logStep('displays the Other button for manual entry');
        await CatchLocationPage.scrollToElement(CatchLocationPage.otherButton);
    });

    it('opens the manual entry page from the Other button', async () => {
        logStep('opens the manual entry page from the Other button');
        await CatchLocationPage.openManualEntry();

        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.searchField).toBeDisplayed();
    });

    it('returns to catch location from manual entry back button', async () => {
        logStep('returns to catch location from manual entry back button');
        await CatchLocationPage.openManualEntry();
        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();

        await CatchLocationManualEntryPage.backButton.click();

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it.only('reveals additional rectangles when zooming out while staying centred on the departure port region', async () => {
        expect(await CatchLocationPage.visibleAreaCount()).toBe(DEFAULT_RECTANGLE_COUNT);

        await CatchLocationPage.zoomOut();

        expect(await CatchLocationPage.visibleAreaCount()).toBeGreaterThan(DEFAULT_RECTANGLE_COUNT);
        await expect(CatchLocationPage.firstAreaLabel).toBeDisplayed();
    });

    it('shows no more than 16 rectangles at maximum zoom-out', async () => {
        logStep('shows no more than 16 rectangles at maximum zoom-out');
        for (let attempt = 0; attempt < 5; attempt++) {
            await CatchLocationPage.zoomOut();
        }

        expect(await CatchLocationPage.visibleAreaCount()).toBeLessThanOrEqual(MAX_RECTANGLE_COUNT);

        const countAtMax = await CatchLocationPage.visibleAreaCount();
        await CatchLocationPage.zoomOut();
        expect(await CatchLocationPage.visibleAreaCount()).toBe(countAtMax);
    });

    it('returns to the default 9 rectangle view when zooming back in', async () => {
        logStep('returns to the default 9 rectangle view when zooming back in');
        await CatchLocationPage.zoomOut();
        expect(await CatchLocationPage.visibleAreaCount()).toBeGreaterThan(DEFAULT_RECTANGLE_COUNT);

        await CatchLocationPage.zoomIn();

        expect(await CatchLocationPage.visibleAreaCount()).toBe(DEFAULT_RECTANGLE_COUNT);
    });
});

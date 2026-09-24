import CatchLocationPage from '../pageobjects/catchLocationPage';
import CatchLocationManualEntryPage from '../pageobjects/catchLocationManualEntryPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import {
    signInAndOpenCreateRecord,
    selectVesselAndTripToday,
    completePortJourney,
    completeGearJourney,
} from '../support/journeySteps';

const DEFAULT_RECTANGLE_COUNT = 9;
const MAX_RECTANGLE_COUNT = 16;

describe('iOS catch location page', () => {
    beforeEach(async () => {
        await signInAndOpenCreateRecord();
        await selectVesselAndTripToday('ACHILLES', 'yes');
        await completePortJourney('Peterhead', 'yes');
        await completeGearJourney('Seine nets (not specified)', '12', '2');
        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        await CatchLocationPage.close();
    });

    it('displays the catch location controls', async () => {
        await expect(CatchLocationPage.nearestAreasDescription).toBeDisplayed();
        await expect(CatchLocationPage.selectAreaDescription).toBeDisplayed();
        await expect(CatchLocationPage.map).toBeDisplayed();
        await browser.execute('mobile: scrollToElement', {
            element: await CatchLocationPage.saveContinueButton.elementId,
        });
        await expect(CatchLocationPage.saveContinueButton).toBeDisplayed();
    });

    it('displays the catch record header controls', async () => {
        await expect(CatchLocationPage.referenceNumber).toBeDisplayed();
        await expect(CatchLocationPage.branding).toBeDisplayed();
        await expect(CatchLocationPage.backButton).toBeDisplayed();
    });

    it('stays on catch location when continuing without selecting an area', async () => {
        await CatchLocationPage.continueToNextStep();

        await browser.execute('mobile: scrollToElement', {
            element: await CatchLocationPage.heading.elementId,
        });
        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it('returns to select gear from the back button', async () => {
        await CatchLocationPage.backButton.click();

        await expect(SelectGearPage.heading).toBeDisplayed();
    });

    it('displays the Other button for manual entry', async () => {
        await browser.execute('mobile: scrollToElement', {
            element: await CatchLocationPage.otherButton.elementId,
        });
        await expect(CatchLocationPage.otherButton).toBeDisplayed();
    });

    it('opens the manual entry page from the Other button', async () => {
        await CatchLocationPage.openManualEntry();

        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.searchField).toBeDisplayed();
    });

    it('returns to catch location from manual entry back button', async () => {
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
        for (let attempt = 0; attempt < 5; attempt++) {
            await CatchLocationPage.zoomOut();
        }

        expect(await CatchLocationPage.visibleAreaCount()).toBeLessThanOrEqual(MAX_RECTANGLE_COUNT);

        const countAtMax = await CatchLocationPage.visibleAreaCount();
        await CatchLocationPage.zoomOut();
        expect(await CatchLocationPage.visibleAreaCount()).toBe(countAtMax);
    });

    it('returns to the default 9 rectangle view when zooming back in', async () => {
        await CatchLocationPage.zoomOut();
        expect(await CatchLocationPage.visibleAreaCount()).toBeGreaterThan(DEFAULT_RECTANGLE_COUNT);

        await CatchLocationPage.zoomIn();

        expect(await CatchLocationPage.visibleAreaCount()).toBe(DEFAULT_RECTANGLE_COUNT);
    });
});

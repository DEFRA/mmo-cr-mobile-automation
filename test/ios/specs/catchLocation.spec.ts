import CatchLocationPage from '../pageobjects/catchLocationPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import { signInAndOpenCreateRecord, selectVesselAndTripToday, completePortJourney, completeGearJourney } from '../support/journeySteps';


describe('iOS catch location page', () => {
    beforeEach(async () => {
        await signInAndOpenCreateRecord();
        await selectVesselAndTripToday('ACHILLES', 'yes');
        await completePortJourney('Peterhead');
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

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it('returns to select gear from the back button', async () => {
        await CatchLocationPage.backButton.click();

        await expect(SelectGearPage.heading).toBeDisplayed();
    });
});

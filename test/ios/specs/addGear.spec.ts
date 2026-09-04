import AddGearPage from '../pageobjects/addGearPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import { signInAndOpenCreateRecord, selectVesselAndTripToday, completePortJourney } from '../support/journeySteps';

describe('iOS add gear page', () => {
    beforeEach(async () => {
        await signInAndOpenCreateRecord();
        await selectVesselAndTripToday('ACHILLES', 'yes');
        await completePortJourney('Peterhead');
        await expect(AddGearPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        await AddGearPage.close();
    });

    it('displays the add gear controls and empty state', async () => {
        await expect(AddGearPage.emptyStateText).toBeDisplayed();
        await expect(AddGearPage.exampleText).toBeDisplayed();
        await expect(AddGearPage.searchField).toBeDisplayed();
        await expect(AddGearPage.saveContinueButton).toBeDisplayed();
    });

    it('accepts a gear search value', async () => {
        await AddGearPage.enterGearSearch('Seine nets');

        await expect(AddGearPage.searchField).toHaveAttribute('value', 'Seine nets');
    });

    it('shows gear results after two characters and allows selection', async () => {
        const gearName = 'Seine nets (not specified)';
        const gearResult = AddGearPage.gearResult(gearName);

        await AddGearPage.enterGearSearch('S');
        await expect(gearResult).not.toBeDisplayed();

        await AddGearPage.enterGearSearch('Se');
        await gearResult.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: scrollToElement', {
            element: await gearResult.elementId,
        });
        await gearResult.click();

        await expect(AddGearPage.searchField).toHaveAttribute('value', gearName);
        await AddGearPage.continueToNextStep();
        await expect(GearMeasurementsPage.heading).toBeDisplayed();
    });

    it('stays on add gear when continuing without adding gear', async () => {
        await AddGearPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
        await expect(AddGearPage.emptyStateText).toBeDisplayed();
    });
});

import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import CatchLocationManualEntryPage from '../pageobjects/catchLocationManualEntryPage';
import {
    signInAndOpenCreateRecord,
    selectVesselAndTripToday,
    completePortJourney,
    completeGearJourney,
} from '../support/journeySteps';

// Valid statistical sub area code from the app's subrectangles reference data (near Peterhead).
const VALID_SUB_AREA = '44E83';
// Code absent from the reference dataset.
const INVALID_SUB_AREA = '99Z99';

describe('iOS catch location statistical sub area manual entry', () => {
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

    // Scenario 1: Display manual entry field
    it('displays the type-ahead field after selecting Other', async () => {
        await browser.execute('mobile: scrollToElement', {
            element: await CatchLocationPage.otherButton.elementId,
        });
        await CatchLocationPage.openManualEntry();

        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.searchField).toBeDisplayed();
    });

    // Scenario 2: Display matching results
    it('shows matching results with code, coordinates and ICES rectangle', async () => {
        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.searchForArea('44E8');

        const result = CatchLocationManualEntryPage.areaResult(VALID_SUB_AREA);
        await result.waitForDisplayed({ timeout: 10000 });
        await expect(result).toBeDisplayed();
        await expect(
            CatchLocationManualEntryPage.resultCoordinates(VALID_SUB_AREA),
        ).toBeDisplayed();
        await expect(
            CatchLocationManualEntryPage.resultIcesRectangle(VALID_SUB_AREA),
        ).toBeDisplayed();
    });

    // Scenario 3: Auto-populate coordinates
    it('auto-populates coordinates as the code is entered', async () => {
        await CatchLocationPage.openManualEntry();

        await CatchLocationManualEntryPage.searchForArea('44E8');
        await expect(CatchLocationManualEntryPage.coordinates).toBeDisplayed();

        await CatchLocationManualEntryPage.searchForArea(VALID_SUB_AREA);
        await expect(CatchLocationManualEntryPage.coordinates).toBeDisplayed();
    });

    // Scenario 4: Select a suggested area
    it('populates the field and advances after selecting a suggested area', async () => {
        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.selectArea(VALID_SUB_AREA);

        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute(
            'value',
            VALID_SUB_AREA,
        );

        await CatchLocationManualEntryPage.continueToNextStep();
        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });

    // Scenario 5: Invalid statistical sub area
    it('shows a validation error for a code not in the reference dataset', async () => {
        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.searchForArea(INVALID_SUB_AREA);
        await CatchLocationManualEntryPage.continueToNextStep();

        await expect(CatchLocationManualEntryPage.validationError).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
    });
});

import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import CatchLocationManualEntryPage from '../pageobjects/catchLocationManualEntryPage';
import { logStep } from '../../common/logger';
import iosFlowNavigator from '../support/iosFlowNavigator';

const VALID_SUB_AREA = '44E83';
const INVALID_SUB_AREA = '99Z99';

describe('iOS catch location statistical sub area manual entry', () => {
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

    it('displays the type-ahead field after selecting Other', async () => {
        logStep('displays the type-ahead field after selecting Other');
        await CatchLocationPage.scrollToElement(CatchLocationPage.otherButton);
        await CatchLocationPage.openManualEntry();

        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.searchField).toBeDisplayed();
    });

    it('shows matching results with code, coordinates and ICES rectangle', async () => {
        logStep('shows matching results with code, coordinates and ICES rectangle');

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

    it('auto-populates coordinates as the code is entered', async () => {
        logStep('auto-populates coordinates as the code is entered');

        await CatchLocationPage.openManualEntry();

        await CatchLocationManualEntryPage.searchForArea('44E8');
        await expect(CatchLocationManualEntryPage.coordinates).toBeDisplayed();

        await CatchLocationManualEntryPage.searchForArea(VALID_SUB_AREA);
        await expect(CatchLocationManualEntryPage.coordinates).toBeDisplayed();
    });

    it('populates the field and advances after selecting a suggested area', async () => {
        logStep('populates the field and advances after selecting a suggested area');

        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.selectArea(VALID_SUB_AREA);

        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute(
            'value',
            VALID_SUB_AREA,
        );

        await CatchLocationManualEntryPage.continueToNextStep();
        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });

    it('shows a validation error for a code not in the reference dataset', async () => {
        logStep('shows a validation error for a code not in the reference dataset');

        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.searchForArea(INVALID_SUB_AREA);
        await CatchLocationManualEntryPage.continueToNextStep();

        await expect(CatchLocationManualEntryPage.validationError).toBeDisplayed();
        await expect(CatchLocationManualEntryPage.heading).toBeDisplayed();
    });
});

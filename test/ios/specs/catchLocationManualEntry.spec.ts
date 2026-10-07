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
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
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

    it('shows the matching result and selects it, scrolling if needed', async () => {
        logStep('shows the matching result and selects it, scrolling if needed');

        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.searchForArea('44E8');

        const result = CatchLocationManualEntryPage.areaResult(VALID_SUB_AREA);
        await result.waitForExist({ timeout: 10000 });
        await CatchLocationManualEntryPage.scrollToElementIfExisting(result);
        await expect(result).toBeDisplayed();

        await result.click();
        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute(
            'value',
            VALID_SUB_AREA,
        );
    });

    it('displays the dropdown and selects a matching area from a 2 character search, scrolling if needed', async () => {
        logStep(
            'displays the dropdown and selects a matching area from a 2 character search, scrolling if needed',
        );

        await CatchLocationPage.openManualEntry();
        await CatchLocationManualEntryPage.selectArea(VALID_SUB_AREA, '44');

        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute(
            'value',
            VALID_SUB_AREA,
        );
    });

    it('replaces the previous search term when a new code is entered', async () => {
        logStep('replaces the previous search term when a new code is entered');

        await CatchLocationPage.openManualEntry();

        await CatchLocationManualEntryPage.searchForArea('44E81');
        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute('value', '44E81');

        await CatchLocationManualEntryPage.searchForArea(VALID_SUB_AREA);
        await expect(CatchLocationManualEntryPage.searchField).toHaveAttribute(
            'value',
            VALID_SUB_AREA,
        );
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

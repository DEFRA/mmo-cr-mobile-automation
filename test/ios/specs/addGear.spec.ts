import AddGearPage from '../pageobjects/addGearPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import { logStep } from '../../common/logger';
import iosFlowNavigator from '../support/iosFlowNavigator';

describe('iOS add gear page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
        await iosFlowNavigator.selectVessel('ACHILLES');
        await iosFlowNavigator.selectTripToday('yes');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'yes');
        await expect(AddGearPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await AddGearPage.close();
    });

    it('displays the add gear controls and empty state', async () => {
        logStep('displays the add gear controls and empty state');
        await expect(AddGearPage.emptyStateText).toBeDisplayed();
        await expect(AddGearPage.exampleText).toBeDisplayed();
        await expect(AddGearPage.searchField).toBeDisplayed();
        await expect(AddGearPage.saveContinueButton).toBeDisplayed();
    });

    it('accepts a gear search value', async () => {
        logStep('accepts a gear search value');
        await AddGearPage.enterGearSearch('Seine nets');

        await expect(AddGearPage.searchField).toHaveAttribute('value', 'Seine nets');
    });

    it('shows gear results after exactly two characters and allows selection', async () => {
        logStep('shows gear results after exactly two characters and allows selection');
        const gearName = 'Seine nets (not specified)';
        const gearResult = AddGearPage.gearResult(gearName);

        await AddGearPage.enterGearSearch('S');
        await expect(gearResult).not.toBeDisplayed();

        const searchTerm = 'Se';
        await AddGearPage.enterGearSearch(searchTerm);
        await gearResult.waitForExist({ timeout: 10000 });
        await AddGearPage.scrollToElementIfExisting(gearResult);

        await expect(gearResult).toBeDisplayed();

        const resultName = await gearResult.getAttribute('name');
        expect(resultName?.toLowerCase()).toContain(searchTerm.toLowerCase());

        await gearResult.click();

        await expect(AddGearPage.searchField).toHaveAttribute('value', gearName);
        await AddGearPage.continueToNextStep();
        await expect(GearMeasurementsPage.heading).toBeDisplayed();
    });

    it('shows validation error when continuing with only one character', async () => {
        logStep('shows validation error when continuing with only one character');
        await AddGearPage.enterGearSearch('S');
        await AddGearPage.continueToNextStep();

        await expect(AddGearPage.validationError).toBeDisplayed();
        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it('stays on add gear when continuing without adding gear', async () => {
        logStep('stays on add gear when continuing without adding gear');
        await AddGearPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
        await expect(AddGearPage.emptyStateText).toBeDisplayed();
    });
});

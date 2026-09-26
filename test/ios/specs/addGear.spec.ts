import AddGearPage from '../pageobjects/addGearPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import { logStep } from '../../common/logger';
import iosFlowNavigator from '../support/iosFlowNavigator';

describe('iOS add gear page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signInAndOpenCreateRecord();
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

    it('shows gear results after two characters and allows selection', async () => {
        logStep('shows gear results after two characters and allows selection');
        const gearName = 'Seine nets (not specified)';
        const gearResult = AddGearPage.gearResult(gearName);

        await AddGearPage.enterGearSearch('S');
        await expect(gearResult).not.toBeDisplayed();

        await AddGearPage.enterGearSearch('Seine nets');
        await gearResult.waitForDisplayed({ timeout: 10000 });
        await AddGearPage.scrollToElement(gearResult);
        await gearResult.click();

        await expect(AddGearPage.searchField).toHaveAttribute('value', gearName);
        await AddGearPage.continueToNextStep();
        await expect(GearMeasurementsPage.heading).toBeDisplayed();
    });

    it('stays on add gear when continuing without adding gear', async () => {
        logStep('stays on add gear when continuing without adding gear');
        await AddGearPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
        await expect(AddGearPage.emptyStateText).toBeDisplayed();
    });
});

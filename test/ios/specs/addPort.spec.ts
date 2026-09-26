import AddPortPage from '../pageobjects/addPortPage';
import AddGearPage from '../pageobjects/addGearPage';
import ConfirmSamePortPage from '../pageobjects/confirmSamePortPage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import iosFlowNavigator from '../support/iosFlowNavigator';
import { logStep } from '../../common/logger';

describe('iOS add port page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signInAndOpenCreateRecord();
        await iosFlowNavigator.selectVessel('ACHILLES');
        await iosFlowNavigator.selectTripToday('yes');
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await AddPortPage.close();
    });

    it('displays the add port controls and empty state', async () => {
        logStep('displays the add port controls and empty state');
        await expect(AddPortPage.heading).toBeDisplayed();
        await expect(AddPortPage.emptyStateText).toBeDisplayed();
        await expect(AddPortPage.searchField).toBeDisplayed();
        await expect(AddPortPage.saveContinueButton).toBeDisplayed();
    });

    it('keeps the user on add port when continuing without adding a port', async () => {
        logStep('keeps the user on add port when continuing without adding a port');
        await AddPortPage.continueToNextStep();

        await expect(AddPortPage.heading).toBeDisplayed();
        await expect(AddPortPage.emptyStateText).toBeDisplayed();
    });

    it('shows no dropdown for one character but reveals selectable matches for two', async () => {
        logStep('shows no dropdown for one character but reveals selectable matches for two');
        const portResult = AddPortPage.portResult('Fraserburgh');

        await AddPortPage.enterPortSearch('F');
        await expect(portResult).not.toBeDisplayed();

        await AddPortPage.enterPortSearch('Fr');
        await portResult.waitForDisplayed({ timeout: 10000 });
        await expect(portResult).toBeDisplayed();

        await AddPortPage.scrollToElement(portResult);
        await portResult.click();

        await expect(AddPortPage.searchField).toHaveAttribute('value', 'Fraserburgh');
    });

    it('requires a departure port selection and supports adding another port', async () => {
        logStep('requires a departure port selection and supports adding another port');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'no');

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await expect(SelectPortDeparturePage.peterheadOption).toBeDisplayed();
        await expect(SelectPortDeparturePage.peterheadOption).not.toBeSelected();

        await SelectPortDeparturePage.saveContinueButton.click();
        await expect(SelectPortDeparturePage.validationError).toBeDisplayed();
        await expect(SelectPortDeparturePage.heading).toBeDisplayed();

        await expect(SelectPortDeparturePage.addAnotherPortButton).toBeDisplayed();
        await SelectPortDeparturePage.addAnotherPortButton.click();
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('allows the user to add multiple ports', async () => {
        logStep('allows the user to add multiple ports');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'no');

        await SelectPortDeparturePage.addAnotherPortButton.click();
        await expect(AddPortPage.heading).toBeDisplayed();
        await AddPortPage.selectPort('Fraserburgh');
        await AddPortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Peterhead')).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Fraserburgh')).toBeDisplayed();
    });

    it('navigates to return port selection after choosing a departure port', async () => {
        logStep('navigates to return port selection after choosing a departure port');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'no');

        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
    });

    it('allows the user to select a return port', async () => {
        logStep('allows the user to select a return port');
        await iosFlowNavigator.addPort('Peterhead');
        await iosFlowNavigator.confirmSamePort('Peterhead', 'no');

        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await expect(SelectPortReturnPage.peterheadOption).toBeDisplayed();
        await expect(SelectPortReturnPage.peterheadOption).not.toBeSelected();

        await SelectPortReturnPage.peterheadOption.click();
        await expect(SelectPortReturnPage.peterheadOption).toBeSelected();
    });

    it('selecting yes for the same port opens add gear', async () => {
        logStep('selecting yes for the same port opens add gear');
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await expect(ConfirmSamePortPage.headingForPort('Peterhead')).toBeDisplayed();
        await ConfirmSamePortPage.yesOption.click();
        await ConfirmSamePortPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it('selecting no for the same port opens port selection', async () => {
        logStep('selecting no for the same port opens port selection');
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await expect(ConfirmSamePortPage.headingForPort('Peterhead')).toBeDisplayed();
        await ConfirmSamePortPage.noOption.click();
        await ConfirmSamePortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await SelectPortReturnPage.peterheadOption.click();
        await SelectPortReturnPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
    });
});

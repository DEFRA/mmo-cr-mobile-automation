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
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
        await iosFlowNavigator.selectVessel('ACHILLES');
        await iosFlowNavigator.selectTripToday('yes');
        await expect(AddPortPage.heading).toBeDisplayed();
        const headingValue = await AddPortPage.heading.getAttribute('value');
        expect(headingValue).toContain('ACHILLES');
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

    it('shows validation error when continuing with only one character', async () => {
        logStep('shows validation error when continuing with only one character');
        await AddPortPage.enterPortSearch('F');
        await AddPortPage.continueToNextStep();

        await expect(AddPortPage.validationError).toBeDisplayed();
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('requires a departure port selection and supports adding another port', async () => {
        logStep('requires a departure port selection and supports adding another port');
        await iosFlowNavigator.addPort('Peel');
        await iosFlowNavigator.confirmSamePort('Peel', 'no');

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Peel')).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Peel')).not.toBeSelected();

        await SelectPortDeparturePage.saveContinueButton.click();
        await expect(SelectPortDeparturePage.validationError).toBeDisplayed();

        await expect(SelectPortDeparturePage.addAnotherPortButton).toBeDisplayed();
        await SelectPortDeparturePage.addAnotherPortButton.click();
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('allows the user to add multiple ports', async () => {
        logStep('allows the user to add multiple ports');
        await iosFlowNavigator.addPort('Peel');
        await iosFlowNavigator.confirmSamePort('Peel', 'no');

        await SelectPortDeparturePage.addAnotherPortButton.click();
        await expect(AddPortPage.heading).toBeDisplayed();
        await AddPortPage.selectPort('Fraserburgh');
        await AddPortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Peel')).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Fraserburgh')).toBeDisplayed();
    });

    it('navigates to return port selection after choosing a departure port', async () => {
        logStep('navigates to return port selection after choosing a departure port');
        await iosFlowNavigator.addPort('Peel');
        await iosFlowNavigator.confirmSamePort('Peel', 'no');

        await SelectPortDeparturePage.portOption('Peel').click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
    });

    it('allows the user to select a return port', async () => {
        logStep('allows the user to select a return port');
        await iosFlowNavigator.addPort('Peel');
        await iosFlowNavigator.confirmSamePort('Peel', 'no');

        await SelectPortDeparturePage.portOption('Peel').click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await expect(SelectPortReturnPage.portOption('Peel')).toBeDisplayed();
        await expect(SelectPortReturnPage.portOption('Peel')).not.toBeSelected();

        await SelectPortReturnPage.portOption('Peel').click();
        await expect(SelectPortReturnPage.portOption('Peel')).toBeSelected();
    });

    it('selecting yes for the same port opens add gear', async () => {
        logStep('selecting yes for the same port opens add gear');
        await AddPortPage.selectPort('Peel');
        await AddPortPage.continueToNextStep();

        await expect(ConfirmSamePortPage.headingForPort('Peel')).toBeDisplayed();
        await ConfirmSamePortPage.yesOption.click();
        await ConfirmSamePortPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it('selecting no for the same port opens port selection', async () => {
        logStep('selecting no for the same port opens port selection');
        await AddPortPage.selectPort('Peel');
        await AddPortPage.continueToNextStep();

        await expect(ConfirmSamePortPage.headingForPort('Peel')).toBeDisplayed();
        await ConfirmSamePortPage.noOption.click();
        await ConfirmSamePortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await SelectPortDeparturePage.portOption('Peel').click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await SelectPortReturnPage.portOption('Peel').click();
        await SelectPortReturnPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
    });
    it('requires a return port selection and displays a validation error when omitted', async () => {
        logStep('requires a return port selection and displays a validation error when omitted');
        await iosFlowNavigator.addPort('Peel');
        await iosFlowNavigator.confirmSamePort('Peel', 'no');

        await SelectPortDeparturePage.portOption('Peel').click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await expect(SelectPortReturnPage.portOption('Peel')).toBeDisplayed();

        await SelectPortReturnPage.saveContinueButton.click();
        await expect(SelectPortReturnPage.validationError).toBeDisplayed();

        await expect(SelectPortReturnPage.addAnotherPortButton).toBeDisplayed();
    });
});

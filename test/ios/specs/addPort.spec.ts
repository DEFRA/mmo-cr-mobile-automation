import AddPortPage from '../pageobjects/addPortPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import HomePage from '../pageobjects/homePage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

describe('iOS add port page', () => {
    const testEmail = process.env.IOS_TEST_EMAIL;
    const testPassword = process.env.IOS_TEST_PASSWORD;

    beforeEach(async () => {
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run Add port tests.',
            );
        }

        await SignInPage.openApp();
        await SignInPage.signIn(testEmail, testPassword);
        await HomePage.scrollToElement(HomePage.createRecordButton);
        await HomePage.clickCreateRecordButton();
        await SelectVesselPage.achillesVesselOption.click();
        await SelectVesselPage.saveContinueButton.click();
        await TripTodayPage.yesOption.click();
        await TripTodayPage.saveContinueButton.click();
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        await AddPortPage.close();
    });

    it('displays the add port controls and empty state', async () => {
        await expect(AddPortPage.heading).toBeDisplayed();
        await expect(AddPortPage.emptyStateText).toBeDisplayed();
        await expect(AddPortPage.searchField).toBeDisplayed();
        await expect(AddPortPage.saveContinueButton).toBeDisplayed();
    });

    it('keeps the user on add port when continuing without adding a port', async () => {
        await AddPortPage.continueToNextStep();

        await expect(AddPortPage.heading).toBeDisplayed();
        await expect(AddPortPage.emptyStateText).toBeDisplayed();
    });

    it('selects a matching port and updates the search field', async () => {
        const portResult = AddPortPage.portResult('Fraserburgh');

        await AddPortPage.enterPortSearch('F');
        await expect(portResult).not.toBeDisplayed();

        await AddPortPage.enterPortSearch('Fr');
        await portResult.waitForDisplayed({ timeout: 10000 });
        await browser.execute('mobile: scrollToElement', {
            element: await portResult.elementId,
        });
        await portResult.click();

        await expect(AddPortPage.searchField).toHaveAttribute('value', 'Fraserburgh');
    });

    it('requires a departure port selection and supports adding another port', async () => {
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

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
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();
        await SelectPortDeparturePage.addAnotherPortButton.click();

        await expect(AddPortPage.heading).toBeDisplayed();
        await AddPortPage.selectPort('Fraserburgh');
        await AddPortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Peterhead')).toBeDisplayed();
        await expect(SelectPortDeparturePage.portOption('Fraserburgh')).toBeDisplayed();
    });

    it('navigates to return port selection after choosing a departure port', async () => {
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
    });

    it('allows the user to select a return port', async () => {
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await expect(SelectPortReturnPage.peterheadOption).toBeDisplayed();
        await expect(SelectPortReturnPage.peterheadOption).not.toBeSelected();

        await SelectPortReturnPage.peterheadOption.click();
        await expect(SelectPortReturnPage.peterheadOption).toBeSelected();
    });

    it('continues from selected return port to catch location', async () => {
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await SelectPortReturnPage.peterheadOption.click();
        await SelectPortReturnPage.continueToNextStep();

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });
});

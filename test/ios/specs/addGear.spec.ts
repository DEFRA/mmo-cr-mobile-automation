import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

describe('iOS add gear page', () => {
    const testEmail = process.env.IOS_TEST_EMAIL;
    const testPassword = process.env.IOS_TEST_PASSWORD;

    beforeEach(async () => {
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run Add gear tests.',
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
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();
        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();
        await SelectPortReturnPage.peterheadOption.click();
        await SelectPortReturnPage.continueToNextStep();
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

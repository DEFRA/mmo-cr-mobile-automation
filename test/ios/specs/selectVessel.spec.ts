import HomePage from '../pageobjects/homePage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

const testEmail = process.env.IOS_TEST_EMAIL;
const testPassword = process.env.IOS_TEST_PASSWORD;

describe('iOS select vessel page', () => {
    beforeEach(async () => {
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run Select vessel tests.',
            );
        }

        await SignInPage.openApp();
        await SignInPage.signIn(testEmail, testPassword);
        await HomePage.scrollToElement(HomePage.createRecordButton);
        await HomePage.clickCreateRecordButton();
        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
    });

    afterEach(async () => {
        await SelectVesselPage.close();
    });

    it('shows both vessel options unselected initially', async () => {
        await expect(SelectVesselPage.achillesVesselOption).not.toBeSelected();
        await expect(SelectVesselPage.herculesVesselOption).not.toBeSelected();
    });

    it('keeps the selected vessel selected and allows changing the selection', async () => {
        await SelectVesselPage.achillesVesselOption.click();
        await expect(SelectVesselPage.achillesVesselOption).toBeSelected();
        await expect(SelectVesselPage.herculesVesselOption).not.toBeSelected();

        await SelectVesselPage.achillesVesselOption.click();
        await expect(SelectVesselPage.achillesVesselOption).toBeSelected();

        await SelectVesselPage.herculesVesselOption.click();
        await expect(SelectVesselPage.achillesVesselOption).not.toBeSelected();
        await expect(SelectVesselPage.herculesVesselOption).toBeSelected();
    });

    it('shows a validation error when continuing without selecting a vessel', async () => {
        await SelectVesselPage.saveContinueButton.click();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
        await expect(SelectVesselPage.vesselValidationError).toBeDisplayed();
    });

    it('continues to the trip-today page after selecting ACHILLES', async () => {
        await SelectVesselPage.achillesVesselOption.click();
        await SelectVesselPage.saveContinueButton.click();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
    });

    it('continues to the trip-today page after selecting HERCULES', async () => {
        await SelectVesselPage.herculesVesselOption.click();
        await SelectVesselPage.saveContinueButton.click();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
    });

    it('returns to the dashboard when the back link is clicked', async () => {
        await SelectVesselPage.backButton.click();

        await HomePage.scrollToElement(HomePage.yourTripsHeading);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
    });
});

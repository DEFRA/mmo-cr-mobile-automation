import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import SelectGearPage from '../pageobjects/selectGearPage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripDateDeparturePage from '../pageobjects/tripDateDeparturePage';
import TripDateReturnPage from '../pageobjects/tripDateReturnPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

const testEmail = process.env.IOS_TEST_EMAIL;
const testPassword = process.env.IOS_TEST_PASSWORD;

describe('iOS catch record flow', () => {
    beforeEach(async () => {
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run catch record tests.',
            );
        }

        await SignInPage.openApp();
        await SignInPage.signIn(testEmail, testPassword);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
    });

    afterEach(async () => {
        await HomePage.close();
    });

    it('opens the trip today screen from the home page', async () => {
        await HomePage.clickCreateRecordButton();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
        await expect(TripTodayPage.yesOption).toBeDisplayed();
        await expect(TripTodayPage.noOption).toBeDisplayed();
    });

    it('moves through the trip date flow and reaches departure port selection', async () => {
        await HomePage.clickCreateRecordButton();
        await TripTodayPage.selectTripToday('no');
        await TripTodayPage.continueToNextStep();

        await expect(TripDateDeparturePage.heading).toBeDisplayed();
        await TripDateDeparturePage.enterDepartureDate('20', '08', '2026');
        await TripDateDeparturePage.continueToNextStep();

        await expect(TripDateReturnPage.heading).toBeDisplayed();
        await TripDateReturnPage.enterReturnDate('22', '08', '2026');
        await TripDateReturnPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
    });

    it('completes the catch record flow through the gear measurements screen', async () => {
        await HomePage.clickCreateRecordButton();
        await TripTodayPage.selectTripToday('no');
        await TripTodayPage.continueToNextStep();

        await TripDateDeparturePage.enterDepartureDate('20', '08', '2026');
        await TripDateDeparturePage.continueToNextStep();

        await TripDateReturnPage.enterReturnDate('22', '08', '2026');
        await TripDateReturnPage.continueToNextStep();

        await SelectPortDeparturePage.selectPeterhead();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await SelectPortReturnPage.selectPeterhead();
        await SelectPortReturnPage.continueToNextStep();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
        await SelectVesselPage.selectVessel('ACHILLES');

        await expect(SelectGearPage.heading).toBeDisplayed();
        await SelectGearPage.selectSeineNets();
        await SelectGearPage.enterTimesShot('2');
        await SelectGearPage.continueToNextStep();

        await expect(GearMeasurementsPage.heading).toBeDisplayed();
    });
});

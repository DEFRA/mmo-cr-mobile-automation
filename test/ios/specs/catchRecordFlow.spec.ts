import AddPortPage from '../pageobjects/addPortPage';
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

const getDateParts = (date: Date) => ({
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
});

const startNewCatchRecord = async () => {
    await HomePage.clickCreateRecordButton();
    await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
    await expect(AddPortPage.heading).toBeDisplayed();
    await AddPortPage.enterPortSearch('Peterhead');
    await AddPortPage.continueToNextStep();
};

const enterTripDatesWithin24Hours = async (departureDate = new Date()) => {
    const returnDate = new Date(departureDate.getTime() + 23 * 60 * 60 * 1000);
    const departureParts = getDateParts(departureDate);
    const returnParts = getDateParts(returnDate);

    await SelectVesselPage.selectVessel('ACHILLES');
    await TripTodayPage.selectTripToday('no');
    await TripTodayPage.continueToNextStep();

    await expect(TripDateDeparturePage.heading).toBeDisplayed();
    await TripDateDeparturePage.enterDepartureDate(
        departureParts.day,
        departureParts.month,
        departureParts.year,
    );
    await TripDateDeparturePage.continueToNextStep();

    await expect(TripDateReturnPage.heading).toBeDisplayed();
    await TripDateReturnPage.enterReturnDate(returnParts.day, returnParts.month, returnParts.year);
    await TripDateReturnPage.continueToNextStep();
};

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
        //await HomePage.close();
    });

    it('opens the vessel selection screen immediately after create record', async () => {
        await startNewCatchRecord();

        await expect(SelectVesselPage.achillesVesselOption).toBeDisplayed();
        await expect(SelectVesselPage.herculesVesselOption).toBeDisplayed();
    });

    it('moves through the trip date flow and reaches departure port selection', async () => {
        await startNewCatchRecord();
        await enterTripDatesWithin24Hours();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
    });

    it('completes the catch record flow through the gear measurements screen', async () => {
        await startNewCatchRecord();
        await enterTripDatesWithin24Hours();

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

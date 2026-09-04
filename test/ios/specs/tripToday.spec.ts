import AddPortPage from '../pageobjects/addPortPage';
import HomePage from '../pageobjects/homePage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import SubmissionNudgePage from '../pageobjects/submissionNudgePage';
import TripDateDeparturePage from '../pageobjects/tripDateDeparturePage';
import TripDateReturnPage from '../pageobjects/tripDateReturnPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

const testEmail = process.env.IOS_TEST_EMAIL;
const testPassword = process.env.IOS_TEST_PASSWORD;

function datePartsFromToday(daysAgo: number) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);

    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        year: String(date.getFullYear()),
    };
}
const vesselName = ['ACHILLES', 'HERCULES'];

vesselName.forEach((vessel) => {
    describe(`iOS trip today page for vessel ${vessel}`, () => {
        beforeEach(async () => {
            if (!testEmail || !testPassword) {
                throw new Error(
                    'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run Trip today tests.',
                );
            }

            await SignInPage.openApp();
            await SignInPage.signIn(testEmail, testPassword);
            await HomePage.scrollToElement(HomePage.createRecordButton);
            await HomePage.clickCreateRecordButton();
            if (vessel === 'ACHILLES') {
                await SelectVesselPage.achillesVesselOption.click();
            } else {
                await SelectVesselPage.herculesVesselOption.click();
            }
            await SelectVesselPage.saveContinueButton.click();
            await expect(TripTodayPage.questionHeading).toBeDisplayed();
        });

        afterEach(async () => {
            await TripTodayPage.close();
        });

        it('shows the yes and no options', async () => {
            await expect(TripTodayPage.yesOption).toBeDisplayed();
            await expect(TripTodayPage.noOption).toBeDisplayed();
        });

        it('shows a validation error when continuing without selecting yes or no', async () => {
            await TripTodayPage.continueToNextStep();

            await expect(TripTodayPage.questionHeading).toBeDisplayed();
            await expect(TripTodayPage.validationError).toBeDisplayed();
        });

        it('goes directly to add port when yes is selected', async () => {
            await TripTodayPage.selectTripToday('yes');
            await TripTodayPage.continueToNextStep();

            await expect(AddPortPage.heading).toBeDisplayed();
        });

        it('shows departure date validation when no is selected without a date', async () => {
            await TripTodayPage.selectTripToday('no');
            await TripTodayPage.continueToNextStep();

            await expect(TripDateDeparturePage.heading).toBeDisplayed();
            await TripDateDeparturePage.continueToNextStep();

            await expect(TripDateDeparturePage.heading).toBeDisplayed();
            await expect(TripDateDeparturePage.validationError).toBeDisplayed();
        });

        it('goes to return date and then add port after entering valid dates', async () => {
            await TripTodayPage.selectTripToday('no');
            await TripTodayPage.continueToNextStep();
            const departureDate = datePartsFromToday(1);
            const returnDate = datePartsFromToday(0);
            await TripDateDeparturePage.enterDepartureDate(
                departureDate.day,
                departureDate.month,
                departureDate.year,
            );
            await TripDateDeparturePage.continueToNextStep();

            await expect(TripDateReturnPage.heading).toBeDisplayed();
            await TripDateReturnPage.enterReturnDate(
                returnDate.day,
                returnDate.month,
                returnDate.year,
            );
            await TripDateReturnPage.continueToNextStep();

            await expect(AddPortPage.heading).toBeDisplayed();
        });

        it('shows an error when the trip ended more than 24 hours ago', async () => {
            await TripTodayPage.selectTripToday('no');
            await TripTodayPage.continueToNextStep();
            const departureDate = datePartsFromToday(3);
            const returnDate = datePartsFromToday(2);
            await TripDateDeparturePage.enterDepartureDate(
                departureDate.day,
                departureDate.month,
                departureDate.year,
            );
            await TripDateDeparturePage.continueToNextStep();
            await TripDateReturnPage.enterReturnDate(
                returnDate.day,
                returnDate.month,
                returnDate.year,
            );
            await TripDateReturnPage.continueToNextStep();

            await expect(SubmissionNudgePage.heading).toBeDisplayed();
            await expect(SubmissionNudgePage.submissionWindowMessage).toBeDisplayed();
            await expect(SubmissionNudgePage.checkDateLink).toBeDisplayed();
            await expect(SubmissionNudgePage.saveContinueButton).toBeDisplayed();
            await SubmissionNudgePage.continueToNextStep();
            await expect(AddPortPage.heading).toBeDisplayed();
        });

        it('allows correcting the trip end date from the submission nudge', async () => {
            await TripTodayPage.selectTripToday('no');
            await TripTodayPage.continueToNextStep();
            const departureDate = datePartsFromToday(3);
            const lateReturnDate = datePartsFromToday(2);
            const validReturnDate = datePartsFromToday(0);
            await TripDateDeparturePage.enterDepartureDate(
                departureDate.day,
                departureDate.month,
                departureDate.year,
            );
            await TripDateDeparturePage.continueToNextStep();
            await TripDateReturnPage.enterReturnDate(
                lateReturnDate.day,
                lateReturnDate.month,
                lateReturnDate.year,
            );
            await TripDateReturnPage.continueToNextStep();

            await expect(SubmissionNudgePage.heading).toBeDisplayed();
            await SubmissionNudgePage.checkTripEndDate();
            await expect(TripDateReturnPage.heading).toBeDisplayed();
            await TripDateReturnPage.enterReturnDate(
                validReturnDate.day,
                validReturnDate.month,
                validReturnDate.year,
            );
            await TripDateReturnPage.continueToNextStep();
            await expect(AddPortPage.heading).toBeDisplayed();
        });
    });
});

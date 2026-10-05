import AddPortPage from '../pageobjects/addPortPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SubmissionNudgePage from '../pageobjects/submissionNudgePage';
import TripDateDeparturePage from '../pageobjects/tripDateDeparturePage';
import TripDateReturnPage from '../pageobjects/tripDateReturnPage';
import TripTodayPage from '../pageobjects/tripTodayPage';
import iosFlowNavigator from '../support/iosFlowNavigator';
import { logStep } from '../../common/logger';
import { datePartsFromToday } from '../../common/dateHelper';

const vessels = ['ACHILLES', 'HERCULES'] as const;
describe(`iOS trip today page for vessel ${vessels[0]}`, () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
        await SelectVesselPage.selectVessel(vessels[0] as 'ACHILLES' | 'HERCULES');
        await expect(TripTodayPage.questionHeading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await TripTodayPage.close();
    });

    it('shows the yes and no options', async () => {
        logStep('shows the yes and no options');
        await expect(TripTodayPage.yesOption).toBeDisplayed();
        await expect(TripTodayPage.noOption).toBeDisplayed();
    });

    it('shows a validation error when continuing without selecting yes or no', async () => {
        logStep('shows a validation error when continuing without selecting yes or no');
        await TripTodayPage.continueToNextStep();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
        await expect(TripTodayPage.validationError).toBeDisplayed();
    });

    it('goes directly to add port when yes is selected', async () => {
        logStep('goes directly to add port when yes is selected');
        await TripTodayPage.selectTripToday('yes');
        await TripTodayPage.continueToNextStep();

        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('goes to return date and then add port after entering valid dates', async () => {
        logStep('goes to return date and then add port after entering valid dates');
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
        await TripDateReturnPage.enterReturnDate(returnDate.day, returnDate.month, returnDate.year);
        await TripDateReturnPage.continueToNextStep();

        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('shows an error when the trip ended more than 24 hours ago', async () => {
        logStep('shows an error when the trip ended more than 24 hours ago');
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
        await TripDateReturnPage.enterReturnDate(returnDate.day, returnDate.month, returnDate.year);
        await TripDateReturnPage.continueToNextStep();

        await expect(SubmissionNudgePage.heading).toBeDisplayed();
        await expect(SubmissionNudgePage.submissionWindowMessage).toBeDisplayed();
        await expect(SubmissionNudgePage.checkDateLink).toBeDisplayed();
        await expect(SubmissionNudgePage.saveContinueButton).toBeDisplayed();
        await SubmissionNudgePage.continueToNextStep();
        await expect(AddPortPage.heading).toBeDisplayed();
    });

    it('allows correcting the trip end date from the submission nudge', async () => {
        logStep('allows correcting the trip end date from the submission nudge');
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

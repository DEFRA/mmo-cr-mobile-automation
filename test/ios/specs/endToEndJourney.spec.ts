import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import ConfirmSamePortPage from '../pageobjects/confirmSamePortPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import CheckYourAnswersPage from '../pageobjects/checkYourAnswersPage';
import LandingStoragePage from '../pageobjects/landingStoragePage';
import SubmissionConfirmationPage from '../pageobjects/submissionConfirmationPage';
import SubmissionSuccessPage from '../pageobjects/submissionSuccessPage';
import TripTodayPage from '../pageobjects/tripTodayPage';
import { logStep } from '../../common/logger';

const endToEndJourneyData = {
    vessel: 'ACHILLES' as const,
    tripToday: 'yes' as const,
    port: 'Peterhead',
    confirmSamePort: 'yes' as const,
    gear: 'Seine nets (not specified)',
    meshSize: '12',
    timesShot: '2',
    catchArea: '44E83',
    species: 'Atlantic salmon (SAL)',
    weight: '500',
    weightBelowMin: '10',
    weightDiscarded: '20',
    landingStorage: 'no' as const,
};

describe('iOS end-to-end catch record journey', () => {
    const testEmail = process.env.IOS_TEST_EMAIL;
    const testPassword = process.env.IOS_TEST_PASSWORD;

    beforeEach(async () => {
        logStep('beforeEach');
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run end-to-end tests.',
            );
        }

        await SignInPage.openApp();
        await SignInPage.signIn(testEmail, testPassword);
        await HomePage.scrollToElement(HomePage.createRecordButton);
        await expect(HomePage.createRecordButton).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await HomePage.close();
    });

    it('completes and submits the catch record journey', async () => {
        logStep('completes and submits the catch record journey');
        await HomePage.clickCreateRecordButton();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
        await SelectVesselPage.selectVessel(endToEndJourneyData.vessel);

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
        await TripTodayPage.selectTripToday(endToEndJourneyData.tripToday);
        await TripTodayPage.continueToNextStep();

        await expect(AddPortPage.heading).toBeDisplayed();
        await AddPortPage.selectPort(endToEndJourneyData.port);
        await AddPortPage.continueToNextStep();

        await expect(ConfirmSamePortPage.headingForPort(endToEndJourneyData.port)).toBeDisplayed();
        await (endToEndJourneyData.confirmSamePort === 'yes'
            ? ConfirmSamePortPage.yesOption.click()
            : ConfirmSamePortPage.noOption.click());
        await ConfirmSamePortPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
        await AddGearPage.selectGear(endToEndJourneyData.gear);
        await AddGearPage.continueToNextStep();

        await expect(GearMeasurementsPage.heading).toBeDisplayed();
        await GearMeasurementsPage.enterMeshSize(endToEndJourneyData.meshSize);
        await GearMeasurementsPage.continueToNextStep();

        await expect(SelectGearPage.heading).toBeDisplayed();
        await SelectGearPage.selectSeineNets();
        await SelectGearPage.enterTimesShot(endToEndJourneyData.timesShot);
        await SelectGearPage.continueToNextStep();

        await expect(CatchLocationPage.heading).toBeDisplayed();
        await CatchLocationPage.selectArea(endToEndJourneyData.catchArea);
        await CatchLocationPage.continueToNextStep();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
        await AddSpeciesPage.selectSpecies(endToEndJourneyData.species);
        await AddSpeciesPage.continueToNextStep();

        await expect(RecordSpeciesWeightsPage.heading).toBeDisplayed();
        await RecordSpeciesWeightsPage.enterWeight(
            endToEndJourneyData.species,
            endToEndJourneyData.weight,
        );
        await RecordSpeciesWeightsPage.enterWeightBelowMin(
            endToEndJourneyData.species,
            endToEndJourneyData.weightBelowMin,
        );
        await RecordSpeciesWeightsPage.enterWeightDiscarded(
            endToEndJourneyData.species,
            endToEndJourneyData.weightDiscarded,
        );
        await RecordSpeciesWeightsPage.continueToNextStep();

        await expect(LandingStoragePage.heading).toBeDisplayed();
        await LandingStoragePage.selectLandingStorage(endToEndJourneyData.landingStorage);
        await LandingStoragePage.continueToNextStep();

        await expect(CheckYourAnswersPage.heading).toBeDisplayed();
        await CheckYourAnswersPage.continueToNextStep();

        await expect(SubmissionConfirmationPage.heading).toBeDisplayed();
        await SubmissionConfirmationPage.confirmSubmission();
        await SubmissionConfirmationPage.acceptAndSubmit();

        await expect(SubmissionSuccessPage.submissionMessage).toBeDisplayed();
        await SubmissionSuccessPage.viewYourCatchRecords();
    });
});

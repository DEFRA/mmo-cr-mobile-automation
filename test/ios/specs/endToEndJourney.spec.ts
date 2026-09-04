import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import CheckYourAnswersPage from '../pageobjects/checkYourAnswersPage';
import LandingStoragePage from '../pageobjects/landingStoragePage';
import SubmissionConfirmationPage from '../pageobjects/submissionConfirmationPage';
import SubmissionSuccessPage from '../pageobjects/submissionSuccessPage';
import TripTodayPage from '../pageobjects/tripTodayPage';

describe('iOS end-to-end catch record journey', () => {
    const testEmail = process.env.IOS_TEST_EMAIL;
    const testPassword = process.env.IOS_TEST_PASSWORD;

    beforeEach(async () => {
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
        await HomePage.close();
    });

    it('completes and submits the catch record journey', async () => {
        await HomePage.clickCreateRecordButton();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
        await SelectVesselPage.achillesVesselOption.click();
        await SelectVesselPage.saveContinueButton.click();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
        await TripTodayPage.yesOption.click();
        await TripTodayPage.saveContinueButton.click();

        await expect(AddPortPage.heading).toBeDisplayed();
        await AddPortPage.selectPort('Peterhead');
        await AddPortPage.continueToNextStep();

        await expect(SelectPortDeparturePage.heading).toBeDisplayed();
        await SelectPortDeparturePage.peterheadOption.click();
        await SelectPortDeparturePage.continueToNextStep();

        await expect(SelectPortReturnPage.heading).toBeDisplayed();
        await SelectPortReturnPage.peterheadOption.click();
        await SelectPortReturnPage.continueToNextStep();

        await expect(AddGearPage.heading).toBeDisplayed();
        await AddGearPage.selectGear('Seine nets (not specified)');
        await AddGearPage.continueToNextStep();

        await expect(GearMeasurementsPage.heading).toBeDisplayed();
        await GearMeasurementsPage.enterMeshSize('12');
        await GearMeasurementsPage.continueToNextStep();

        await expect(SelectGearPage.heading).toBeDisplayed();
        await SelectGearPage.selectSeineNets();
        await SelectGearPage.enterTimesShot('2');
        await SelectGearPage.continueToNextStep();

        await expect(CatchLocationPage.heading).toBeDisplayed();
        await CatchLocationPage.selectArea('44E83');
        await browser.execute('mobile: scrollToElement', {
            element: await CatchLocationPage.saveContinueButton.elementId,
        });
        await expect(CatchLocationPage.saveContinueButton).toBeDisplayed();
        await CatchLocationPage.continueToNextStep();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
        await AddSpeciesPage.selectSpecies('Salmon (SAL)');
        await browser.execute('mobile: scrollToElement', {
            element: await AddSpeciesPage.saveContinueButton.elementId,
        });
        await expect(AddSpeciesPage.saveContinueButton).toBeDisplayed();
        await AddSpeciesPage.continueToNextStep();

        await expect(RecordSpeciesWeightsPage.heading).toBeDisplayed();
        await RecordSpeciesWeightsPage.enterWeight('Salmon (SAL)', '500');
        await browser.execute('mobile: scrollToElement', {
            element: await RecordSpeciesWeightsPage.saveContinueButton.elementId,
        });
        await expect(RecordSpeciesWeightsPage.saveContinueButton).toBeDisplayed();
        await RecordSpeciesWeightsPage.continueToNextStep();

        await expect(LandingStoragePage.heading).toBeDisplayed();
        await LandingStoragePage.selectLandingStorage('no');
        await browser.execute('mobile: scrollToElement', {
            element: await LandingStoragePage.saveContinueButton.elementId,
        });
        await expect(LandingStoragePage.saveContinueButton).toBeDisplayed();
        await LandingStoragePage.continueToNextStep();

        await expect(CheckYourAnswersPage.heading).toBeDisplayed();
        await browser.execute('mobile: scrollToElement', {
            element: await CheckYourAnswersPage.saveContinueButton.elementId,
        });
        await expect(CheckYourAnswersPage.saveContinueButton).toBeDisplayed();
        await CheckYourAnswersPage.continueToNextStep();

        await expect(SubmissionConfirmationPage.heading).toBeDisplayed();
        await SubmissionConfirmationPage.confirmSubmission();
        await browser.execute('mobile: scrollToElement', {
            element: await SubmissionConfirmationPage.acceptButton.elementId,
        });
        await expect(SubmissionConfirmationPage.acceptButton).toBeDisplayed();
        await SubmissionConfirmationPage.acceptAndSubmit();

        await expect(SubmissionSuccessPage.submissionMessage).toBeDisplayed();
        await SubmissionSuccessPage.viewYourCatchRecords();
    });
});

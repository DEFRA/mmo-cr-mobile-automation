import signInPage from '../pageobjects/signInPage';
import homePage from '../pageobjects/homePage';
import selectVesselPage from '../pageobjects/selectVesselPage';
import tripTodayPage from '../pageobjects/tripTodayPage';
import tripStartDatePage from '../pageobjects/tripStartDatePage';
import androidFlowNavigator from '../support/androidFlowNavigator';
import { getAndroidTestCredentials } from '../support/testCredentials';
import { logStep } from '../../common/logger';
import NetworkHelper from '../support/networkHelper';
import catchRecordSummaryPage from '../pageobjects/catchRecordSummaryPage';
import catchAreaPage from '../pageobjects/catchAreaPage';
import catchSubAreaPage from '../pageobjects/catchSubAreaPage';
import submissionSuccessPage from '../pageobjects/submissionSuccessPage';

describe('Catch Record Business Rules & Offline Handling', () => {
    beforeEach(async () => {
        logStep('Setting up the environment and signing in');
        await signInPage.openApp();
        const { email, password } = getAndroidTestCredentials();
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });
    });

    afterEach(async () => {
        await NetworkHelper.goOnline();
        await signInPage.close();
    });

    it('Mandatory Single-Choice Questions (Vessel Selection)', async () => {
        logStep('Testing mandatory single-choice question constraint');
        await androidFlowNavigator.startCatchRecord();
        await selectVesselPage.heading.waitForDisplayed();
        
        // Attempt to continue without selecting a vessel
        await selectVesselPage.saveAndContinue();

        // Verify validation message is displayed
        const errorMsg = await $('//android.widget.TextView[contains(@text, "problem") or contains(@text, "Select")]');
        await expect(errorMsg).toBeDisplayed();
    });

    it('Restrict Historical Trip Dates (365 days limit)', async () => {
        logStep('Testing historical trip date restriction (365 days limit)');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectNoAndContinue();
        
        await tripStartDatePage.heading.waitForDisplayed();

        // Calculate a date more than 365 days in the past
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 366);
        
        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString()
        );

        // Verify validation message is displayed preventing progress
        const dateError = await $('//android.widget.TextView[contains(@text, "365") or contains(@text, "past")]');
        await expect(dateError).toBeDisplayed();
    });

    it('Display Suggested Statistical Areas and Allow "Other"', async () => {
        logStep('Testing map statistical areas and Other selection');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYesAndContinue();
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        
        await catchAreaPage.heading.waitForDisplayed();
        
        // AC03 - System displays map and allows selection
        await expect(catchAreaPage.map).toBeDisplayed();
        
        // AC04 - Allow selecting Other
        await catchAreaPage.clickOtherAndContinue();
        await expect(catchSubAreaPage.heading).toBeDisplayed();
    });

    // Mark as pending until Favourites UI is implemented
    xit('Save and Maintain Favourites', async () => {
        logStep('Testing favourites for ports, gear, and species');
        // TODO: Implement when UI includes "Save as favourite" checkboxes
    });

    it('Late Submission Warning (Trip > 24 hours ago)', async () => {
        logStep('Testing late submission warning');
        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectNoAndContinue();
        
        // Enter dates from 3 days ago (> 24 hours)
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 3);
        
        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString()
        );
        
        // Wait for end date page and use the same old date
        const endDatePageHeading = await $('//android.widget.TextView[contains(@text, "end")]');
        await endDatePageHeading.waitForDisplayed();
        await tripStartDatePage.enterDateAndContinue(
            oldDate.getDate().toString(),
            (oldDate.getMonth() + 1).toString(),
            oldDate.getFullYear().toString()
        );

        // Skip to Summary page
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('Other', '38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);
        
        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        await catchRecordSummaryPage.acceptAndSubmit();

        // Check for late submission warning message
        const warningMessage = await $('//android.widget.TextView[contains(@text, "review the trip end date") or contains(@text, "warning")]');
        await expect(warningMessage).toBeDisplayed();
        
        // Acknowledge and proceed
        const acknowledgeBtn = await $('//android.widget.Button[contains(@text, "Submit")]');
        if (await acknowledgeBtn.isDisplayed()) {
            await acknowledgeBtn.click();
            await expect(submissionSuccessPage.heading).toBeDisplayed();
        }
    });

    it('Retain Records When Offline and Retry Submission', async () => {
        logStep('Testing offline record retention and submission retry');
        // Go offline
        await NetworkHelper.goOffline();

        await androidFlowNavigator.startCatchRecord();
        await androidFlowNavigator.selectVessel('ACHILLES');
        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYesAndContinue();
        await androidFlowNavigator.selectPorts('Hastings', 'Dover');
        await androidFlowNavigator.selectGear('Seine nets', 10, 10);
        await androidFlowNavigator.selectAreas('Other', '38E95');
        await androidFlowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await androidFlowNavigator.selectDelayedLanding(false);
        
        await catchRecordSummaryPage.acceptAndSubmit();
        
        // AC11 - Notify user of unsubmitted record
        const offlineBanner = await submissionSuccessPage.offlineBanner;
        await expect(offlineBanner).toBeDisplayed();

        await submissionSuccessPage.clickViewRecords();
        
        // AC12 - Display Record Status as "Complete Not Submitted" when offline
        const statusNotSubmitted = await $('//android.widget.TextView[@text="Complete Not Submitted"]');
        await expect(statusNotSubmitted).toBeDisplayed();
        
        // AC13 - Retry failed submission when connectivity becomes available
        await NetworkHelper.goOnline();
        // Trigger a refresh or wait for auto-sync
        await browser.pause(5000); 
        
        // Status should change to "Submitted"
        const statusSubmitted = await $('//android.widget.TextView[@text="Submitted"]');
        await expect(statusSubmitted).toBeDisplayed();
    });

    // Mark as pending until Auto-Save UI indicators are verified
    xit('Auto-Save Draft Records and Prevent Data Loss', async () => {
        logStep('Testing auto-save draft functionality');
        // TODO: Start record, enter data, wait 10s, navigate to home, verify Draft status
    });

    // Sync conflict rules are generally backend tested, but UI behaviour can be added if spec defined
    xit('Duplicate Submission and Conflict Resolution', async () => {
        logStep('Testing duplicate submission and conflict rules');
        // TODO: Implement backend injection or complex mock setups to trigger sync conflicts
    });
});

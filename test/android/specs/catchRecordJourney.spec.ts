import signInPage from '../pageobjects/signInPage';
import homePage from '../pageobjects/homePage';
import flowNavigator from '../support/flowNavigator';
import catchRecordSummaryPage from '../pageobjects/catchRecordSummaryPage';
import submissionSuccessPage from '../pageobjects/submissionSuccessPage';
import { getAndroidTestCredentials } from '../support/testCredentials';
import NetworkHelper from '../support/networkHelper';

describe('Catch Record End-to-End Journey', () => {
    beforeEach(async () => {
        // Launch the app fresh before the test starts
        await signInPage.openApp();
    });

    afterEach(async () => {
        // Ensure network is restored just in case an offline test fails midway
        await NetworkHelper.goOnline();
        // Close or reset the app after the test
        await signInPage.close();
    });

    it('should successfully complete a catch record (Happy Path)', async () => {
        const { email, password } = getAndroidTestCredentials();

        // 1. Sign In
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

        // 2. Compose the journey by passing test data into the modular flow steps
        await flowNavigator.startCatchRecord();

        await flowNavigator.selectVessel('ACHILLES');

        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const formatDate = (date: Date) => ({
            day: String(date.getDate()).padStart(2, '0'),
            month: String(date.getMonth() + 1).padStart(2, '0'),
            year: String(date.getFullYear()),
        });

        await flowNavigator.selectTripDates(false, formatDate(twoDaysAgo), formatDate(today));

        await flowNavigator.selectPorts('Hastings', 'Dover');

        await flowNavigator.selectGear('Seine nets', 10, 10);

        await flowNavigator.selectAreas('38E95');

        await flowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);

        await flowNavigator.selectDelayedLanding(false);

        // 3. Verify Summary and Submit
        await expect(catchRecordSummaryPage.heading).toBeDisplayed();

        // Ensure our explicitly passed data shows up correctly
        const vessel = await catchRecordSummaryPage.getFieldValue('Vessel');
        expect(vessel).toEqual('ACHILLES');

        const depPort = await catchRecordSummaryPage.getFieldValue('Departure port');
        expect(depPort).toEqual('Hastings');

        await catchRecordSummaryPage.acceptAndSubmit();

        // 4. Verify Success Screen
        await expect(submissionSuccessPage.heading).toBeDisplayed();

        // Extract the generated reference ID
        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy(); // Should not be empty
        console.log(`Successfully created catch record with reference: ${referenceId}`);

        // 5. Return to the Catch Records list
        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });

    it.only('should successfully complete a catch record (Offline Happy Path)', async () => {
        const { email, password } = getAndroidTestCredentials();

        // 1. Sign In (must be online initially)
        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

        // 2. Go Offline
        await NetworkHelper.goOffline();

        // 3. Compose the journey
        await flowNavigator.startCatchRecord();

        await flowNavigator.selectVessel('ACHILLES');

        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const formatDate = (date: Date) => ({
            day: String(date.getDate()).padStart(2, '0'),
            month: String(date.getMonth() + 1).padStart(2, '0'),
            year: String(date.getFullYear()),
        });

        await flowNavigator.selectTripDates(false, formatDate(twoDaysAgo), formatDate(today));
        await flowNavigator.selectPorts('Hastings', 'Dover');
        await flowNavigator.selectGear('Seine nets', 10, 10);
        await flowNavigator.selectAreas('38E95');
        await flowNavigator.selectSpecies('Brown crab (TBC)', 5, 1, 1);
        await flowNavigator.selectDelayedLanding(false);

        // 4. Verify Summary and Submit
        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        await catchRecordSummaryPage.acceptAndSubmit();

        // 5. Verify Offline Behaviour
        const isOfflineBannerVisible = await submissionSuccessPage.isOfflineBannerDisplayed();
        expect(isOfflineBannerVisible).toBe(true);

        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy();
        console.log(`Successfully created offline catch record with reference: ${referenceId}`);

        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });
});

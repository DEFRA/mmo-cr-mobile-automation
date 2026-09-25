import signInPage from '../pageobjects/signInPage';
import homePage from '../pageobjects/homePage';
import flowNavigator from '../support/flowNavigator';
import catchRecordSummaryPage from '../pageobjects/catchRecordSummaryPage';
import submissionSuccessPage from '../pageobjects/submissionSuccessPage';
import { getAndroidTestCredentials } from '../support/testCredentials';
import NetworkHelper from '../support/networkHelper';
import { logStep, logInfo } from '../../common/logger';

describe('Catch Record End-to-End Journey', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await signInPage.openApp();
    });

    afterEach(async () => {
        logStep('afterEach');
        await NetworkHelper.goOnline();
        await signInPage.close();
    });

    it('should successfully complete a catch record (Happy Path)', async () => {
        logStep('should successfully complete a catch record (Happy Path)');
        const { email, password } = getAndroidTestCredentials();

        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

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

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();

        const vessel = await catchRecordSummaryPage.getFieldValue('Vessel');
        expect(vessel).toEqual('ACHILLES');

        const depPort = await catchRecordSummaryPage.getFieldValue('Departure port');
        expect(depPort).toEqual('Hastings');

        await catchRecordSummaryPage.acceptAndSubmit();

        await expect(submissionSuccessPage.heading).toBeDisplayed();

        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy();
        logInfo(`Successfully created catch record with reference: ${referenceId}`);

        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });

    it('should successfully complete a catch record (Offline Happy Path)', async () => {
        logStep('should successfully complete a catch record (Offline Happy Path)');
        const { email, password } = getAndroidTestCredentials();

        await signInPage.signIn(email, password);
        await homePage.heading.waitForDisplayed({ timeout: 15000 });

        await NetworkHelper.goOffline();

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

        await expect(catchRecordSummaryPage.heading).toBeDisplayed();
        await catchRecordSummaryPage.acceptAndSubmit();

        const isOfflineBannerVisible = await submissionSuccessPage.isOfflineBannerDisplayed();
        expect(isOfflineBannerVisible).toBe(true);

        const referenceId = await submissionSuccessPage.getRecordReference();
        expect(referenceId).toBeTruthy();
        logInfo(`Successfully created offline catch record with reference: ${referenceId}`);

        await submissionSuccessPage.clickViewRecords();
        await expect(homePage.heading).toBeDisplayed();
    });
});

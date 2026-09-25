import HomePage from '../pageobjects/homePage';
import { signIn } from '../support/journeySteps';
import { logStep, logInfo } from '../../common/logger';

describe('iOS home page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await signIn();
        await HomePage.scrollToElement(HomePage.yourTripsHeading);
    });

    afterEach(async () => {
        logStep('afterEach');
        await HomePage.close();
    });

    it('displays the home page content', async () => {
        logStep('displays the home page content');
        await HomePage.scrollToElement(HomePage.yourTripsHeading);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.tripsDescription);
        await expect(HomePage.tripsDescription).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.tripDateDescription);
        await expect(HomePage.tripDateDescription).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.appUsageNote);
        await expect(HomePage.appUsageNote).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.warningBox);
        await expect(HomePage.warningBox).toBeDisplayed();
        await expect(HomePage.bannerTitle).toBeDisplayed();
        await expect(HomePage.bannerText).toBeDisplayed();
    });

    it('opens the how to record guidance', async () => {
        logStep('opens the how to record guidance');
        await HomePage.scrollToElement(HomePage.howToRecordLink);
        await expect(HomePage.howToRecordLink).toBeDisplayed();

        await HomePage.openHowToRecord();

        await expect(HomePage.whatYouNeedToDoHeading).toBeDisplayed();

        await HomePage.openHowToRecord();

        await expect(HomePage.whatYouNeedToDoHeading).not.toBeDisplayed();
    });

    it('displays the trip table and pagination', async () => {
        logStep('displays the trip table and pagination');
        await expect(HomePage.tripEndDateHeader).toBeDisplayed();
        await expect(HomePage.vesselHeader).toBeDisplayed();
        await expect(HomePage.statusHeader).toBeDisplayed();
        await expect(HomePage.createdByHeader).toBeDisplayed();
        await expect(HomePage.tableRowDate(0)).toBeDisplayed();
        await expect(HomePage.tableRowVessel(0, 'ACHILLES')).toBeDisplayed();
        await expect(HomePage.tableRowStatus(0, 'Submitted')).toBeDisplayed();
        await expect(HomePage.tableRowCreatedBy(0, 'J.Smith')).toBeDisplayed();

        const pagination = await HomePage.pagination;
        await pagination.waitForExist();

        if (!(await pagination.isDisplayed())) {
            await browser.execute('mobile: scrollToElement', {
                element: await pagination.elementId,
            });
        }

        await pagination.waitForDisplayed({ timeout: 10000 });
        await expect(HomePage.currentPage).toBeDisplayed();
    });

    it('displays the authenticated navigation tabs', async () => {
        logStep('displays the authenticated navigation tabs');
        await expect(HomePage.homeTab).toBeDisplayed();
        await expect(HomePage.notificationsTab).toBeDisplayed();
        await expect(HomePage.settingsTab).toBeDisplayed();
    });

    it('opens and closes the catch record status help section', async () => {
        logStep('opens and closes the catch record status help section');
        await HomePage.scrollToElement(HomePage.howToRecordLink);
        await expect(HomePage.howToRecordLink).toBeDisplayed();
        await expect(HomePage.statusHelpLink).toBeDisplayed();

        await HomePage.openStatusHelp();

        await expect(HomePage.unsentStatusDescription).toBeDisplayed();

        await HomePage.openStatusHelp();

        await expect(HomePage.unsentStatusDescription).not.toBeDisplayed();
    });
});

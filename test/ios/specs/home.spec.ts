import HomePage from '../pageobjects/homePage';
import SignInPage from '../pageobjects/signInPage';

const testEmail = process.env.IOS_TEST_EMAIL;
const testPassword = process.env.IOS_TEST_PASSWORD;

describe('iOS home page', () => {
    beforeEach(async () => {
        if (!testEmail || !testPassword) {
            throw new Error(
                'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run Home page tests.',
            );
        }
        await SignInPage.openApp();
        await SignInPage.signIn(testEmail, testPassword);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
    });

    afterEach(async () => {
        await HomePage.close();
    });

    it('displays the home page content', async () => {
        await expect(HomePage.govUk).toBeDisplayed();
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
        await expect(HomePage.tripsDescription).toBeDisplayed();
        await expect(HomePage.tripDateDescription).toBeDisplayed();
        await expect(HomePage.appUsageNote).toBeDisplayed();
    });

    it('displays the trip table and pagination', async () => {
        await expect(HomePage.tripEndDateHeader).toBeDisplayed();
        await expect(HomePage.vesselHeader).toBeDisplayed();
        await expect(HomePage.statusHeader).toBeDisplayed();
        await expect(HomePage.createdByHeader).toBeDisplayed();
        await expect(HomePage.tableRowDate(0)).toBeDisplayed();
        await expect(HomePage.tableRowVessel(0, 'ACHILLES')).toBeDisplayed();
        await expect(HomePage.tableRowStatus(0, 'Submitted')).toBeDisplayed();
        await expect(HomePage.tableRowCreatedBy(0, 'J.Smith')).toBeDisplayed();
        await HomePage.pagination.scrollIntoView();
        await expect(HomePage.pagination).toBeDisplayed();
        await expect(HomePage.currentPage).toBeDisplayed();
    });

    it('displays the authenticated navigation tabs', async () => {
        await expect(HomePage.homeTab).toBeDisplayed();
        await expect(HomePage.notificationsTab).toBeDisplayed();
        await expect(HomePage.settingsTab).toBeDisplayed();
    });
});

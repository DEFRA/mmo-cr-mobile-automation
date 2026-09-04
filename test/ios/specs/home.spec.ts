import HomePage from '../pageobjects/homePage';
import { signIn } from '../support/journeySteps';

describe('iOS home page', () => {
    beforeEach(async () => {
        await signIn();
        await HomePage.scrollToElement(HomePage.yourTripsHeading);
    });

    afterEach(async () => {
        await HomePage.close();
    });

    it('displays the home page content', async () => {
        await HomePage.scrollToElement(HomePage.yourTripsHeading);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.tripsDescription);
        await expect(HomePage.tripsDescription).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.tripDateDescription);
        await expect(HomePage.tripDateDescription).toBeDisplayed();
        await HomePage.scrollToElement(HomePage.appUsageNote);
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
        await expect(HomePage.homeTab).toBeDisplayed();
        await expect(HomePage.notificationsTab).toBeDisplayed();
        await expect(HomePage.settingsTab).toBeDisplayed();
    });
});

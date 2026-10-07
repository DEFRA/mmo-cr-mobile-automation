import HomePage from '../pageobjects/homePage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import TripTodayPage from '../pageobjects/tripTodayPage';
import iosFlowNavigator from '../support/iosFlowNavigator';
import { logStep } from '../../common/logger';

describe('iOS select vessel page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await SelectVesselPage.close();
    });

    it('shows both vessel options unselected initially', async () => {
        logStep('shows both vessel options unselected initially');
        await expect(SelectVesselPage.vesselOption('achilles')).not.toBeSelected();
        await expect(SelectVesselPage.vesselOption('hercules')).not.toBeSelected();
    });

    it('keeps the selected vessel selected and allows changing the selection', async () => {
        logStep('keeps the selected vessel selected and allows changing the selection');
        await SelectVesselPage.vesselOption('achilles').click();
        await expect(SelectVesselPage.vesselOption('achilles')).toBeSelected();
        await expect(SelectVesselPage.vesselOption('hercules')).not.toBeSelected();

        await SelectVesselPage.vesselOption('achilles').click();
        await expect(SelectVesselPage.vesselOption('achilles')).toBeSelected();

        await SelectVesselPage.vesselOption('hercules').click();
        await expect(SelectVesselPage.vesselOption('achilles')).not.toBeSelected();
        await expect(SelectVesselPage.vesselOption('hercules')).toBeSelected();
    });

    it('shows a validation error when continuing without selecting a vessel', async () => {
        logStep('shows a validation error when continuing without selecting a vessel');
        await SelectVesselPage.saveContinueButton.click();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
        await expect(SelectVesselPage.vesselValidationError).toBeDisplayed();
    });

    it('continues to the trip-today page after selecting ACHILLES', async () => {
        logStep('continues to the trip-today page after selecting ACHILLES');
        await SelectVesselPage.vesselOption('achilles').click();
        await SelectVesselPage.saveContinueButton.click();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
    });

    it('continues to the trip-today page after selecting HERCULES', async () => {
        logStep('continues to the trip-today page after selecting HERCULES');
        await SelectVesselPage.vesselOption('hercules').click();
        await SelectVesselPage.saveContinueButton.click();

        await expect(TripTodayPage.questionHeading).toBeDisplayed();
    });

    it('returns to the dashboard when the back link is clicked', async () => {
        logStep('returns to the dashboard when the back link is clicked');
        await SelectVesselPage.backButton.click();

        await HomePage.scrollToElement(HomePage.yourTripsHeading);
        await expect(HomePage.yourTripsHeading).toBeDisplayed();
    });
});

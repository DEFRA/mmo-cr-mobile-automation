import LandingStoragePage from '../pageobjects/landingStoragePage';
import AddGearPage from '../pageobjects/addGearPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import CheckYourAnswersPage from '../pageobjects/checkYourAnswersPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import { logStep } from '../../common/logger';
import iosFlowNavigator, { type CatchRecordJourneyData } from '../support/iosFlowNavigator';

const journeyData: CatchRecordJourneyData = {
    vessel: 'ACHILLES',
    port: 'Peterhead',
    gear: 'Seine nets (not specified)',
    meshSize: '12',
    timesShot: '2',
    catchArea: '44E83',
    species: 'European lobster (LBE)',
    weight: '500',
    landingStorage: 'no',
};

describe('iOS check your answers page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signInAndOpenCreateRecord();
        await iosFlowNavigator.selectVessel(journeyData.vessel);
        await iosFlowNavigator.selectTripToday('yes');
        await iosFlowNavigator.addPort(journeyData.port);
        await iosFlowNavigator.confirmSamePort(journeyData.port, 'yes');
        await iosFlowNavigator.addGear(journeyData.gear);
        await iosFlowNavigator.enterGearMeasurements(journeyData.meshSize);
        await iosFlowNavigator.selectGearDetails(journeyData.timesShot);
        await iosFlowNavigator.completeCatchLocation(journeyData.catchArea);
        await iosFlowNavigator.addSpecies(journeyData.species);
        await iosFlowNavigator.enterSpeciesWeights(journeyData.species, journeyData.weight);
        await LandingStoragePage.selectLandingStorage(journeyData.landingStorage);
        await LandingStoragePage.continueToNextStep();
        await expect(CheckYourAnswersPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await CheckYourAnswersPage.close();
    });

    it('displays the trip, gear and species sections', async () => {
        logStep('displays the trip, gear and species sections');
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.tripSection);
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.gearSection);
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.speciesCaughtSection);
    });

    it('shows the captured trip answers', async () => {
        logStep('shows the captured trip answers');
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.vesselValue(journeyData.vessel),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.departurePortValue(journeyData.port),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.returnPortValue(journeyData.port),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.statisticalAreaValue(journeyData.catchArea),
        );
    });

    it('shows the captured gear answers', async () => {
        logStep('shows the captured gear answers');
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.gearNameValue(journeyData.gear),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.meshSizeValue(journeyData.meshSize),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.timesShotValue(journeyData.timesShot),
        );
    });

    it.only('shows the captured species answers', async () => {
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.speciesNameValue(journeyData.species),
        );
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.weightAboveValue(journeyData.weight),
        );
    });

    it('opens the select vessel page when changing the vessel', async () => {
        logStep('opens the select vessel page when changing the vessel');
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.changeTripVesselButton);
        await CheckYourAnswersPage.changeTripVessel();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
    });

    it('opens the catch location page when changing the statistical area', async () => {
        logStep('opens the catch location page when changing the statistical area');
        await CheckYourAnswersPage.scrollToElement(
            CheckYourAnswersPage.changeStatisticalAreaButton,
        );
        await CheckYourAnswersPage.changeStatisticalArea();

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it('opens the add gear page when changing the gear name', async () => {
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.changeGearNameButton);
        await CheckYourAnswersPage.changeGearName();

        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it('opens the add species page when changing the species name', async () => {
        await CheckYourAnswersPage.scrollToElement(CheckYourAnswersPage.changeSpeciesNameButton);
        await CheckYourAnswersPage.changeSpeciesName();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });
});

import homePage from '../pageobjects/homePage';
import tripTodayPage from '../pageobjects/tripTodayPage';
import selectVesselPage from '../pageobjects/selectVesselPage';
import departurePortPage from '../pageobjects/departurePortPage';
import returnPortPage from '../pageobjects/returnPortPage';
import catchAreaPage from '../pageobjects/catchAreaPage';
import catchSubAreaPage from '../pageobjects/catchSubAreaPage';
import gearPage from '../pageobjects/gearPage';
import gearMeasurementPage from '../pageobjects/gearMeasurementPage';
import selectedGearsPage from '../pageobjects/selectedGearsPage';
import speciesPage from '../pageobjects/speciesPage';
import selectedSpeciesPage from '../pageobjects/selectedSpeciesPage';
import delayedLandingPage from '../pageobjects/delayedLandingPage';
import catchRecordSummaryPage from '../pageobjects/catchRecordSummaryPage';
import submissionSuccessPage from '../pageobjects/submissionSuccessPage';

export const DefaultCatchData = {
    vessel: 'ACHILLES',
    departurePort: 'Hastings',
    returnPort: 'Dover',
    catchArea: '38E95',
    catchSubArea: '38E99',
    gear: 'Seine nets',
    meshSize: '10',
    timesShot: '10',
    species: 'Brown crab (TBC)',
    retainedWeight: '10',
    belowMinWeight: '10',
    discardedWeight: '10',
};

export class FlowNavigator {
    async navigateToGearSelection(data = DefaultCatchData) {
        await homePage.clickCreateRecordButton();

        await tripTodayPage.heading.waitForDisplayed();
        await tripTodayPage.selectYesAndContinue();

        await selectVesselPage.heading.waitForDisplayed();
        await selectVesselPage.selectVesselAndContinue(data.vessel);

        await departurePortPage.heading.waitForDisplayed();
        await departurePortPage.searchSelectAndContinue(data.departurePort, data.departurePort);

        await returnPortPage.heading.waitForDisplayed();
        await returnPortPage.searchSelectAndContinue(data.returnPort, data.returnPort);

        await catchAreaPage.heading.waitForDisplayed();
        await catchAreaPage.selectAreaAndContinue(data.catchArea);

        await catchSubAreaPage.heading.waitForDisplayed();
        await catchSubAreaPage.selectSubAreaAndContinue(data.catchSubArea);

        await gearPage.heading.waitForDisplayed();
    }

    async navigateToSpeciesSelection(data = DefaultCatchData) {
        await this.navigateToGearSelection(data);

        await gearPage.searchSelectAndContinue(data.gear, data.gear);

        await gearMeasurementPage.heading.waitForDisplayed();
        await gearMeasurementPage.enterMeshSizeAndContinue(data.meshSize);

        await selectedGearsPage.heading.waitForDisplayed();
        await selectedGearsPage.enterShots(data.timesShot);
        await selectedGearsPage.saveAndContinue();

        await speciesPage.heading.waitForDisplayed();
    }

    async navigateToSummary(data = DefaultCatchData) {
        await this.navigateToSpeciesSelection(data);

        await speciesPage.searchSelectAndContinue(data.species, data.species);

        await selectedSpeciesPage.heading.waitForDisplayed();
        await selectedSpeciesPage.enterRetainedWeight(data.retainedWeight);
        await selectedSpeciesPage.clickAddBelowMinWeight();
        await selectedSpeciesPage.enterBelowMinWeight(data.belowMinWeight);
        await selectedSpeciesPage.clickAddDiscardedWeight();
        await selectedSpeciesPage.enterDiscardedWeight(data.discardedWeight);
        await selectedSpeciesPage.saveAndContinue();

        await delayedLandingPage.heading.waitForDisplayed();
        await delayedLandingPage.selectNoAndContinue();

        await catchRecordSummaryPage.heading.waitForDisplayed();
    }
}

export default new FlowNavigator();

import { logStep } from '../../common/logger';
import homePage from '../pageobjects/homePage';
import tripTodayPage from '../pageobjects/tripTodayPage';
import tripStartDatePage from '../pageobjects/tripStartDatePage';
import tripEndDatePage from '../pageobjects/tripEndDatePage';
import selectVesselPage from '../pageobjects/selectVesselPage';
import departurePortPage from '../pageobjects/departurePortPage';
import returnPortPage from '../pageobjects/returnPortPage';
import catchAreaPage from '../pageobjects/catchAreaPage';
import catchSubAreaPage from '../pageobjects/catchSubAreaPage';
import catchSubAreaSearchPage from '../pageobjects/catchSubAreaSearchPage';
import gearPage from '../pageobjects/gearPage';
import gearMeasurementPage from '../pageobjects/gearMeasurementPage';
import selectedGearsPage from '../pageobjects/selectedGearsPage';
import speciesPage from '../pageobjects/speciesPage';
import selectedSpeciesPage from '../pageobjects/selectedSpeciesPage';
import delayedLandingPage from '../pageobjects/delayedLandingPage';

export type DateData = { day: string; month: string; year: string };

export class AndroidFlowNavigator {
    async startCatchRecord() {
        await logStep('Starting catch record journey');
        await homePage.clickCreateRecordButton();
    }

    async selectVessel(vesselName: string) {
        await logStep(`Selecting vessel: ${vesselName}`);
        await selectVesselPage.heading.waitForDisplayed();
        await selectVesselPage.selectVesselAndContinue(vesselName);
    }

    async selectTripDates(tripToday: boolean, startDate?: DateData, endDate?: DateData) {
        await logStep(`Selecting trip dates (tripToday: ${tripToday})`);
        await tripTodayPage.heading.waitForDisplayed();

        if (tripToday) {
            await tripTodayPage.selectYesAndContinue();
        } else {
            if (!startDate || !endDate) {
                throw new Error('Must provide startDate and endDate when tripToday is false');
            }
            await tripTodayPage.selectNoAndContinue();

            await tripStartDatePage.heading.waitForDisplayed();
            await tripStartDatePage.enterDateAndContinue(
                startDate.day,
                startDate.month,
                startDate.year,
            );

            await tripEndDatePage.heading.waitForDisplayed();
            await tripEndDatePage.enterDateAndContinue(endDate.day, endDate.month, endDate.year);
        }
    }

    async selectPorts(departurePort: string, returnPort: string, isClosestPort: boolean = false) {
        await logStep(`Selecting ports - Departure: ${departurePort}, Return: ${returnPort}`);

        if (isClosestPort) {
            await departurePortPage.selectYesAndContinue();
        } else {
            await departurePortPage.selectNoAndContinue();
        }

        await departurePortPage.heading.waitForDisplayed();
        await departurePortPage.clickAddPort();
        await departurePortPage.searchSelectAndContinue(departurePort, departurePort);

        await returnPortPage.heading.waitForDisplayed();
        await departurePortPage.clickAddPort();
        await returnPortPage.searchSelectAndContinue(returnPort, returnPort);
    }

    async selectAreas(catchArea?: string, subArea?: string) {
        await logStep(`Selecting catch area${catchArea ? `: ${catchArea}` : ' (random)'}`);
        await catchAreaPage.heading.waitForDisplayed();

        if (catchArea === 'Other') {
            await catchAreaPage.clickOtherAndContinue();
            await this.selectSubAreas(subArea);
        } else {
            await catchAreaPage.selectRandomLocationAndContinue();
            // If selecting from map, no sub-area selection is required.
        }
    }

    async selectSubAreas(subArea?: string) {
        await logStep(`Selecting sub area${subArea ? `: ${subArea}` : ' (first available)'}`);
        await catchSubAreaPage.heading.waitForDisplayed();
        if (subArea) {
            await catchSubAreaPage.selectSubAreaAndContinue(subArea);
        } else {
            await catchSubAreaPage.selectFirstSubAreaAndContinue();
        }
    }

    async searchAndSelectSubArea(searchText: string, areaCode: string) {
        await logStep(`Searching and selecting sub area: ${areaCode}`);
        await catchSubAreaSearchPage.heading.waitForDisplayed();
        await catchSubAreaSearchPage.searchSelectAndContinue(searchText, areaCode);
    }

    async selectGear(gearName: string, meshSize: string | number, shots: string | number) {
        await logStep(`Selecting gear: ${gearName} (mesh: ${meshSize}mm, shots: ${shots})`);
        await gearPage.heading.waitForDisplayed();
        await gearPage.searchSelectAndContinue(gearName, gearName);

        await gearMeasurementPage.heading.waitForDisplayed();
        await gearMeasurementPage.enterMeshSizeAndContinue(meshSize);

        await selectedGearsPage.heading.waitForDisplayed();
        await selectedGearsPage.selectGearCheckbox(gearName);
        await selectedGearsPage.enterShots(shots);
        await selectedGearsPage.saveAndContinue();
    }

    async selectSpecies(
        speciesName: string,
        retainedWeight: string | number,
        belowMinWeight: string | number,
        discardedWeight: string | number,
    ) {
        await logStep(
            `Selecting species: ${speciesName} (weights: ${retainedWeight} / ${belowMinWeight} / ${discardedWeight})`,
        );
        await speciesPage.heading.waitForDisplayed();
        // Mimic user behavior by typing a few characters to see the options
        const searchText = speciesName.length > 2 ? speciesName.substring(0, 3) : speciesName;
        await speciesPage.searchSelectAndContinue(searchText, speciesName);

        await selectedSpeciesPage.heading.waitForDisplayed();
        await selectedSpeciesPage.selectSpeciesCheckbox(speciesName);
        await selectedSpeciesPage.enterRetainedWeight(retainedWeight);

        await selectedSpeciesPage.clickAddBelowMinWeight();
        await selectedSpeciesPage.enterBelowMinWeight(belowMinWeight);

        await selectedSpeciesPage.clickAddDiscardedWeight();
        await selectedSpeciesPage.enterDiscardedWeight(discardedWeight);

        await selectedSpeciesPage.saveAndContinue();
    }

    async selectDelayedLanding(isDelayed: boolean) {
        await logStep(`Selecting delayed landing: ${isDelayed}`);
        await delayedLandingPage.heading.waitForDisplayed();
        if (isDelayed) {
            await delayedLandingPage.selectYesAndContinue();
        } else {
            await delayedLandingPage.selectNoAndContinue();
        }
    }
}

export default new AndroidFlowNavigator();

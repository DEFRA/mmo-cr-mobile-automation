import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import ConfirmSamePortPage from '../pageobjects/confirmSamePortPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import LandingStoragePage from '../pageobjects/landingStoragePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripTodayPage from '../pageobjects/tripTodayPage';
import { getIosTestCredentials } from './testCredentials';

/** Signs in with the configured test credentials. */
export async function signIn() {
    const { email, password } = getIosTestCredentials();

    await SignInPage.openApp();
    await SignInPage.signIn(email, password);
}

/** Signs in and opens the create-record flow, landing on the select vessel page. */
export async function signInAndOpenCreateRecord() {
    await signIn();
    await HomePage.scrollToElement(HomePage.createRecordButton);
    await HomePage.clickCreateRecordButton();
}

/** Selects a vessel and answers the trip-today question, landing on the add port page. */
export async function selectVesselAndTripToday(
    vessel: 'ACHILLES' | 'HERCULES',
    tripToday: 'yes' | 'no',
) {
    await SelectVesselPage.selectVessel(vessel);
    await TripTodayPage.selectTripToday(tripToday);
    await TripTodayPage.continueToNextStep();
}

/** Confirms same-port for the given port; 'yes' lands on add gear, 'no' requires separate departure/return selection. */
export async function completePortJourney(portName: string, option: 'yes' | 'no') {
    await AddPortPage.selectPort(portName);
    await AddPortPage.continueToNextStep();
    await expect(ConfirmSamePortPage.headingForPort(portName)).toBeDisplayed();

    if (option === 'yes') {
        await ConfirmSamePortPage.yesOption.click();
        await ConfirmSamePortPage.continueToNextStep();
        return;
    }

    await ConfirmSamePortPage.noOption.click();
    await ConfirmSamePortPage.continueToNextStep();
    await SelectPortDeparturePage.portOption(portName).click();
    await SelectPortDeparturePage.continueToNextStep();
    await SelectPortReturnPage.portOption(portName).click();
    await SelectPortReturnPage.continueToNextStep();
}

/** Completes gear, measurements and times-shot for the given gear, landing on the catch location page. */
export async function completeGearJourney(gearName: string, meshSize: string, timesShot: string) {
    await AddGearPage.selectGear(gearName);
    await AddGearPage.continueToNextStep();
    await GearMeasurementsPage.enterMeshSize(meshSize);
    await GearMeasurementsPage.continueToNextStep();
    await SelectGearPage.selectSeineNets();
    await SelectGearPage.enterTimesShot(timesShot);
    await SelectGearPage.continueToNextStep();
}

/** Scrolls the given element into view so it can be interacted with. */
async function scrollIntoView(element: ReturnType<typeof $>) {
    await browser.execute('mobile: scrollToElement', {
        element: await element.elementId,
    });
}

/** Selects a catch area and continues to the add species page. */
export async function completeCatchLocation(area: string) {
    await CatchLocationPage.selectArea(area);
    await scrollIntoView(CatchLocationPage.saveContinueButton);
    await CatchLocationPage.continueToNextStep();
}

/** Selects a species, records its live weight and continues to the landing storage page. */
export async function completeSpeciesJourney(species: string, weight: string) {
    await AddSpeciesPage.selectSpecies(species);
    await scrollIntoView(AddSpeciesPage.saveContinueButton);
    await AddSpeciesPage.continueToNextStep();

    await RecordSpeciesWeightsPage.enterWeight(species, weight);
    await scrollIntoView(RecordSpeciesWeightsPage.saveContinueButton);
    await RecordSpeciesWeightsPage.continueToNextStep();
}

export interface CatchRecordJourneyData {
    vessel: 'ACHILLES' | 'HERCULES';
    port: string;
    gear: string;
    meshSize: string;
    timesShot: string;
    catchArea: string;
    species: string;
    weight: string;
    landingStorage: 'yes' | 'no';
}

/** Runs the create-record flow through to the add species page. */
export async function completeRecordUpToAddSpecies(data: CatchRecordJourneyData) {
    await signInAndOpenCreateRecord();
    await selectVesselAndTripToday(data.vessel, 'yes');
    await completePortJourney(data.port, 'yes');
    await completeGearJourney(data.gear, data.meshSize, data.timesShot);
    await completeCatchLocation(data.catchArea);
}

/** Runs the create-record flow through to the check your answers page. */
export async function completeRecordUpToCheckYourAnswers(data: CatchRecordJourneyData) {
    await completeRecordUpToAddSpecies(data);
    await completeSpeciesJourney(data.species, data.weight);
    await LandingStoragePage.selectLandingStorage(data.landingStorage);
    await scrollIntoView(LandingStoragePage.saveContinueButton);
    await LandingStoragePage.continueToNextStep();
}

import { logStep } from '../../common/logger';
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

export async function signIn() {
    logStep('signIn');
    const { email, password } = getIosTestCredentials();

    await SignInPage.openApp();
    await SignInPage.signIn(email, password);
}

export async function signInAndOpenCreateRecord() {
    logStep('signInAndOpenCreateRecord');
    await signIn();
    await HomePage.scrollToElement(HomePage.createRecordButton);
    await HomePage.clickCreateRecordButton();
}

export async function selectVesselAndTripToday(
    vessel: 'ACHILLES' | 'HERCULES',
    tripToday: 'yes' | 'no',
) {
    logStep(`vessel=${vessel}, tripToday=${tripToday}`);
    await SelectVesselPage.selectVessel(vessel);
    await TripTodayPage.selectTripToday(tripToday);
    await TripTodayPage.continueToNextStep();
}

export async function completePortJourney(portName: string, option: 'yes' | 'no') {
    logStep(`portName=${portName}, option=${option}`);
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

export async function completeGearJourney(gearName: string, meshSize: string, timesShot: string) {
    logStep(`gearName=${gearName}, meshSize=${meshSize}, timesShot=${timesShot}`);
    await AddGearPage.selectGear(gearName);
    await AddGearPage.continueToNextStep();
    await GearMeasurementsPage.enterMeshSize(meshSize);
    await GearMeasurementsPage.continueToNextStep();
    await SelectGearPage.selectSeineNets();
    await SelectGearPage.enterTimesShot(timesShot);
    await SelectGearPage.continueToNextStep();
}

async function scrollIntoView(element: ReturnType<typeof $>) {
    await browser.execute('mobile: scrollToElement', {
        element: await element.elementId,
    });
}

export async function completeCatchLocation(area: string) {
    logStep(`area=${area}`);
    await CatchLocationPage.selectArea(area);
    await scrollIntoView(CatchLocationPage.saveContinueButton);
    await CatchLocationPage.continueToNextStep();
}

export async function completeSpeciesJourney(species: string, weight: string) {
    logStep(`species=${species}, weight=${weight}`);
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

export async function completeRecordUpToAddSpecies(data: CatchRecordJourneyData) {
    logStep('completeRecordUpToAddSpecies');
    await signInAndOpenCreateRecord();
    await selectVesselAndTripToday(data.vessel, 'yes');
    await completePortJourney(data.port, 'yes');
    await completeGearJourney(data.gear, data.meshSize, data.timesShot);
    await completeCatchLocation(data.catchArea);
}

export async function completeRecordUpToCheckYourAnswers(data: CatchRecordJourneyData) {
    logStep('completeRecordUpToCheckYourAnswers');
    await completeRecordUpToAddSpecies(data);
    await completeSpeciesJourney(data.species, data.weight);
    await LandingStoragePage.selectLandingStorage(data.landingStorage);
    await scrollIntoView(LandingStoragePage.saveContinueButton);
    await LandingStoragePage.continueToNextStep();
}

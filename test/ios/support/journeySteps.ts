import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
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

/** Completes departure/return port selection for the given port, landing on the add gear page. */
export async function completePortJourney(portName: string) {
    await AddPortPage.selectPort(portName);
    await AddPortPage.continueToNextStep();
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

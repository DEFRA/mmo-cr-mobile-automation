import { logStep } from '../../common/logger';
import AddGearPage from '../pageobjects/addGearPage';
import AddPortPage from '../pageobjects/addPortPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import ConfirmSamePortPage from '../pageobjects/confirmSamePortPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import HomePage from '../pageobjects/homePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import SelectPortDeparturePage from '../pageobjects/selectPortDeparturePage';
import SelectPortReturnPage from '../pageobjects/selectPortReturnPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import SignInPage from '../pageobjects/signInPage';
import TripTodayPage from '../pageobjects/tripTodayPage';
import { getIosTestCredentials } from './testCredentials';

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

export class IosFlowNavigator {
    async signIn() {
        logStep('signIn');
        const { email, password } = getIosTestCredentials();
        await SignInPage.signIn(email, password);
    }

    async signInAndOpenCreateRecord() {
        logStep('signInAndOpenCreateRecord');
        await this.signIn();
        await HomePage.scrollToElement(HomePage.createRecordButton);
        await HomePage.clickCreateRecordButton();
    }
    async selectVessel(vessel: 'ACHILLES' | 'HERCULES') {
        logStep(`selectVessel vessel=${vessel}`);
        await SelectVesselPage.selectVessel(vessel);
    }

    async selectTripToday(tripToday: 'yes' | 'no') {
        logStep(`selectTripToday tripToday=${tripToday}`);
        await TripTodayPage.selectTripToday(tripToday);
        await TripTodayPage.continueToNextStep();
    }

    async addPort(portName: string) {
        logStep(`addPort portName=${portName}`);
        await AddPortPage.selectPort(portName);
        await AddPortPage.continueToNextStep();
    }

    async confirmSamePort(portName: string, option: 'yes' | 'no') {
        logStep(`confirmSamePort option=${option}`);
        await expect(ConfirmSamePortPage.headingForPort(portName)).toBeDisplayed();
        if (option === 'yes') {
            await ConfirmSamePortPage.yesOption.click();
            await ConfirmSamePortPage.continueToNextStep();
        } else {
            await ConfirmSamePortPage.noOption.click();
            await ConfirmSamePortPage.continueToNextStep();
        }
    }

    async selectDeparturePort(portName: string) {
        logStep(`selectDeparturePort portName=${portName}`);
        await SelectPortDeparturePage.portOption(portName).click();
        await SelectPortDeparturePage.continueToNextStep();
    }

    async selectReturnPort(portName: string) {
        logStep(`selectReturnPort portName=${portName}`);
        await SelectPortReturnPage.portOption(portName).click();
        await SelectPortReturnPage.continueToNextStep();
    }
    async addGear(gearName: string) {
        logStep(`addGear gearName=${gearName}`);
        await AddGearPage.selectGear(gearName);
        await AddGearPage.continueToNextStep();
    }

    async enterGearMeasurements(meshSize: string) {
        logStep(`enterGearMeasurements meshSize=${meshSize}`);
        await GearMeasurementsPage.enterMeshSize(meshSize);
        await GearMeasurementsPage.continueToNextStep();
    }

    async selectGearDetails(timesShot: string) {
        logStep(`selectGearDetails timesShot=${timesShot}`);
        await SelectGearPage.selectSeineNets();
        await SelectGearPage.enterTimesShot(timesShot);
        await SelectGearPage.continueToNextStep();
    }

    async completeCatchLocation(area: string) {
        logStep(`area=${area}`);
        await CatchLocationPage.selectArea(area);
        await CatchLocationPage.continueToNextStep();
    }
    async addSpecies(species: string) {
        logStep(`addSpecies species=${species}`);
        await AddSpeciesPage.selectSpecies(species);
        await AddSpeciesPage.continueToNextStep();
    }

    async enterSpeciesWeights(species: string, weight: string) {
        logStep(`enterSpeciesWeights weight=${weight}`);
        await RecordSpeciesWeightsPage.enterWeight(species, weight);
        await RecordSpeciesWeightsPage.continueToNextStep();
    }
}

export default new IosFlowNavigator();

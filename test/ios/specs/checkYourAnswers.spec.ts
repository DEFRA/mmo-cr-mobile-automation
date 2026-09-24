import AddGearPage from '../pageobjects/addGearPage';
import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import CheckYourAnswersPage from '../pageobjects/checkYourAnswersPage';
import SelectVesselPage from '../pageobjects/selectVesselPage';
import {
    completeRecordUpToCheckYourAnswers,
    type CatchRecordJourneyData,
} from '../support/journeySteps';

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

async function scrollToAndExpectDisplayed(element: ReturnType<typeof $>) {
    await element.waitForExist({ timeout: 10000 });
    await browser.execute('mobile: scrollToElement', {
        element: await element.elementId,
    });
    await expect(element).toBeDisplayed();
}

describe('iOS check your answers page', () => {
    beforeEach(async () => {
        await completeRecordUpToCheckYourAnswers(journeyData);
        await expect(CheckYourAnswersPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        await CheckYourAnswersPage.close();
    });

    it('displays the trip, gear and species sections', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.tripSection);
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.gearSection);
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.speciesCaughtSection);
    });

    it('shows the captured trip answers', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.vesselValue(journeyData.vessel));
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.departurePortValue(journeyData.port));
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.returnPortValue(journeyData.port));
        await scrollToAndExpectDisplayed(
            CheckYourAnswersPage.statisticalAreaValue(journeyData.catchArea),
        );
    });

    it('shows the captured gear answers', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.gearNameValue(journeyData.gear));
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.meshSizeValue(journeyData.meshSize));
        await scrollToAndExpectDisplayed(
            CheckYourAnswersPage.timesShotValue(journeyData.timesShot),
        );
    });

    it.only('shows the captured species answers', async () => {
        await scrollToAndExpectDisplayed(
            CheckYourAnswersPage.speciesNameValue(journeyData.species),
        );
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.weightAboveValue(journeyData.weight));
    });

    it('opens the select vessel page when changing the vessel', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.changeTripVesselButton);
        await CheckYourAnswersPage.changeTripVessel();

        await expect(SelectVesselPage.selectVesselHeading).toBeDisplayed();
    });

    it('opens the catch location page when changing the statistical area', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.changeStatisticalAreaButton);
        await CheckYourAnswersPage.changeStatisticalArea();

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it.only('opens the add gear page when changing the gear name', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.changeGearNameButton);
        await CheckYourAnswersPage.changeGearName();

        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it.only('opens the add species page when changing the species name', async () => {
        await scrollToAndExpectDisplayed(CheckYourAnswersPage.changeSpeciesNameButton);
        await CheckYourAnswersPage.changeSpeciesName();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });
});

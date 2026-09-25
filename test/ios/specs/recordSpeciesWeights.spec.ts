import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import LandingStoragePage from '../pageobjects/landingStoragePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import { completeRecordUpToAddSpecies, type CatchRecordJourneyData } from '../support/journeySteps';
import { logStep, logInfo } from '../../common/logger';

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

const secondSpecies = 'Atlantic salmon (SAL)';

async function scrollIntoView(element: ReturnType<typeof $>) {
    await element.waitForExist({ timeout: 10000 });
    await browser.execute('mobile: scrollToElement', {
        element: await element.elementId,
    });
}

describe('iOS record species weights page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await completeRecordUpToAddSpecies(journeyData);
        await AddSpeciesPage.selectSpecies(journeyData.species);
        await scrollIntoView(AddSpeciesPage.saveContinueButton);
        await AddSpeciesPage.continueToNextStep();
        await expect(RecordSpeciesWeightsPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        logStep('afterEach');
        await RecordSpeciesWeightsPage.close();
    });

    it('displays the record species weights controls', async () => {
        logStep('displays the record species weights controls');
        await expect(RecordSpeciesWeightsPage.description).toBeDisplayed();
        await expect(RecordSpeciesWeightsPage.speciesOption(journeyData.species)).toBeDisplayed();
        await expect(RecordSpeciesWeightsPage.saveContinueButton).toBeDisplayed();
    });

    it('records an above weight for the selected species', async () => {
        logStep('records an above weight for the selected species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);

        await expect(
            RecordSpeciesWeightsPage.weightAboveField(journeyData.species),
        ).toHaveAttribute('value', journeyData.weight);
    });

    it('continues to the landing storage page after recording a weight', async () => {
        logStep('continues to the landing storage page after recording a weight');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);
        await scrollIntoView(RecordSpeciesWeightsPage.saveContinueButton);
        await RecordSpeciesWeightsPage.continueToNextStep();

        await expect(LandingStoragePage.heading).toBeDisplayed();
    });

    it('reveals a below weight entry for the selected species', async () => {
        logStep('reveals a below weight entry for the selected species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);

        await RecordSpeciesWeightsPage.enterWeightBelowMin(journeyData.species, '10');

        await expect(
            RecordSpeciesWeightsPage.weightBelowField(journeyData.species),
        ).toHaveAttribute('value', '10');
    });

    it('reveals a discarded weight entry for the selected species', async () => {
        logStep('reveals a discarded weight entry for the selected species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);

        await RecordSpeciesWeightsPage.enterWeightDiscarded(journeyData.species, '20');

        await expect(
            RecordSpeciesWeightsPage.weightDiscardedField(journeyData.species),
        ).toHaveAttribute('value', '20');
    });

    it('returns to add species when adding another species', async () => {
        logStep('returns to add species when adding another species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);
        await scrollIntoView(RecordSpeciesWeightsPage.addSpeciesButton);
        await expect(RecordSpeciesWeightsPage.addSpeciesButton).toBeDisplayed();
        await RecordSpeciesWeightsPage.addSpecies();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });

    it('records weights for multiple species', async () => {
        logStep('records weights for multiple species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);
        await scrollIntoView(RecordSpeciesWeightsPage.addSpeciesButton);
        await RecordSpeciesWeightsPage.addSpecies();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
        await AddSpeciesPage.selectSpecies(secondSpecies);
        await scrollIntoView(AddSpeciesPage.saveContinueButton);
        await AddSpeciesPage.continueToNextStep();

        await expect(RecordSpeciesWeightsPage.heading).toBeDisplayed();
        await RecordSpeciesWeightsPage.enterWeight(secondSpecies, '250');

        await expect(RecordSpeciesWeightsPage.weightAboveField(secondSpecies)).toHaveAttribute(
            'value',
            '250',
        );
    });
});

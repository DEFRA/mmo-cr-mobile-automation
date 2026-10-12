import AddSpeciesPage from '../pageobjects/addSpeciesPage';
import LandingStoragePage from '../pageobjects/landingStoragePage';
import RecordSpeciesWeightsPage from '../pageobjects/recordSpeciesWeightsPage';
import iosFlowNavigator, { type CatchRecordJourneyData } from '../support/iosFlowNavigator';
import { logStep } from '../../common/logger';

const journeyData: CatchRecordJourneyData = {
    vessel: 'ACHILLES',
    port: 'Peel',
    gear: 'Gillnets (drift)',
    meshSize: '12',
    gearVariables: { netLengthHauled: '2', netLengthLeft: '1' },
    catchArea: '37E52',
    species: 'European lobster (LBE)',
    weight: '500',
    landingStorage: 'no',
};

const secondSpecies = 'Atlantic salmon (SAL)';

describe('iOS record species weights page', () => {
    beforeEach(async () => {
        logStep('beforeEach');
        await iosFlowNavigator.signIn();
        await iosFlowNavigator.openCreateRecord();
        await iosFlowNavigator.selectVessel(journeyData.vessel);
        await iosFlowNavigator.selectTripToday('yes');
        await iosFlowNavigator.addPort(journeyData.port);
        await iosFlowNavigator.confirmSamePort(journeyData.port, 'yes');
        await iosFlowNavigator.addGear(journeyData.gear);
        await iosFlowNavigator.enterGearMeasurements(journeyData.meshSize);
        await iosFlowNavigator.selectGearDetails('gnd', journeyData.gearVariables);
        await iosFlowNavigator.completeCatchLocation(journeyData.catchArea);
        await iosFlowNavigator.addSpecies(journeyData.species);
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
        await RecordSpeciesWeightsPage.addSpecies();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
    });

    it('records weights for multiple species', async () => {
        logStep('records weights for multiple species');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, journeyData.weight);
        await RecordSpeciesWeightsPage.addSpecies();

        await expect(AddSpeciesPage.heading).toBeDisplayed();
        await iosFlowNavigator.addSpecies(secondSpecies);

        await expect(RecordSpeciesWeightsPage.heading).toBeDisplayed();
        await RecordSpeciesWeightsPage.enterWeight(secondSpecies, '250');

        await expect(RecordSpeciesWeightsPage.weightAboveField(secondSpecies)).toHaveAttribute(
            'value',
            '250',
        );
    });

    it('allows editing of previously entered weights (AC3)', async () => {
        logStep('allows editing of previously entered weights (AC3)');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '100');
        await expect(
            RecordSpeciesWeightsPage.weightAboveField(journeyData.species),
        ).toHaveAttribute('value', '100');

        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '200');
        await expect(
            RecordSpeciesWeightsPage.weightAboveField(journeyData.species),
        ).toHaveAttribute('value', '200');
    });

    it('navigates to remove species page when remove species is clicked (AC5)', async () => {
        logStep('navigates to remove species page when remove species is clicked (AC5)');
        await RecordSpeciesWeightsPage.removeSpecies();

        const removeHeading = await $('//XCUIElementTypeStaticText[contains(@name, "Remove")]');
        await removeHeading.waitForDisplayed({ timeout: 10000 });
        await expect(removeHeading).toBeDisplayed();
    });

    it('validates weight entry business rules (AC6 - AC11)', async () => {
        logStep('validates weight entry business rules (AC6 - AC11)');

        logStep('AC6: blank Weight above minimum size retained');
        // Select the species to make weight above field appear
        const option = RecordSpeciesWeightsPage.speciesOption(journeyData.species);
        await option.click();
        await RecordSpeciesWeightsPage.continueToNextStep();
        const blankError = await $(
            '//XCUIElementTypeStaticText[contains(@name, "Enter the Weight") or contains(@name, "Weight above minimum")]',
        );
        await expect(blankError).toBeDisplayed();

        logStep('AC7: Weight legally discarded higher than Weight above minimum size retained');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '5');
        await RecordSpeciesWeightsPage.enterWeightDiscarded(journeyData.species, '10');
        await RecordSpeciesWeightsPage.continueToNextStep();
        const higherDiscardedError = await $(
            '//XCUIElementTypeStaticText[contains(@name, "must be higher")]',
        );
        await expect(higherDiscardedError).toBeDisplayed();

        // Remove discarded weight to not interfere with other tests
        await RecordSpeciesWeightsPage.removeWeightDiscarded(journeyData.species);

        logStep('AC8: entering weight incorrectly (two decimal places)');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '10.55');
        await RecordSpeciesWeightsPage.continueToNextStep();
        const decimalError = await $(
            '//XCUIElementTypeStaticText[contains(@name, "decimal") or contains(@name, "whole number")]',
        );
        await expect(decimalError).toBeDisplayed();

        logStep('Scenario 9: catch weight limit 0');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '0');
        await RecordSpeciesWeightsPage.continueToNextStep();
        const zeroError = await $(
            '//XCUIElementTypeStaticText[contains(@name, "more than 0kg") or contains(@name, "more the 0KG")]',
        );
        await expect(zeroError).toBeDisplayed();

        logStep('Scenario 10: catch weight limit 10,000');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '10001');
        await RecordSpeciesWeightsPage.continueToNextStep();
        const limitError = await $('//XCUIElementTypeStaticText[contains(@name, "10,000")]');
        await expect(limitError).toBeDisplayed();

        logStep('Scenario 11: entering weight with minus or letters');
        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, '-5');
        await RecordSpeciesWeightsPage.continueToNextStep();
        await expect(zeroError).toBeDisplayed();

        await RecordSpeciesWeightsPage.enterWeight(journeyData.species, 'abc');
        await RecordSpeciesWeightsPage.continueToNextStep();
        const letterError = await $(
            '//XCUIElementTypeStaticText[contains(@name, "must be a number")]',
        );
        await expect(letterError).toBeDisplayed();
    });
});

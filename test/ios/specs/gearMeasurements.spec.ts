import AddGearPage from '../pageobjects/addGearPage';
import CatchLocationPage from '../pageobjects/catchLocationPage';
import GearMeasurementsPage from '../pageobjects/gearMeasurementsPage';
import SelectGearPage from '../pageobjects/selectGearPage';
import { signInAndOpenCreateRecord, selectVesselAndTripToday, completePortJourney } from '../support/journeySteps';

describe('iOS gear measurements page', () => {
    beforeEach(async () => {
        await signInAndOpenCreateRecord();
        await selectVesselAndTripToday('ACHILLES', 'yes');
        await completePortJourney('Peterhead');
        await AddGearPage.selectGear('Seine nets (not specified)');
        await AddGearPage.continueToNextStep();
        await expect(GearMeasurementsPage.heading).toBeDisplayed();
    });

    afterEach(async () => {
        await GearMeasurementsPage.close();
    });

    it('displays the gear measurement controls', async () => {
        await expect(GearMeasurementsPage.wholeNumbersText).toBeDisplayed();
        await expect(GearMeasurementsPage.meshSizeLabel).toBeDisplayed();
        await expect(GearMeasurementsPage.meshSizeField).toBeDisplayed();
        await expect(GearMeasurementsPage.saveContinueButton).toBeDisplayed();
    });

    it('accepts a mesh size value', async () => {
        await GearMeasurementsPage.enterMeshSize('12');

        await expect(GearMeasurementsPage.meshSizeField).toHaveAttribute('value', '12');
    });

    it('saves a whole mesh size and continues to select gear', async () => {
        await GearMeasurementsPage.enterMeshSize('12');
        await expect(GearMeasurementsPage.meshSizeField).toHaveAttribute('value', '12');

        await GearMeasurementsPage.continueToNextStep();

        await expect(SelectGearPage.heading).toBeDisplayed();
        await expect(SelectGearPage.seineNetsOption).toBeDisplayed();
        await expect(SelectGearPage.seineNetsOption).not.toBeSelected();

        await SelectGearPage.selectSeineNets();
        await expect(SelectGearPage.seineNetsOption).toBeSelected();
    });

    it('accepts a whole times-shot value and allows adding another gear', async () => {
        await GearMeasurementsPage.enterMeshSize('12');
        await GearMeasurementsPage.continueToNextStep();

        await expect(SelectGearPage.seineNetsOption).toBeDisplayed();
        await expect(SelectGearPage.seineNetsOption).not.toBeSelected();
        await SelectGearPage.selectSeineNets();

        await expect(SelectGearPage.timesShotField).toBeDisplayed();
        await SelectGearPage.enterTimesShot('2');
        await expect(SelectGearPage.timesShotField).toHaveAttribute('value', '2');
        await expect(SelectGearPage.addAnotherGearButton).toBeDisplayed();

        await SelectGearPage.addAnotherGear();
        await expect(AddGearPage.heading).toBeDisplayed();
    });

    it('saves the selected gear and continues to catch location', async () => {
        await GearMeasurementsPage.enterMeshSize('12');
        await GearMeasurementsPage.continueToNextStep();

        await SelectGearPage.selectSeineNets();
        await SelectGearPage.enterTimesShot('2');
        await expect(SelectGearPage.timesShotField).toHaveAttribute('value', '2');
        await SelectGearPage.continueToNextStep();

        await expect(CatchLocationPage.heading).toBeDisplayed();
    });

    it('stays on the page when continuing without a mesh size', async () => {
        await GearMeasurementsPage.continueToNextStep();

        await expect(GearMeasurementsPage.heading).toBeDisplayed();
        await expect(await GearMeasurementsPage.meshSizeField.getAttribute('value')).toBeNull();
    });

    it('does not advance with a decimal mesh size', async () => {
        await GearMeasurementsPage.enterMeshSize('12.5');
        await GearMeasurementsPage.continueToNextStep();

        await expect(GearMeasurementsPage.heading).toBeDisplayed();
        await expect(GearMeasurementsPage.wholeNumbersText).toBeDisplayed();
    });
});

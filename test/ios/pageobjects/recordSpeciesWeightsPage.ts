import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class RecordSpeciesWeightsPage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.recordSpeciesWeights.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.recordSpeciesWeights.heading');
    }

    get description() {
        return $(
            '~Select all the species you caught, with or without catch limits. Then enter estimated live weights. Landed weights can be converted to live weights by multiplying them by a conversion factor.',
        );
    }

    speciesOption(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.option.${speciesName.toLowerCase()}`);
    }

    weightAboveField(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.weightAbove.${speciesName.toLowerCase()}`);
    }

    addWeightBelowButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.addBelow.${speciesName.toLowerCase()}`);
    }

    addWeightDiscardedButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.addDiscarded.${speciesName.toLowerCase()}`);
    }

    get addSpeciesButton() {
        return $('~CatchRecord.recordSpeciesWeights.addSpecies');
    }

    get removeSpeciesButton() {
        return $('~CatchRecord.recordSpeciesWeights.removeSpecies');
    }

    get saveContinueButton() {
        return $('~CatchRecord.recordSpeciesWeights.saveContinue');
    }

    async enterWeight(speciesName: string, value: string) {
        const option = this.speciesOption(speciesName);
        await option.waitForDisplayed({ timeout: 10000 });
        if (!(await option.isSelected())) {
            await option.click();
        }

        const field = this.weightAboveField(speciesName);
        await field.waitForDisplayed({ timeout: 10000 });
        await field.setValue(value);
    }

    async addSpecies() {
        await this.addSpeciesButton.click();
    }

    async removeSpecies() {
        await this.removeSpeciesButton.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new RecordSpeciesWeightsPage();

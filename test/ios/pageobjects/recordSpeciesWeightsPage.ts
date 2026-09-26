import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class RecordSpeciesWeightsPage extends BaseCatchRecordPage {
    protected pageId = 'recordSpeciesWeights';

    get description() {
        return $(
            '~Select all the species you caught, with or without catch limits. Then enter estimated live weights. Landed weights can be converted to live weights by multiplying them by a conversion factor.',
        );
    }

    speciesOption(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.option.${speciesName.toLowerCase()}`);
    }

    errorSummaryItem(index: number) {
        return $(`~CatchRecord.recordSpeciesWeights.errorSummary.item.${index}`);
    }

    weightAboveField(speciesName: string) {
        return $(
            `//XCUIElementTypeTextField[@name="CatchRecord.recordSpeciesWeights.weightAbove.${speciesName.toLowerCase()}"]`,
        );
    }

    weightAboveError(speciesName: string) {
        return $(
            `//XCUIElementTypeStaticText[@name="CatchRecord.recordSpeciesWeights.weightAbove.${speciesName.toLowerCase()}"]`,
        );
    }

    addWeightBelowButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.addBelow.${speciesName.toLowerCase()}`);
    }

    weightBelowField(speciesName: string) {
        return $(
            `//XCUIElementTypeTextField[@name="CatchRecord.recordSpeciesWeights.weightBelow.${speciesName.toLowerCase()}"]`,
        );
    }

    removeWeightBelowButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.removeBelow.${speciesName.toLowerCase()}`);
    }

    addWeightDiscardedButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.addDiscarded.${speciesName.toLowerCase()}`);
    }

    weightDiscardedField(speciesName: string) {
        return $(
            `//XCUIElementTypeTextField[@name="CatchRecord.recordSpeciesWeights.weightDiscarded.${speciesName.toLowerCase()}"]`,
        );
    }

    removeWeightDiscardedButton(speciesName: string) {
        return $(`~CatchRecord.recordSpeciesWeights.removeDiscarded.${speciesName.toLowerCase()}`);
    }

    get addSpeciesButton() {
        return $('~CatchRecord.recordSpeciesWeights.addSpecies');
    }

    get removeSpeciesButton() {
        return $('~CatchRecord.recordSpeciesWeights.removeSpecies');
    }
    async enterWeight(speciesName: string, value: string) {
        logStep(
            `[${this.constructor.name}] enterWeight with species: ${speciesName} and weight: ${value}`,
        );
        const option = this.speciesOption(speciesName);
        await this.scrollToElementIfExisting(option);
        await option.waitForDisplayed({ timeout: 10000 });
        if (!(await option.isSelected())) {
            await option.click();
        }

        const field = this.weightAboveField(speciesName);
        await this.scrollToElementIfExisting(field);
        await field.waitForDisplayed({ timeout: 10000 });
        await field.setValue(value);
    }

    async enterWeightBelowMin(speciesName: string, value: string) {
        logStep(
            `[${this.constructor.name}] enterWeightBelowMin with species: ${speciesName} and weight: ${value}`,
        );
        await this.scrollAndClickIfExisting(this.addWeightBelowButton(speciesName));
        const field = this.weightBelowField(speciesName);
        await this.scrollToElementIfExisting(field);
        await field.waitForDisplayed({ timeout: 10000 });
        await field.setValue(value);
    }

    async removeWeightBelowMin(speciesName: string) {
        logStep(`[${this.constructor.name}] removeWeightBelowMin with species: ${speciesName}`);
        await this.scrollAndClickIfExisting(this.removeWeightBelowButton(speciesName));
    }

    async enterWeightDiscarded(speciesName: string, value: string) {
        logStep(
            `[${this.constructor.name}] enterWeightDiscarded with species: ${speciesName} and weight: ${value}`,
        );
        await this.scrollAndClickIfExisting(this.addWeightDiscardedButton(speciesName));
        const field = this.weightDiscardedField(speciesName);
        await this.scrollToElementIfExisting(field);
        await field.waitForDisplayed({ timeout: 10000 });
        await field.setValue(value);
    }

    async removeWeightDiscarded(speciesName: string) {
        logStep(`[${this.constructor.name}] removeWeightDiscarded with species: ${speciesName}`);
        await this.scrollAndClickIfExisting(this.removeWeightDiscardedButton(speciesName));
    }

    async addSpecies() {
        await this.scrollAndClickIfExisting(this.addSpeciesButton);
    }

    async removeSpecies() {
        await this.scrollAndClickIfExisting(this.removeSpeciesButton);
    }
}

export default new RecordSpeciesWeightsPage();

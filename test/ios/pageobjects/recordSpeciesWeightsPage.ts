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

    get europeanLobsterOption() {
        return $('~CatchRecord.recordSpeciesWeights.option.european lobster (lbe)');
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

    async selectSpecies(speciesName: string) {
        const normalized = speciesName.toLowerCase();
        const candidates = [
            this.selector(`CatchRecord.recordSpeciesWeights.option.${normalized}`),
            this.selector(`CatchRecord.recordSpeciesWeights.option.${speciesName}`),
            this.selector(speciesName),
            this.selector(
                `CatchRecord.recordSpeciesWeights.option.${normalized.replace(/\s+/g, '')}`,
            ),
        ];

        for (const candidate of candidates) {
            if (await candidate.isExisting()) {
                await candidate.click();
                return;
            }
        }

        throw new Error(`Could not find species option: ${speciesName}`);
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

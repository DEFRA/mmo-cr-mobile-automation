import { BasePage } from './basePage';

export class SelectedSpeciesPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[contains(@text, "Select all the species you caught")]');
    }

    speciesItemRow(speciesName: string) {
        return $(
            `//android.view.View[@checkable="true" and .//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    get retainedWeightLabel() {
        return $('//android.widget.TextView[@text="Weight above minimum size retained (kg)"]');
    }

    get retainedWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight above minimum size retained (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get belowMinWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight below minimum size retained (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get discardedWeightField() {
        return $(
            '//android.widget.TextView[@text="Weight legally discarded (kg)"]/following-sibling::android.widget.EditText[1]',
        );
    }

    get addBelowMinWeightButton() {
        return $('//android.widget.Button[@text="Add weight below minimum size retained (kg)"]');
    }

    get removeBelowMinWeightButton() {
        return $('//android.widget.Button[@text="Remove weight below minimum size retained (kg)"]');
    }

    get addDiscardedWeightButton() {
        return $('//android.widget.Button[@text="Add weight legally discarded (kg)"]');
    }

    get removeDiscardedWeightButton() {
        return $('//android.widget.Button[@text="Remove weight legally discarded (kg)"]');
    }

    get removeSpeciesButton() {
        return $('//android.widget.Button[@text="Remove a species"]');
    }

    get addSpeciesButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add a species"]]',
        );
    }

    async selectSpeciesCheckbox(speciesName: string) {
        const row = this.speciesItemRow(speciesName);
        await row.waitForDisplayed({ timeout: 10000 });
        await row.click();
    }

    async enterRetainedWeight(weight: string | number) {
        await this.retainedWeightField.waitForDisplayed({ timeout: 10000 });
        await this.retainedWeightField.setValue(weight.toString());
    }

    async enterBelowMinWeight(weight: string | number) {
        await this.belowMinWeightField.waitForDisplayed({ timeout: 10000 });
        await this.belowMinWeightField.setValue(weight.toString());
    }

    async enterDiscardedWeight(weight: string | number) {
        await this.discardedWeightField.waitForDisplayed({ timeout: 10000 });
        await this.discardedWeightField.setValue(weight.toString());
    }

    async clickAddBelowMinWeight() {
        await this.addBelowMinWeightButton.waitForDisplayed({ timeout: 10000 });
        await this.addBelowMinWeightButton.click();
    }

    async clickRemoveBelowMinWeight() {
        await this.removeBelowMinWeightButton.waitForDisplayed({ timeout: 10000 });
        await this.removeBelowMinWeightButton.click();
    }

    async clickAddDiscardedWeight() {
        await this.addDiscardedWeightButton.waitForDisplayed({ timeout: 10000 });
        await this.addDiscardedWeightButton.click();
    }

    async clickRemoveDiscardedWeight() {
        await this.removeDiscardedWeightButton.waitForDisplayed({ timeout: 10000 });
        await this.removeDiscardedWeightButton.click();
    }

    async clickRemoveSpecies() {
        await this.removeSpeciesButton.waitForDisplayed({ timeout: 10000 });
        await this.removeSpeciesButton.click();
    }

    async clickAddSpecies() {
        await this.addSpeciesButton.waitForDisplayed({ timeout: 10000 });
        await this.addSpeciesButton.click();
    }
}

export default new SelectedSpeciesPage();

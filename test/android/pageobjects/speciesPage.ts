import { BasePage } from './basePage';

export class SpeciesPage extends BasePage {
    /** Dynamic heading, e.g. "Which species did you catch with seine nets..." */
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Which species did you catch") and @heading="true"]',
        );
    }

    get searchLabel() {
        return $('//android.widget.TextView[@text="Type to search (minimum 2 characters)"]');
    }

    get searchField() {
        return $('//android.widget.EditText');
    }

    /** Select a species from the autocomplete suggestions (e.g. "Brown crab (TBC)") */
    speciesOption(speciesName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[@text="${speciesName}"]]`,
        );
    }

    // --- Actions ---

    async enterSpeciesName(species: string) {
        await this.searchField.waitForDisplayed({ timeout: 10000 });
        await this.searchField.setValue(species);
    }

    /** Type a search term, wait for the species option to appear, and tap it. */
    async searchAndSelectSpecies(searchText: string, speciesName: string) {
        await this.enterSpeciesName(searchText);
        const option = this.speciesOption(speciesName);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    /** Type, select a suggestion, and tap Save and continue. */
    async searchSelectAndContinue(searchText: string, speciesName: string) {
        await this.searchAndSelectSpecies(searchText, speciesName);
        await this.saveAndContinue();
    }
}

export default new SpeciesPage();

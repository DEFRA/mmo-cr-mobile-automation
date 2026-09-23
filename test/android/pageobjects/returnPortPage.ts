import { BasePage } from './basePage';

export class ReturnPortPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Which port or closest port did you return to?" and @heading="true"]',
        );
    }

    // --- State 1: Confirming default port (if shown) ---
    get yesOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Yes"]]');
    }

    get noOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="No"]]');
    }

    // --- State 2: Port selection list (e.g. Hastings, Dover) ---
    /** Select a port radio button by name (e.g. "Hastings", "Dover"). */
    portOption(portName: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    /** Returns all port radio-button Views so you can iterate or count them. */
    get allPortOptions() {
        return $$('//android.view.View[@checkable="true"]');
    }

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    // --- State 3 & 4: Add port manually (Search & Autocomplete) ---
    get portSearchField() {
        return $('//android.widget.EditText');
    }

    /** Validation error shown when submitting without selecting or entering a port. */
    get validationError() {
        return $('//android.widget.TextView[@text="Select a port or choose one from the list"]');
    }

    /** Select a port suggestion from the autocomplete dropdown by name. */
    portSuggestion(portName: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    /** Returns all visible port suggestion items. */
    get allPortSuggestions() {
        return $$(
            '//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button]',
        );
    }

    // --- Actions ---

    async selectYes() {
        await this.yesOption.waitForDisplayed({ timeout: 10000 });
        await this.yesOption.click();
    }

    async selectNo() {
        await this.noOption.waitForDisplayed({ timeout: 10000 });
        await this.noOption.click();
    }

    async selectPort(portName: string) {
        const option = this.portOption(portName);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async clickAddPort() {
        await this.addPortButton.waitForDisplayed({ timeout: 10000 });
        await this.addPortButton.click();
    }

    async selectYesAndContinue() {
        await this.selectYes();
        await this.saveAndContinue();
    }

    async selectNoAndContinue() {
        await this.selectNo();
        await this.saveAndContinue();
    }

    /** Select a port by name and tap Save and continue. */
    async selectPortAndContinue(portName: string) {
        await this.selectPort(portName);
        await this.saveAndContinue();
    }

    async enterPortName(portName: string) {
        await this.portSearchField.waitForDisplayed({ timeout: 10000 });
        await this.portSearchField.setValue(portName);
    }

    /** Type a port name and tap Save and continue. */
    async enterPortNameAndContinue(portName: string) {
        await this.enterPortName(portName);
        await this.saveAndContinue();
    }

    /** Type a search term, wait for an autocomplete suggestion, and tap it. */
    async searchAndSelectPort(searchText: string, portName: string) {
        await this.enterPortName(searchText);
        const suggestion = this.portSuggestion(portName);
        await suggestion.waitForDisplayed({ timeout: 10000 });
        await suggestion.click();
    }

    /** Type, select a suggestion, and tap Save and continue in one step. */
    async searchSelectAndContinue(searchText: string, portName: string) {
        await this.searchAndSelectPort(searchText, portName);
        await this.saveAndContinue();
    }
}

export default new ReturnPortPage();

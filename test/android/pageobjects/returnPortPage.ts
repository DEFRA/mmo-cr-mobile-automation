import { BasePage } from './basePage';

export class ReturnPortPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Which port or closest port did you return to?" and @heading="true"]',
        );
    }

    get yesOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Yes"]]');
    }

    get noOption() {
        return $('//android.view.View[@checkable="true"][.//android.widget.TextView[@text="No"]]');
    }

    portOption(portName: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    get allPortOptions() {
        return $$('//android.view.View[@checkable="true"]');
    }

    get addPortButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Add port"]]',
        );
    }

    get portSearchField() {
        return $('//android.widget.EditText');
    }

    get validationError() {
        return $('//android.widget.TextView[@text="Select a port or choose one from the list"]');
    }

    portSuggestion(portName: string) {
        return $(
            `//android.view.View[@clickable="true"][.//android.widget.TextView[@text="${portName}"]]`,
        );
    }

    get allPortSuggestions() {
        return $$(
            '//android.widget.ScrollView//android.view.View[@clickable="true"][.//android.widget.Button]',
        );
    }

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

    async selectPortAndContinue(portName: string) {
        await this.selectPort(portName);
        await this.saveAndContinue();
    }

    async enterPortName(portName: string) {
        await this.portSearchField.waitForDisplayed({ timeout: 10000 });
        await this.portSearchField.setValue(portName);
    }

    async enterPortNameAndContinue(portName: string) {
        await this.enterPortName(portName);
        await this.saveAndContinue();
    }

    async searchAndSelectPort(searchText: string, portName: string) {
        await this.enterPortName(searchText);
        const suggestion = this.portSuggestion(portName);
        await suggestion.waitForDisplayed({ timeout: 10000 });
        await suggestion.click();
    }

    async searchSelectAndContinue(searchText: string, portName: string) {
        await this.searchAndSelectPort(searchText, portName);
        await this.saveAndContinue();
    }
}

export default new ReturnPortPage();

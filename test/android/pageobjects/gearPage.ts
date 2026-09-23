import { BasePage } from './basePage';

export class GearPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="What gear did you use?" and @heading="true"]');
    }

    get gearSearchLabel() {
        return $('//android.widget.TextView[@text="Enter the gear you used"]');
    }

    get gearSearchField() {
        return $('//android.widget.EditText');
    }

    gearOption(gearName: string) {
        return $(
            `//android.view.View[@clickable="true" or @checkable="true"][.//android.widget.TextView[@text="${gearName}"]]`,
        );
    }

    async enterGearName(gearName: string) {
        await this.gearSearchField.waitForDisplayed({ timeout: 10000 });
        await this.gearSearchField.setValue(gearName);
    }

    async enterGearNameAndContinue(gearName: string) {
        await this.enterGearName(gearName);
        await this.saveAndContinue();
    }

    async searchAndSelectGear(searchText: string, gearName: string) {
        await this.enterGearName(searchText);
        const option = this.gearOption(gearName);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async searchSelectAndContinue(searchText: string, gearName: string) {
        await this.searchAndSelectGear(searchText, gearName);
        await this.saveAndContinue();
    }
}

export default new GearPage();

import { BasePage } from './basePage';

export class GearMeasurementPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Enter the measurements for") and @heading="true"]',
        );
    }

    dynamicHeading(gearName: string) {
        return $(
            `//android.widget.TextView[@text="Enter the measurements for ${gearName}" and @heading="true"]`,
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[@text="All gear measurements must be whole numbers."]');
    }

    get meshSizeLabel() {
        return $('//android.widget.TextView[@text="Mesh size (mm)"]');
    }

    get meshSizeField() {
        return $('//android.widget.EditText');
    }

    measurementFieldByIndex(index: number) {
        return $(`(//android.widget.EditText)[${index}]`);
    }

    async enterMeshSize(size: string | number) {
        await this.meshSizeField.waitForDisplayed({ timeout: 10000 });
        await this.meshSizeField.setValue(size.toString());
    }

    async enterMeshSizeAndContinue(size: string | number) {
        await this.enterMeshSize(size);
        await this.saveAndContinue();
    }
}

export default new GearMeasurementPage();

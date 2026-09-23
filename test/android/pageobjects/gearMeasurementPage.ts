import { BasePage } from './basePage';

export class GearMeasurementPage extends BasePage {
    /** Generic heading locator that matches any gear measurement heading. */
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Enter the measurements for") and @heading="true"]',
        );
    }

    /** Specific heading locator if you want to assert the exact gear name (e.g. "seine nets"). */
    dynamicHeading(gearName: string) {
        return $(
            `//android.widget.TextView[@text="Enter the measurements for ${gearName}" and @heading="true"]`,
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[@text="All gear measurements must be whole numbers."]');
    }

    // --- Measurement Fields ---

    get meshSizeLabel() {
        return $('//android.widget.TextView[@text="Mesh size (mm)"]');
    }

    /** The first measurement input field (Mesh size for seine nets). */
    get meshSizeField() {
        return $('//android.widget.EditText');
    }

    /** Get a measurement input field by its 1-based index (useful if other gears have multiple inputs). */
    measurementFieldByIndex(index: number) {
        return $(`(//android.widget.EditText)[${index}]`);
    }

    // --- Actions ---

    async enterMeshSize(size: string | number) {
        await this.meshSizeField.waitForDisplayed({ timeout: 10000 });
        await this.meshSizeField.setValue(size.toString());
    }

    /** Enter a mesh size and tap Save and continue. */
    async enterMeshSizeAndContinue(size: string | number) {
        await this.enterMeshSize(size);
        await this.saveAndContinue();
    }
}

export default new GearMeasurementPage();

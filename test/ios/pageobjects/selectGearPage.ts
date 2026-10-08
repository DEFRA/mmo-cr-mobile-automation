import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SelectGearPage extends BaseCatchRecordPage {
    protected pageId = 'selectGear';

    get description() {
        return $('~Select all the gears used on your vessel.');
    }

    get checkboxGroup() {
        return $('~CatchRecord.selectGear.checkboxGroup');
    }

    gearOption(code: string) {
        return this.selector(`CatchRecord.selectGear.option.${code.toLowerCase()}`);
    }

    gearLabel(gearName: string) {
        return $(`~${gearName}`);
    }

    meshDetailText(meshSize: string) {
        return $(`~Mesh size (mm): ${meshSize}`);
    }

    gearVariableLabel(gearCode: string, variableName: string) {
        return $(`~CatchRecord.selectGear.variable.${gearCode.toLowerCase()}.${variableName}`);
    }

    gearVariableField(gearCode: string, variableName: string) {
        return $(
            `//XCUIElementTypeTextField[@name="CatchRecord.selectGear.variable.${gearCode.toLowerCase()}.${variableName}"]`,
        );
    }

    get validationError() {
        return $('~CatchRecord.selectGear.error');
    }

    get addAnotherGearButton() {
        return $('~CatchRecord.selectGear.addAnother');
    }

    async selectGear(gearCode: string) {
        logStep(`selectGear code: ${gearCode}`);
        await this.gearOption(gearCode).click();
    }

    async enterGearVariable(gearCode: string, variableName: string, value: string) {
        logStep(`enterGearVariable code: ${gearCode} var: ${variableName}`);
        await this.gearVariableField(gearCode, variableName).setValue(value);
    }
    async addAnotherGear() {
        await this.addAnotherGearButton.click();
    }
}

export default new SelectGearPage();

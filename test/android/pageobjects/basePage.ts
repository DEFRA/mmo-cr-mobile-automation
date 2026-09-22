import { CommonBasePage } from '../../common/commonBasePage';

export class BasePage extends CommonBasePage {
    protected readonly appId = process.env.ANDROID_APP_ID ?? 'uk.gov.defra.mmocatchrecord';
}

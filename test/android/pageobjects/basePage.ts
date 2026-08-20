import { CommonBasePage } from '../../common/commonBasePage';

export class BasePage extends CommonBasePage {
    protected readonly appId = process.env.ANDROID_APP_ID ?? 'com.wdiodemoapp';

    get tabHome() {
        return $('~Home');
    }
}

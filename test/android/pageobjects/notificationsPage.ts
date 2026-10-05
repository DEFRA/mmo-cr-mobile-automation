import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

export class NotificationsPage extends BasePage {
    get heading() {
        // Note: The XML indicates heading="false" for this text,
        // but it's the only text on the page so it acts as the heading.
        return $('//android.widget.TextView[@text="Notifications"]');
    }
}

export default new NotificationsPage();

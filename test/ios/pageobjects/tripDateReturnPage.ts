import { TripDatePage } from './tripDatePage';
import { logStep } from '../../common/logger';

export class TripDateReturnPage extends TripDatePage {
    protected pageId = 'tripDate.return';

    get dateContainer() {
        return $('~When did you return from your trip?');
    }

    get dateHelperText() {
        return $('~Enter the date you returned. For example, 31/03/2020');
    }

    async enterReturnDate(day: string, monthName: string, year: string) {
        logStep('date entry');
        await this.enterDate(day, monthName, year);
    }
}

export default new TripDateReturnPage();

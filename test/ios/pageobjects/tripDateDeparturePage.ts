import { TripDatePage } from './tripDatePage';
import { logStep } from '../../common/logger';

export class TripDateDeparturePage extends TripDatePage {
    protected pageId = 'tripDate.departure';

    get dateContainer() {
        return $('~When did you leave for your trip?');
    }

    get dateHelperText() {
        return $('~Enter the date you departed. For example, 31/03/2020');
    }

    async enterDepartureDate(day: string, monthName: string, year: string) {
        logStep('date entry');
        await this.enterDate(day, monthName, year);
    }
}

export default new TripDateDeparturePage();

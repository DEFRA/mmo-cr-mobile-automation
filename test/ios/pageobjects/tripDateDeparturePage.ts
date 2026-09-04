import { TripDatePage } from './tripDatePage';

export class TripDateDeparturePage extends TripDatePage {
    protected readonly prefix = 'CatchRecord.tripDate.departure';

    get dateContainer() {
        return $('~When did you leave for your trip?');
    }

    get dateHelperText() {
        return $('~Enter the date you departed. For example, 31/03/2020');
    }

    async enterDepartureDate(day: string, month: string, year: string) {
        await this.enterDate(day, month, year);
    }
}

export default new TripDateDeparturePage();

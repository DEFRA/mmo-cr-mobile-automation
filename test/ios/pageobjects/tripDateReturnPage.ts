import { TripDatePage } from './tripDatePage';

export class TripDateReturnPage extends TripDatePage {
    protected readonly prefix = 'CatchRecord.tripDate.return';

    get dateContainer() {
        return $('~When did you return from your trip?');
    }

    get dateHelperText() {
        return $('~Enter the date you returned. For example, 31/03/2020');
    }

    async enterReturnDate(day: string, month: string, year: string) {
        await this.enterDate(day, month, year);
    }
}

export default new TripDateReturnPage();

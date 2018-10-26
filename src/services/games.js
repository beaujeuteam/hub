
@Injectable()
export class GamesRepository {
    constructor() {
        this.url = 'https://api-endpoint.igdb.com';
        this.token = 'afcd483edfcae4db8122fc8ae5d38fc1';
    }

    getHeaders() {
        const headers = new Headers();
        headers.append('user-key', this.token);
        headers.append('Accept', 'application/json');

        return headers;
    }

    search(name) {
        return fetch(`${this.url}/games?search=${name}`, { method: 'GET', headers: this.getHeaders() })
            .then(response => response.json());
    }
}

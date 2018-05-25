import { Injectable } from 'angular-js-proxy';

@Injectable()
export class CommonUtils {
    stringToURL(string) {
        return String(string).replace(/\s/g, '-').toLowerCase();
    }
}

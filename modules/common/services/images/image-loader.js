import { Injectable } from 'angular-js-proxy';

@Injectable()
export class ImageLoader {
    constructor() {
        this.images = [];
        this.loading = false;
    }

    add(url, callback) {
        this.images.push({ url, callback });
        this.process();
    }

    process() {
        if (!this.loading && this.images.length > 0) {
            this.loading = true;
            const { url, callback } = this.images.pop();

            const xhr = new XMLHttpRequest();
            const reader = new FileReader();

            xhr.onload = () => {
                reader.onloadend = () => {
                    callback(reader.result);
                    this.loading = false;
                    this.process();
                }

                reader.readAsDataURL(xhr.response);
            };

            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }
    }
}

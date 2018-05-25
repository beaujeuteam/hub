import { Component } from 'angular-js-proxy';

import { ImageCacher } from './../../services/images/image-cacher';
import { ImageLoader } from './../../services/images/image-loader';

@Component({
    selector: 'common-image-loader-component',
    inputs: ['url', 'className', 'title'],
    template: `
        <i *ngIf="loading" class="fa fa-spinner"></i>
        <img *ngIf="!loading" [class]="className" [src]="src" [title]="url" />
    `,
    providers: [ImageCacher, ImageLoader]
})
export class ImageLoaderComponent {
    constructor(cacher, loader) {
        this.cacher = cacher;
        this.loader = loader;
        this.url = null;
        this.className = '';
        this.title = '';

        this.loading = true;
        this.src = null;
    }

    ngOnInit() {
        const cachedImage = this.cacher.get(this.url);

        if (!!cachedImage) {
            this.loading = false;
            return this.src = cachedImage;
        }

        this.loader.add(this.url, (src) => {
            this.cacher.set(this.url, this.src);
            this.src = src;
            this.loading = false;
        });
    }
}

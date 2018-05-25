import { NgModule, common } from 'angular-js-proxy';

import boxstore from 'boxstore';

import { Client } from './services/client';
export { Client } from './services/client';

import { Repository } from './services/repository';
export { Repository } from './services/repository';

import { CommonUtils } from './services/utils';
export { CommonUtils } from './services/utils';

import { ImageCacher } from './services/images/image-cacher';
export { ImageCacher } from './services/images/image-cacher';

import { ImageLoader } from './services/images/image-loader';
export { ImageLoader } from './services/images/image-loader';

import { Logger } from './services/logger';
export { Logger } from './services/logger';

import { ImageLoaderComponent } from './components/images/image-loader';
import { ImageLoadingComponent } from './components/loading/image-loading';
import { LabelLoadingComponent } from './components/loading/label-loading';
import { ArticleLoadingComponent } from './components/loading/article-loading';

@NgModule({
    imports: [common.CommonModule],
    declarations: [ImageLoaderComponent, ImageLoadingComponent, LabelLoadingComponent, ArticleLoadingComponent],
    providers: [Client, Repository, CommonUtils, ImageCacher, ImageLoader],
    exports: [ImageLoaderComponent, ImageLoadingComponent, LabelLoadingComponent, ArticleLoadingComponent]
})
export class CommonModule {
    constructor(client) {
        const logger = new Logger();
        const token = localStorage.getItem('access-token') || '';

        boxstore.add('logger', logger);
    }
}

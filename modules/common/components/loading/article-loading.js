import { Component } from 'angular-js-proxy';

@Component({
    selector: 'common-article-loading-component',
    inputs: ['width', 'height', 'className'],
    styles: ['.loading { background: #a6acb1; border-radius: 10px; }'],
    template: `
        <div class="media">
            <common-image-loading-component
                [width]="50"
                [height]="50"
                [className]="'rounded-circle mr-3'">
            </common-image-loading-component>
            <div class="media-body">
                <common-label-loading-component [width]="100" [height]="20" [className]="'mb-2'"></common-label-loading-component>
                <common-label-loading-component [width]="80" [height]="18"></common-label-loading-component>
            </div>
        </div>
    `
})
export class ArticleLoadingComponent {
    constructor() {
        this.width = 50;
        this.height = 20;
        this.className = '';
    }
}

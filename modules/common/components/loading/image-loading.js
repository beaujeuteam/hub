import { Component } from 'angular-js-proxy';

@Component({
    selector: 'common-image-loading-component',
    inputs: ['width', 'height', 'className'],
    styles: ['.loading { background: #a6acb1; }'],
    template: `
        <div [class]="'loading ' + className" [style.width.px]="width" [style.height.px]="height"></div>
    `
})
export class ImageLoadingComponent {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.className = '';
    }
}

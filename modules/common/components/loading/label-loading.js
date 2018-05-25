import { Component } from 'angular-js-proxy';

@Component({
    selector: 'common-label-loading-component',
    inputs: ['width', 'height', 'className'],
    styles: ['.loading { background: #a6acb1; border-radius: 10px; }'],
    template: `
        <div [class]="'loading ' + className" [style.width.px]="width" [style.height.px]="height"></div>
    `
})
export class LabelLoadingComponent {
    constructor() {
        this.width = 50;
        this.height = 20;
        this.className = '';
    }
}

import boxstore from 'boxstore';
import flvjs from 'flv.js';

@Component({
    selector: 'stream-video-component',
    inputs: ['id', 'width', 'height', 'poster', 'auto'],
    template: `
        <video></video>
    `,
    inject: [ng.core.ElementRef]
})
export class StreamVideoComponent {
    constructor(ElementRef) {
        this.element = ElementRef.nativeElement;
        this.id = null;
        this.width = null;
        this.height = null;
        this.poster = null;
        this.auto = false;

        this.player = null;
    }

    ngOnInit() {
        const element = this.element.querySelector('video');
        if (!!this.width) {
            element.width = `${this.width}px`;
        }

        if (!!this.height) {
            element.height = `${this.height}px`;
        }

        if (!!this.auto) {
            element.width = this.element.parentElement.offsetWidth;
        }

        if (!!this.poster) {
            element.poster = this.poster;
        }

        this.player = flvjs.createPlayer({
            type: 'flv',
            url: `${boxstore.get('stream.url')}:8981/live/${this.id}.flv`
        });
    }

    ngAfterViewInit() {
        const element = this.element.querySelector('video');
        element.controls = true;

        this.player.attachMediaElement(element);
        this.player.load();
    }

    ngOnDestroy() {
        if (null !== this.player) {
            this.player.destroy();
        }
    }
}

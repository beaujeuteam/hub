import { Directive } from 'angular-js-proxy';
import SimpleMDE from 'simplemde';

@Directive({
    selector: '[socialSimplemde]'
})
export class SimplemdeDirective {
    constructor(ElementRef) {
        this.element = ElementRef;
        this.editor = new SimpleMDE({ element: this.element.nativeElement });
    }
}

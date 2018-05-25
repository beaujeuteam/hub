import { CommonModule } from './../common';

import { NgModule, common, forms } from 'angular-js-proxy';

import { SimpleEditorComponent } from './components/editors/simple-editor';
import { MarkdownEditorComponent } from './components/editors/markdown-editor';
import { EmojisPickerComponent } from './components/utils/emojis-picker';
import { ModalEmojisPickerComponent } from './components/utils/modal-emojis-picker';
import { TextDecorationComponent } from './components/utils/text-decoration';
import { ActionsButtonComponent } from './components/actions/actions-button';
import { DeleteMessageComponent } from './components/actions/delete-message';
import { EditMessageComponent } from './components/actions/edit-message';

import { Emoji } from './services/emoji';
export { Emoji } from './services/emoji';

import { SocialUtils } from './services/social-utils';
export { SocialUtils } from './services/social-utils';

@NgModule({
    imports: [common.CommonModule, forms.FormsModule, CommonModule],
    declarations: [
        SimpleEditorComponent,
        EmojisPickerComponent,
        ModalEmojisPickerComponent,
        MarkdownEditorComponent,
        TextDecorationComponent,
        ActionsButtonComponent,
        DeleteMessageComponent,
        EditMessageComponent
    ],
    providers: [Emoji, SocialUtils],
    exports: [
        SimpleEditorComponent,
        EmojisPickerComponent,
        ModalEmojisPickerComponent,
        MarkdownEditorComponent,
        TextDecorationComponent,
        ActionsButtonComponent,
        DeleteMessageComponent,
        EditMessageComponent
    ]
})
export class SocialModule {
    constructor() {}
}

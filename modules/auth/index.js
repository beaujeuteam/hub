import { CommonModule } from './../common';

import { NgModule, common } from 'angular-js-proxy';

import { AuthNavButtonsComponent } from './components/nav-buttons';
import { UserLabelComponent } from './components/user-label';
import { UserAvatarComponent } from './components/user-avatar';

import { Auth } from './services/auth';
export { Auth } from './services/auth';

import { UsersRepository } from './services/users';
export { UsersRepository } from './services/users';

@NgModule({
    imports: [common.CommonModule, CommonModule],
    declarations: [
        AuthNavButtonsComponent,
        UserLabelComponent,
        UserAvatarComponent
    ],
    providers: [Auth],
    exports: [
        AuthNavButtonsComponent,
        UserLabelComponent,
        UserAvatarComponent
    ]
})
export class AuthModule {
    constructor(auth) {}
}

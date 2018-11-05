import { Repository } from 'pxl-angular-common';

@Component({
    template: `
        <header class="text-center bg-info text-white p-4">
            <h2>Communauté</h2>
        </header>

        <section class="container">
            <div class="row">
                <div class="col-md-2">
                    <div class="mb-4">
                        <a [routerLink]="['/community']" class="d-block m-2 text-muted">
                            <i class="fa fa-home"></i> Accueil
                        </a>
                    </div>

                    <div class="mb-4 mt-4">
                        <a [routerLink]="['/community/streams']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-wifi"></i> Streams
                        </a>

                        <a [routerLink]="['/community/games']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-gamepad"></i> Jeux
                        </a>
                    </div>
                </div>

                <div class="col-md-10">
                    <button
                        class="btn btn-outline-success"
                        data-toggle="modal"
                        [attr.data-target]="'#write-message-modal'"
                    >
                            Nouveau message
                    </button>

                    <social-write-message-component [parameters]="messageParameters"></social-write-message-component>

                    <div class="mb-4 mt-4">
                        <p *ngIf="messages.length === 0" class="alert alert-info col-md-12">
                            Aucun message pour le moment :'(
                        </p>

                        <div class="card-columns">
                            <div *ngFor="let message of messages" class="mb-4">
                                <social-message-card-component [id]="message._id"></social-message-card-component>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    inject: [Repository]
})
export class CommunityMessagesComponent {
    constructor(repository) {
        this.repository = repository;

        this.messages = [];
        this.queryId = null;
        this.messageParameters = { type: 'community-message' };
    }

    ngOnInit() {
        this.queryId = this.repository.subscribe('messages:find', this.messageParameters, (query) => {
            this.messages = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.unsubscribe(this.queryId);
    }
}

import { Auth } from 'pxl-angular-auth';

@Component({
    template: `
        <section role="main">
            <section class="mt-4 mb-4 container">
                <nav *ngIf="!auth.isAuthenticated()" class="pull-right">
                    <a class="btn btn-outline-primary" [href]="auth.loginURL">Connexion</a>
                    <a class="btn btn-outline-success" [href]="auth.signupURL">Inscription</a>
                </nav>

                <h1>Beaujeu Team</h1>
            </section>

            <div class="p-4 bg-success text-white">
                <section class="container">
                    <h3 class="mt-3">Présentation</h3>
                    <p>
                        La Beaujeuteam est une communauté de personnes qui on tous un point en commun, le divertissement par le jeu (dans toutes ses formes).
                        Mais elle vise d'autres ambitions.
                    </p>
                </section>
            </div>

            <section class="mt-4 mb-4 container">
                <h3>Nos aspirations</h3>
                <div class="card">
                    <div class="card-body">
                        <header class="media mb-4">
                            <auth-user-avatar-component class="mr-3" [username]="'vek'"></auth-user-avatar-component>
                            <div class="media-body">
                                <auth-user-label-component [username]="'vek'"></auth-user-label-component><br>
                                <small>Co-fondateur</small>
                            </div>
                        </header>

                        <p class="card-text">
                            Nous avons tous des projets créatifs pleins la tête, que ça soit de faire une web série, d'organiser des jeux de rôles papiers, de faire de la BD, écrire des romans …
                            Mais nous n'avons pas toujours toutes les capacités pour mener ses projets à terme.
                        </p>

                        <p class="card-text">
                            Ainsi la Beaujeuteam ce veut également être une plateforme d'entraide par la canalisation des compétences de chacun.
                            Mélangeant des personnes aux compétences diverses comme: dessiner, jouer d'un instrument, programmer etc …
                        </p>
                    </div>
                </div>
            </section>

            <div class="p-4 bg-info text-white">
                <section class="container">
                    <h3 class="mt-3">Nous rejoindre</h3>
                    <p>
                        Si vous voulez faire partie de cette communauté, n'hésitez pas à venir sur notre <a target="_blank" class="text-warning" href="https://discord.gg/J3VbYC8">Discord</a> pour discuter dans un premier temps et pourquoi pas faire une demande d'adhésion.
                    </p>

                    <i>Pour accèder au contenu du site, vous devez avoir un compte validé par une modérateur.</i>
                </section>
            </div>
        </section>
    `,
    inject: [Auth]
})
export class HomeComponent {
    constructor(auth) {
        this.auth = auth;
    }
}

import { Component, Prop, State } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import { checkPassword, checkUsername } from '../../providers/user-state';


@Component({
  tag: 'page-login',
  styleUrl: 'page-login.css',
})
export class PageLogin {
  @Prop({connect: 'ion-nav'}) nav;
  @State() username = '';
  @State() usernameError = null;
  @State() password = '';
  @State() passwordError = null;

  @Prop() logInUser: (username: string) => void;

  handleUsername(ev) {
    this.username = ev.target.value;
  }

  handlePassword(ev) {
    this.password = ev.target.value;
  }

  async onLogin(e) {
    e.preventDefault();
    const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();

    this.usernameError = checkUsername(this.username);
    this.passwordError = checkPassword(this.password);

    if (this.usernameError || this.passwordError) {
      return;
    }

    this.logInUser(this.username);
    navCtrl.setRoot('page-tabs', null , {animated: true, direction: 'forward'});
  }

  async onSignup(e) {
    e.preventDefault();
    const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();

    navCtrl.push('page-signup');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>

          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <div class="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>

        <form novalidate>
          <ion-list no-lines>
            <ion-item>
              <ion-label position="stacked" color="primary">Username</ion-label>
              <ion-input name="username" type="text" value={this.username} onInput={(ev) => this.handleUsername(ev)} spellcheck={false} autocapitalize="off" required></ion-input>
            </ion-item>

            <ion-text color="danger">
              <p hidden={this.usernameError} padding-left>
                {this.usernameError}
              </p>
            </ion-text>

            <ion-item>
              <ion-label position="stacked" color="primary">Password</ion-label>
              <ion-input name="password" type="password" value={this.password} onInput={(ev) => this.handlePassword(ev)} required></ion-input>
            </ion-item>

            <ion-text color="danger">
              <p hidden={this.passwordError} padding-left>
                {this.passwordError}
              </p>
            </ion-text>
          </ion-list>

          <ion-row responsive-sm>
            <ion-col>
              <ion-button onClick={(e) => this.onLogin(e)} type="submit" expand="block">Login</ion-button>
            </ion-col>
            <ion-col>
              <ion-button onClick={(e) => this.onSignup(e)} color="light" expand="block">Signup</ion-button>
            </ion-col>
          </ion-row>
        </form>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageLogin, ['logInUser']);

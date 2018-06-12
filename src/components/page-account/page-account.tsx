import { Component, Prop } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import { UserState } from '../../providers/user-state';


@Component({
  tag: 'page-account',
})
export class PageAccount {

  @Prop({ connect: 'ion-nav' }) nav: HTMLIonNavElement;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: HTMLIonAlertControllerElement;
  @Prop() user: UserState;
  @Prop() logOutUser: () => void;
  @Prop() setUsername: (username: string) => void;

  updatePicture() {
    console.log('Clicked to update picture');
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  async logout() {
    const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();
    this.logOutUser();
    navCtrl.setRoot('page-tabs', null, { animated: true, direction: 'forward' });
  }

  async support() {
    const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();
    navCtrl.setRoot('page-support');
  }

  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      inputs: [
        {
          type: 'text',
          name: 'username',
          id: 'userName',
          placeholder: 'username',
          value: this.user.userName
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Ok',
          handler: (data) => {
            this.setUsername(data.username);
          }
        }
      ]
    });
    alert.present();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button></ion-back-button>
          </ion-buttons>

          <ion-title>Account</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

        <div padding-top text-center >
          <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
          <h2>{this.user}</h2>
          <ion-list>
            <ion-item onClick={() => this.updatePicture()}>Update Picture</ion-item>
            <ion-item onClick={() => this.changeUsername()}>Change Username</ion-item>
            <ion-item onClick={() => this.changePassword()}>Change Password</ion-item>
            <ion-item onClick={() => this.support()}>Support</ion-item>
            <ion-item onClick={() => this.logout()}>Logout</ion-item>
          </ion-list>
        </div>
      </ion-content>

    ];
  }
}

Tunnel.injectProps(PageAccount, ['user', 'logOutUser', 'setUsername']);

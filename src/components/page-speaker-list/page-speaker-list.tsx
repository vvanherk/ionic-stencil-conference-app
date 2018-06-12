import { Config } from '@ionic/core';
import { Component, Prop } from '@stencil/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import Tunnel from '../../providers/state-tunnel';
import { Speaker, SpeakersState } from '../../providers/speakers-state';
import { SessionsState } from '../../providers/sessions-state';

@Component({
  tag: 'page-speaker-list',
  styleUrl: 'page-speaker-list.css'
})
export class PageSpeakerList {
  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl: HTMLIonActionSheetControllerElement;
  @Prop({ context: 'config' }) config: Config;
  @Prop() speakers: SpeakersState;
  @Prop() sessions: SessionsState;
  @Prop() fetchSpeakers: () => Promise<void>;
  @Prop() fetchSessions: () => Promise<void>;

  async componentWillLoad() {
    await Promise.all([
      this.fetchSpeakers(),
      this.fetchSessions()
    ]);
  }

  goToSpeakerTwitter(speaker: Speaker) {
    console.log('goToSpeakerTwitter', speaker);

    InAppBrowser.create(`https://twitter.com/${speaker.twitter}`, '_blank');
  }

  async openSpeakerShare(speaker: Speaker) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any)['cordova'] &&
              (window as any)['cordova'].plugins.clipboard
            ) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  async openContact(speaker: Speaker) {
    const mode = this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Speakers</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="outer-content">
        <ion-list>
          <ion-grid>
            <ion-row align-items-stretch>
              {this.speakers.items.map((speaker: Speaker) => (
                <ion-col col-12 col-md-6 align-self-stretch>
                  <ion-card class="speaker-card">
                    <ion-card-header>
                      <ion-item detail-none href={`/speakers/${speaker.id}`}>
                        <ion-avatar slot="start">
                          <img src={speaker.profilePic} alt="Speaker profile pic"/>
                        </ion-avatar>
                        {speaker.name}
                      </ion-item>
                    </ion-card-header>

                    <ion-card-content>
                      <ion-list>
                        {this.sessions.items
                          .filter(s => s.speakerIds.indexOf(speaker.id) !== -1)
                          .map(session => (
                            <ion-item href={`/speakers/session/${session.id}`}>
                              <h3>{session.name}</h3>
                            </ion-item>
                          ))
                        }
                        <ion-item href={`/speakers/${speaker.id}`}>
                          <h3>About {speaker.name}</h3>
                        </ion-item>
                      </ion-list>
                    </ion-card-content>

                    <ion-row no-padding justify-content-center>
                      <ion-col col-auto text-left>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.goToSpeakerTwitter(speaker)}>
                          <ion-icon name="logo-twitter" slot="start"></ion-icon>
                          Tweet
                        </ion-button>
                      </ion-col>
                      <ion-col col-auto text-center>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.openSpeakerShare(speaker)}>
                          <ion-icon name="share-alt" slot="start"></ion-icon>
                          Share
                        </ion-button>
                      </ion-col>
                      <ion-col col-auto text-right>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.openContact(speaker)}>
                          <ion-icon name="chatboxes" slot="start"></ion-icon>
                          Contact
                        </ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-card>
                </ion-col>
              ))}
            </ion-row>
          </ion-grid>
        </ion-list>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageSpeakerList, ['speakers', 'sessions', 'fetchSpeakers', 'fetchSessions']);

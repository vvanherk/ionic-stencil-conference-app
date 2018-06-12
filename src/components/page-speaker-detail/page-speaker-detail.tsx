import { Component, Prop } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import { SpeakersState } from '../../providers/speakers-state';

@Component({
  tag: 'page-speaker-detail',
  styleUrl: 'page-speaker-detail.css'
})
export class PageSpeakerDetail {
  @Prop() speakerId: number;
  @Prop() speakers: SpeakersState;
  @Prop() fetchSpeakers: () => Promise<void>;

  async componentWillLoad() {
    await this.fetchSpeakers();
  }

  render() {
    const speaker = this.speakers.items.find(s => s.id === this.speakerId);
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/speakers"></ion-back-button>
          </ion-buttons>
          <ion-title>{speaker.name}</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content class="outer-content">
        <ion-grid>
          <ion-row align-items-stretch>
            <ion-col col-10 push-1 col-sm-6 push-sm-3>
              <ion-card>
                <ion-card-content>
                  <img src={speaker.profilePic} alt={speaker.name}/>

                  <ion-button fill="clear" size="small" color="twitter">
                    <ion-icon slot="icon-only" name="logo-twitter"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" size="small" color="github">
                    <ion-icon slot="icon-only" name="logo-github"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" size="small" color="instagram">
                    <ion-icon slot="icon-only" name="logo-instagram"></ion-icon>
                  </ion-button>

                  <p>{speaker.about}</p>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageSpeakerDetail, ['speakers', 'fetchSpeakers']);

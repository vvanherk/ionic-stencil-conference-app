import { Component, Element, Prop } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import dateFormat from '../../providers/dateformat';

import { Session, groupByStartTime } from '../../providers/sessions-state';

function formatTime(dateString, formatString) {
  return dateFormat(new Date(dateString), formatString);
}


@Component({
  tag: 'session-schedule',
  styleUrl: 'session-schedule.css',
})
export class PageSchedule {
  scheduleList: HTMLIonListElement;
  fab: HTMLIonFabElement;

  @Element() el: HTMLStencilElement;

  @Prop() sessionList: Session[];
  @Prop() favoriteSessions: number[];
  @Prop() addFavoriteSession: (sessionId: number) => void;
  @Prop() removeFavoriteSession: (sessionId: number) => void;

  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: HTMLIonAlertControllerElement;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement;

  async addFavorite(session: Session) {
    if (this.favoriteSessions.find(sid => sid === session.id) ) {
      // oops, this session has already been favorited, prompt to remove it
      this.removeFavorite(session, 'Favorite already added');
    } else {
      // create an alert instance
      const alert = await this.alertCtrl.create({
        header: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            this.scheduleList.closeSlidingItems();
            this.addFavoriteSession(session.id);
          }
        }]
      });

      // now present the alert
      alert.present();
    }
  }

  async removeFavorite(session: Session, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            this.scheduleList.closeSlidingItems();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.removeFavoriteSession(session.id);
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  async openSocial(social: string) {
    this.toggleList();
    const loading = await this.loadingCtrl.create({
      content: `Posting to ${social}`,
      duration: (Math.random() * 1000) + 500
    });

    loading.present();
  }

  toggleList() {
    const fabButton = this.fab.querySelector('ion-fab-button');
    fabButton.activated = !fabButton.activated;

    const fabList = this.fab.querySelector('ion-fab-list');
    fabList.activated = !fabList.activated;
  }

  render() {
    const groups = groupByStartTime(this.sessionList);

    return [
        <ion-list id="scheduleList" hidden={this.sessionList.length === 0}>
          {groups.map(group =>
            <ion-item-group>
              <ion-item-divider class="sticky">
                <ion-label>
                  {formatTime(group.startTime, 'h:MM tt')}
                </ion-label>
              </ion-item-divider>

              {group.sessions.map(session =>
              <ion-item-sliding class={{[`item-sliding-track-${session.tracks[0].toLowerCase()}`]: true, 'item-sliding-track': true}}>
              <ion-item href={`/schedule/session/${session.id}`}>
                  <ion-label>
                    <h3>{session.name}</h3>
                    <p>
                      {formatTime(session.dateTimeStart, 'h:MM tt')} &ndash;&nbsp;
                      {formatTime(session.dateTimeEnd, 'h:MM tt')}:&nbsp;
                      {session.location}
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item-options>
                  {this.favoriteSessions.indexOf(session.id) === -1
                    ? <ion-item-option color="favorite" onClick={() => this.addFavorite(session)}>
                        Favorite
                      </ion-item-option>

                    : <ion-item-option color="danger" onClick={() => this.removeFavorite(session, 'Remove Favorite')}>
                      Remove
                    </ion-item-option>
                  }

                </ion-item-options>
              </ion-item-sliding>
              )}
            </ion-item-group>
          )}
        </ion-list>,

        <ion-list-header hidden={this.sessionList.length > 0}>
          No Sessions Found
        </ion-list-header>
    ];
  }
}

Tunnel.injectProps(PageSchedule, [ 'addFavoriteSession', 'removeFavoriteSession' ]);

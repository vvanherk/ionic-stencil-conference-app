import { Config } from '@ionic/core';
import { Component, Element, Listen, Prop, State, Watch } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import dateFormat from '../../providers/dateformat';

import { Session, SessionsState, getVisibleSessions, groupByStartTime } from '../../providers/sessions-state';

function formatTime(dateString, formatString) {
  return dateFormat(new Date(dateString), formatString);
}


@Component({
  tag: 'page-schedule',
  styleUrl: 'page-schedule.css',
})
export class PageSchedule {
  scheduleList: HTMLIonListElement;
  fab: HTMLIonFabElement;

  @Element() el: any;

  @Prop() sessions: SessionsState;
  @Prop() searchSessions: (searchText: string) => void;
  @Prop() addFavoriteSession: (sessionId: number) => void;
  @Prop() removeFavoriteSession: (sessionId: number) => void;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: HTMLIonAlertControllerElement;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;

  @State() visibleSessions: Session[];
  @State() segment = 'all';

  @Watch('sessions')
  setVisibleSessions() {
    this.visibleSessions = getVisibleSessions(this.sessions);
  }

  componentWillLoad() {
    this.setVisibleSessions();
  }

  componentDidLoad() {
    this.scheduleList = this.el.querySelector('#scheduleList');
    this.fab = this.el.querySelector('#socialFab');
  }

  @Listen('ionChange')
  segmentChanged(event: any) {
    this.segment = event.target.value;
    this.updateSchedule();
  }

  @Listen('ionInput')
  searchbarChanged(event: any) {
    this.searchSessions(event.target.value);
  }

  @Listen('body:ionLoadingWillDismiss')
  loadingWillDismiss() {
    this.fab.close();
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: 'page-schedule-filter',
    });
    await modal.present();
  }

  async addFavorite(session: Session) {
    if (this.sessions.favoriteSessions.find(sid => sid === session.id) ) {
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
    const mode = this.config.get('mode');
    const groups = groupByStartTime(this.visibleSessions);

    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>

          <ion-segment value={this.segment} color={mode === 'md' ? 'light' : null}>
            <ion-segment-button value="all">
              All
            </ion-segment-button>
            <ion-segment-button value="favorites">
              Favorites
            </ion-segment-button>
          </ion-segment>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.presentFilter()}>
              <ion-icon slot="icon-only" name="options"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar>
          <ion-searchbar value={this.sessions.searchText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-list id="scheduleList" hidden={this.visibleSessions.length === 0}>
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
                      {formatTime(session.dateTimeStart, 'h:MM tt')} &ndash;
                      {formatTime(session.dateTimeEnd, 'h:MM tt')} &mdash;
                      {session.location}
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item-options>
                  {this.sessions.favoriteSessions.indexOf(session.id) === -1
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
        </ion-list>

        <ion-list-header hidden={this.visibleSessions.length > 0}>
          No Sessions Found
        </ion-list-header>

        <ion-fab id="socialFab" vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button onClick={() => this.toggleList()}>
            <ion-icon name="share"></ion-icon>
          </ion-fab-button>

          <ion-fab-list side="top">
            <ion-fab-button color="vimeo" onClick={() => this.openSocial('Vimeo')}>
              <ion-icon name="logo-vimeo"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="google" onClick={() => this.openSocial('Google+')}>
              <ion-icon name="logo-googleplus"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="twitter" onClick={() => this.openSocial('Twitter')}>
              <ion-icon name="logo-twitter"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="facebook" onClick={() => this.openSocial('Facebook')}>
              <ion-icon name="logo-facebook"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageSchedule, ['sessions', 'addFavoriteSession', 'removeFavoriteSession', 'searchSessions']);

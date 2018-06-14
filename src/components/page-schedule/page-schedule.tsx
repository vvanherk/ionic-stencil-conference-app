import { Config } from '@ionic/core';
import { Component, Element, Listen, Prop, State, Watch } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';

import { Session, SessionsState, getVisibleSessions } from '../../providers/sessions-state';


@Component({
  tag: 'page-schedule',
  styleUrl: 'page-schedule.css',
})
export class PageSchedule {
  scheduleList: HTMLIonListElement;
  fab: HTMLIonFabElement;

  @Element() el: HTMLStencilElement;

  @Prop() sessions: SessionsState;
  @Prop() searchSessions: (searchText: string) => void;
  @Prop() fetchSessions: () => Promise<void>;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;

  @State() visibleSessions: Session[] = [];
  @State() segment = 'all';

  @Watch('sessions')
  setVisibleSessions() {
    this.visibleSessions = getVisibleSessions(this.sessions);
  }

  async componentWillLoad() {
    await this.fetchSessions();
    this.setVisibleSessions();
  }

  componentDidLoad() {
    this.scheduleList = this.el.querySelector('#scheduleList');
    this.fab = this.el.querySelector('#socialFab');
  }

  @Listen('body:ionLoadingWillDismiss')
  loadingWillDismiss() {
    this.fab.close();
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: 'page-schedule-filter',
    });
    await modal.present();
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
    const sessionList = (this.segment === 'all') ?
      this.visibleSessions :
      this.visibleSessions.filter(s => this.sessions.favoriteSessions.indexOf(s.id) !== -1);

    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>

          <ion-segment
            value={this.segment}
            color={mode === 'md' ? 'light' : null}
            onIonChange={(e) => this.segment = e.detail.value}>
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
          <ion-searchbar
            value={this.sessions.searchText}
            placeholder="Search"
            onIonChange={(e) => this.searchSessions(e.detail.value)}>
          </ion-searchbar>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <session-schedule sessionList={sessionList} favoriteSessions={this.sessions.favoriteSessions}/>

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

Tunnel.injectProps(PageSchedule, ['sessions', 'searchSessions', 'fetchSessions']);

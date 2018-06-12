import { Component, Element, Prop } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import { SessionsState } from '../../providers/sessions-state';
import dateFormat from '../../providers/dateformat';

function formatTime(dateString, formatString) {
  return dateFormat(new Date(dateString), formatString);
}

@Component({
  tag: 'page-session',
  styleUrl: 'page-session.css',
})
export class PageSession {
  @Element() el: HTMLStencilElement;
  @Prop() sessionId: number;
  @Prop() sessions: SessionsState;
  @Prop() addFavoriteSession: (sessionId: number) => void;
  @Prop() removeFavoriteSession: (sessionId: number) => void;
  @Prop() goback = '/';

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite(sessionId: number) {
    if (this.sessions.favoriteSessions.indexOf(sessionId) === -1) {
      return this.addFavoriteSession(sessionId);
    }
    this.removeFavoriteSession(sessionId);
  }

  render() {
    const session = this.sessions.items.find(s => s.id === this.sessionId);
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref={this.goback}></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div padding>
          <ion-grid no-padding>
            <ion-row>
              <ion-col col-6>
                {session.tracks.map(track =>
                  <span class={{[`session-track-${track.toLowerCase()}`]: true}}>
                    { track }
                  </span>
                )}
                <div>Session {this.sessionId}</div>
              </ion-col>
              <ion-col col-6 text-right class={(this.sessions.favoriteSessions.indexOf(session.id) !== -1) ? 'show-favorite' : ''}>
                <ion-icon name="heart-empty" size="large" class="icon-heart-empty" onClick={() => this.toggleFavorite(session.id)}></ion-icon>
                <ion-icon name="heart" color="danger" size="large" class="icon-heart" onClick={() => this.toggleFavorite(session.id)}></ion-icon>
              </ion-col>
            </ion-row>
          </ion-grid>

          <h1>{session.name}</h1>

          <p>{session.description}</p>

          <ion-text color="medium">
            {formatTime(session.dateTimeStart, 'h:MM tt')} &ndash; {formatTime(session.dateTimeEnd, 'h:MM tt')}<br/>
            {session.location}
          </ion-text>
        </div>

        <ion-list>
          <ion-item onClick={() => this.sessionClick('watch')} button>
            <ion-label color="primary">Watch</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('add to calendar')} button>
            <ion-label color="primary">Add to Calendar</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('mark as unwatched')} button>
            <ion-label color="primary">Mark as Unwatched</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('download video')} button>
            <ion-label color="primary">Download Video</ion-label>
            <ion-icon slot="end" color="primary" size="small" name="cloud-download"></ion-icon>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('leave feedback')} button>
            <ion-label color="primary">Leave Feedback</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageSession, ['sessions', 'addFavoriteSession', 'removeFavoriteSession']);

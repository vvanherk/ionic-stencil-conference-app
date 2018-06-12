import { Config } from '@ionic/core';
import { Component, Element, Listen, Prop, State } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';

import { SessionsState, getTracks} from '../../providers/sessions-state';


@Component({
  tag: 'page-schedule-filter',
  styleUrl: 'page-schedule-filter.css',
})
export class PageScheduleFilter {
  @Element() el: HTMLStencilElement;

  @State() filteredTracks: string[];

  @Prop({ context: 'config' }) config: Config;
  @Prop() sessions: SessionsState;
  @Prop() refreshSessionsTrackFilters: (trackNames: string[]) => void;

  async componentWillLoad() {
    // passed in array of track names that should be excluded (unchecked)
    // TODO = this.navParams.data.excludedTracks;
  }

  dismiss() {
    (this.el.closest('ion-modal') as any).dismiss();
  }

  applyFilters() {
    this.refreshSessionsTrackFilters(this.filteredTracks);
    this.dismiss();
  }

  // reset all of the toggles to be checked
  resetFilters() {
    this.refreshSessionsTrackFilters(getTracks(this.sessions));
  }

  @Listen('ionChange')
  onToggleChanged(ev: CustomEvent) {
    const trackName = (ev.target as any).name;

    if ((ev.target as any).checked) {
      this.filteredTracks.push(trackName);
    } else {
      this.filteredTracks = this.filteredTracks.filter(t => t !== trackName);
    }
  }

  render() {
    const mode = this.config.get('mode');
    const tracks = getTracks(this.sessions);

    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot={mode === 'md' ? 'end' : 'start'}>
            <ion-button onClick={() => this.dismiss()}>Cancel</ion-button>
          </ion-buttons>

          <ion-title>
            Filter Sessions
          </ion-title>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.applyFilters()} strong>Done</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="outer-content">
        <ion-list>
          <ion-list-header>Tracks</ion-list-header>

          {tracks.map(track =>
            <ion-item class={{[`item-track-${track.toLowerCase()}`]: true, 'item-track': true}}>
              <span slot="start" class="dot"></span>
              <ion-label>{track}</ion-label>
              <ion-toggle checked={this.filteredTracks.indexOf(track) !== -1} color="success" name={track}></ion-toggle>
            </ion-item>
          )}
        </ion-list>

        <ion-list>
          <ion-item onClick={() => this.resetFilters()} detail-none>
            <ion-label color="danger">
              Reset All Filters
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }
}

Tunnel.injectProps(PageScheduleFilter, ['sessions', 'refreshSessionsTrackFilters']);

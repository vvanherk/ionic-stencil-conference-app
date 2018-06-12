export interface Session {
  id: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: number[];
  tracks: string[];
}

export interface SessionsState {
  searchText: string;
  trackFilters: string[];
  items: Session[];
  favoriteSessions: number[];
  filterFavorites: boolean;
}

export interface SessionsActions {
  fetchSessions: () => Promise<void>;
  searchSessions: (searchText: string) => void;
  addSessionTrackFilter: (trackName: string) => void;
  removeSessionsTrackFilter: (trackName: string) => void;
  refreshSessionsTrackFilters: (trackNames: string[]) => void;
  addFavoriteSession: (sessionId: number) => void;
  removeFavoriteSession: (sessionId: number) => void;
  updateFavoriteSessionFilter: (filterFavorites: number[]) => void;
}

export const defaultState: SessionsState = {
  searchText: '',
  trackFilters: [],
  items: [],
  favoriteSessions: [],
  filterFavorites: false
};

export const actions: SessionsActions = {
  async fetchSessions() {
    if (this.sessions.items.length > 0) {
      return Promise.resolve();
    }
    const response = await fetch('/assets/data/sessions.json');
    const sessionItems = await response.json();
    this.sessions = {
      ...this.sessions,
      items: sessionItems
    };
  },

  searchSessions(searchText: string) {
    this.sessions = {
      ...this.sessions,
      searchText
    };
  },

  addSessionTrackFilter(trackName: string) {
    const updatedTrackFilters = this.sessions.trackFilters
      .concat(trackName)
      .reduce((updatedList, item) => {
        if (!updatedList.includes(item)) {
          updatedList.push(item);
        }
        return updatedList;
      }, []);
    this.sessions = {
      ...this.sessions,
      trackFilters: updatedTrackFilters
    };
  },

  removeSessionsTrackFilter(trackName: string) {
    this.sessions = {
      ...this.sessions,
      trackFilters: this.sessions.trackFilters.filter(tn => tn !== trackName)
    };
  },

  refreshSessionsTrackFilters(trackNames: string[]) {
    this.sessions = {
      ...this.sessions,
      trackFilters: trackNames
    };
  },

  addFavoriteSession(sessionId: number) {
    const updatedFavoriteSessions = this.sessions.favoriteSessions
      .concat(sessionId)
      .reduce((updatedList, item) => {
        if (!updatedList.includes(item)) {
          updatedList.push(item);
        }
        return updatedList;
      }, []);
    this.sessions = {
      ...this.sessions,
      favoriteSessions: updatedFavoriteSessions
    };
  },

  removeFavoriteSession(sessionId: number) {
    this.sessions = {
      ...this.sessions,
      favoriteSessions: this.sessions.favoriteSessions.filter(sid => sid !== sessionId)
    };
  },

  updateFavoriteSessionFilter(filterFavorites: number[]) {
    this.sessions = {
      ...this.sessions,
      filterFavorites: filterFavorites
    };
  }
};


export function getVisibleSessions(sessionState: SessionsState) {
  let filteredSessions = sessionState.items;

  if (sessionState.searchText) {
    const lowerSearchText = sessionState.searchText.toLowerCase();
    filteredSessions = filteredSessions.filter(session => (
      session.name.toLowerCase().indexOf(lowerSearchText) !== -1)
    );
  }

  if (sessionState.trackFilters.length > 0) {
    filteredSessions = filteredSessions.filter(session => (
      session.tracks.some(sessionTrackName => (
        sessionState.trackFilters.some(trackName => trackName === sessionTrackName)
      ))
    ));
  }

  return filteredSessions;
}

export interface Group {
  startTime: string;
  sessions: Session[];
}

export function groupByStartTime(sessions: Session[]) {
  return sessions
    .sort((a, b) => (
      (new Date(b.dateTimeStart)).getTime() - (new Date(a.dateTimeStart)).getTime()
    ))
    .reduce((groups, session) => {
      const starterHour = new Date(session.dateTimeStart);
      starterHour.setMinutes(0);
      starterHour.setSeconds(0);

      const starterHourStr = starterHour.toJSON();

      const foundGroup = groups.find(group => group.startTime === starterHourStr);
      if (foundGroup) {
        foundGroup.sessions.push(session);
      } else {
        groups.push({
          startTime: starterHourStr,
          sessions: [session]
        });
      }
      return groups;
  }, <Group[]>[]);
}

export function getTracks(sessionState: SessionsState) {
  return sessionState.items.reduce((tracks, item) => (
    item.tracks.reduce((trackList, track) => (
      (trackList.indexOf(track) === -1) ?
        trackList.concat(track) :
        trackList
    ), tracks)
  ), <string[]>[]);
}

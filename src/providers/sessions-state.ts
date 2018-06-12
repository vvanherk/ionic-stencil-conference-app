export interface Session {
  id: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: string[];
  tracks: string[];
}

export interface SessionsState {
  searchText: string;
  trackFilters: string[];
  sessions: Session[];
  favoriteSessions: Session[];
  filterFavorites: boolean;
}

export interface SessionsActions {
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
  sessions: [],
  favoriteSessions: [],
  filterFavorites: false
};

export const actions: SessionsActions = {
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


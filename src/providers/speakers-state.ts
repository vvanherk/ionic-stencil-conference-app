export interface Speaker {
  id: number;
  name: string;
  profilePic: string;
  twitter: string;
  about: string;
  location: string;
  email: string;
  phone: string;
}

export interface SpeakersState {
  items: Speaker[];
}

export interface SpeakersActions {
  fetchSpeakers: () => Promise<void>;
}

export const defaultState: SpeakersState = {
  items: []
};

export const actions: SpeakersActions = {
  async fetchSpeakers() {
    const response = await fetch('/assets/data/speakers.json');
    const items = await response.json();
    this.speakers = {
      items
    };
  }
};

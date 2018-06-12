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
  speakers: Speaker[];
}

export const defaultState: SpeakersState = {
  speakers: []
};

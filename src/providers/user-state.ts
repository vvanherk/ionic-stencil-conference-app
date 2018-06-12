export interface UserState {
  pictureLocation: string;
  userName: string;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
}

export interface UserActions {
  signUpUser: (username: string) => void;
  logInUser: (userName: string) => void;
  setUsername: (userName: string) => void;
  logOutUser: () => void;
  showedTutorial: () => void;
}

export const defaultState: UserState = {
  pictureLocation: null,
  userName: null,
  isAuthenticated: false,
  hasSeenTutorial: false
};

export const actions: UserActions = {
  signUpUser(userName: string) {
    this.user = {
      ...this.user,
      userName
    };
  },

  logInUser(userName: string) {
    this.user = {
      ...this.user,
      userName
    };
  },

  setUsername(userName: string) {
    this.user = {
      ...this.user,
      userName
    };
  },

  logOutUser() {
    this.user = {
      ...defaultState
    };
  },

  showedTutorial() {
    this.user = {
      ...this.user,
      hasSeenTutorial: true
    };
  }
};


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
  toggleTutorial: () => void;
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
      userName,
      isAuthenticated: true
    };
  },

  logInUser(userName: string) {
    this.user = {
      ...this.user,
      userName,
      isAuthenticated: true
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

  toggleTutorial() {
    this.user = {
      ...this.user,
      hasSeenTutorial: !this.user.hasSeenTutorial
    };
  }
};


export function checkUsername(username: string): string | null {
  if (!username) {
    return 'Username is required';
  }
  return null;
}

export function checkPassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  return null;
}

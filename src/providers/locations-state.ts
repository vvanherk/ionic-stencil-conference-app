export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface LocationsState {
  mapCenter: {
    lat: number;
    lng: number;
  };
  items: Location[];
}

export interface LocationsActions {
  fetchLocations(): Promise<void>;
}

export const defaultState: LocationsState = {
  mapCenter: {
    lat: 43.071584,
    lng: -89.380120,
  },
  items: []
};

export const actions: LocationsActions = {
  async fetchLocations() {
    this.locations = {
      ...this.locations,
      items: await fetch('/assets/data/locations.json')
    };
  }
};

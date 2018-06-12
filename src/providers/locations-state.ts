export interface LocationsState {
  mapCenter: {
    lat: number;
    lng: number;
  };
  locations: string[];
}

export const defaultState: LocationsState = {
  mapCenter: {
    lat: 43.071584,
    lng: -89.380120,
  },
  locations: []
};

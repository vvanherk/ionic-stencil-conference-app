import { createProviderConsumer } from '@stencil/state-tunnel';
import { createActionDefaults } from './util';
import { UserActions, UserState, actions as userActions, defaultState as defaultUserState,  } from './user-state';
import { LocationsActions, LocationsState, actions as locationsActions, defaultState as defaultLocationsState } from './locations-state';
import { SessionsActions, SessionsState, actions as sessionsActions, defaultState as defaultSessionsState } from './sessions-state';
import { SpeakersActions, SpeakersState, actions as speakersActions, defaultState as defaultSpeakersState } from './speakers-state';

export interface State extends UserActions, LocationsActions, SessionsActions, SpeakersActions {
  user: UserState;
  locations: LocationsState;
  sessions: SessionsState;
  speakers: SpeakersState;
}

export default createProviderConsumer<State>({
    user: defaultUserState,
    ...createActionDefaults(userActions),
    locations: defaultLocationsState,
    ...createActionDefaults(locationsActions),
    sessions: defaultSessionsState,
    ...createActionDefaults(sessionsActions),
    speakers: defaultSpeakersState,
    ...createActionDefaults(speakersActions),
  },
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  )
);

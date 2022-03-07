import {createContext} from 'react';
import {ServerAction} from '../reducers/ServerAction';
import {initialServerState, ServerState} from '../reducers/ServerState';

export const ServerRequestContext = createContext<{
  state: ServerState;
  dispatch: React.Dispatch<ServerAction>;
}>({
  state: initialServerState,
  dispatch: () => undefined,
});
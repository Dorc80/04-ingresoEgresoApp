import { createReducer, on } from '@ngrx/store';
import * as actions from './ui.actions';

export interface State {
    isLoading: boolean
}

export const initialState: State = {
    isLoading: false,
}

export const _uiReducer = createReducer(initialState,

    on(actions.isLoading, state => ({ ...state, isLoading: true })),
    on(actions.stopLoading, state => ({ ...state, isLoading: false })),

);

// export function counterReducer(state: State, action) {
//     return _counterReducer(state, action);
// }
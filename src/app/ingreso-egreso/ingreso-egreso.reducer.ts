import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import * as actions from './ingreso-egreso.actions';

export interface State {
    items: IngresoEgreso[];
}

export interface AppStateWithIngrese extends AppState {
    ingresosEgresos: State
}

export const initialState: State = {
    items: [],
}

export const _ingresoEgresoReducer = createReducer(initialState,

    on(actions.setItems, (state, { items }) => ({ ...state, items: [...items] })),
    on(actions.unSetItems, (state) => ({ ...state, items: [] })),

);

// export function counterReducer(state, action) {
//     return _counterReducer(state, action);
// }
import { ThunkAction } from 'redux-thunk'
import { InferActionsType, StateType } from './store'

const initState = {
    test: 1
}

type InitStateType = typeof initState

const appReducer = (state = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        default:
            return state
    }
}

export const actions = {
    setTest: (value: number) => ({ type: '//SET_TEST', value } as const),
}

export type ActionsType = InferActionsType<typeof actions>
type ThunkType = ThunkAction<Promise<void>, StateType, unknown, ActionsType>

export default appReducer
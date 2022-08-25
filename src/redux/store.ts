import { applyMiddleware, combineReducers, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunkMiddleware from 'redux-thunk'
import appReducer from "./appReducer"

const rootReducer = combineReducers({
    appReducer
})

export type StateType = ReturnType<typeof rootReducer>
export type InferActionsType<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunkMiddleware)
))

export default store
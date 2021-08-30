import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import memeReducer, { initializeMemes } from './reducers/memeReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer, { initializeUsers } from './reducers/userReducer'
import loggedReducer from './reducers/loggedReducer'
import memeService from './services/memes'
import userService from './services/users'

const combinedReducer = combineReducers({
  users: userReducer,
  memes: memeReducer,
  notification: notificationReducer,
  loggedIn: loggedReducer
})

const store = createStore(
  combinedReducer,
  composeWithDevTools(applyMiddleware(thunk)
  ))

memeService.getAll().then(memes =>
  store.dispatch(initializeMemes(memes))
)

userService.getAll().then(users =>
  store.dispatch(initializeUsers(users))
)

store.subscribe(() => console.log('store: ' , store.getState()))

export default store
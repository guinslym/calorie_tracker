import { combineReducers } from 'redux'

import {
    REQUEST_USERS, RECEIVE_USERS, CREATE_USER, CREATED_USER, DELETE_USER, DELETED_USER, EDITED_USER, EDIT_USER
} from '../constants'

const users = (state = {
    users: [],
}, action) => {
    console.log('user action')
    console.log(action)
    switch (action.type) {
  case REQUEST_USERS:
      return {
    ...state,
      }
  case RECEIVE_USERS:
      return {
    ...state,
    users: action.users,
      }
  case CREATE_USER:
      return state
  case CREATED_USER:
      return {
    ...state,
    users: [...state.users, action.user]
      }
  case DELETE_USER:
      return state
  case DELETED_USER:
      const user_id2 = action.user_id
      const index2 = state.users.findIndex(user => user.id === user_id2)
      return {
    users: [
        ...state.users.slice(0, index2),
        ...state.users.slice(index2 + 1)]
      }

  case EDIT_USER:
      return state
  case EDITED_USER:
      const user_id = action.user.id
      const index = state.users.findIndex(user => user.id === user_id)
      return {
        users: [
          ...state.users.slice(0, index),
          action.user,
          ...state.users.slice(index + 1)]
        }
  default:
      return state
    }
}


export default users
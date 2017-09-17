import { combineReducers } from 'redux'

import {
    REQUEST_MEALS, RECEIVE_MEALS, CREATED_MEAL, CREATE_MEAL, DELETE_MEAL, DELETED_MEAL, EDIT_MEAL, EDITED_MEAL
} from '../constants'

const meals = (state = {
    meals: [],
}, action) => {
    console.log('meal action')
    console.log(action)
    switch (action.type) {
      case REQUEST_MEALS:
        return {
          ...state,
           }
      case RECEIVE_MEALS:
        return {
          ...state,
          meals: action.meals,
          }   
      case CREATE_MEAL:
        return state
      case CREATED_MEAL:
        return {
          ...state,
          meals: [...state.meals, action.meal]
        }
      case DELETE_MEAL:
        return state
      case DELETED_MEAL:
        const meal_id = action.meal_id
        const index = state.meals.findIndex(meal => meal.id === meal_id)
        return {
          meals: [
            ...state.meals.slice(0, index),
            ...state.meals.slice(index + 1)]
        }
      case EDIT_MEAL:
        return state
      case EDITED_MEAL:
        const meal_id2 = action.meal.id
        const index2 = state.meals.findIndex(meal => meal.id === meal_id2)
        return {
          meals: [
            ...state.meals.slice(0, index2),
            action.meal,
            ...state.meals.slice(index2 + 1)]
        }
      default:
        return state
        }
}


export default meals
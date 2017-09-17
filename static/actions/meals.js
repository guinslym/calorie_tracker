import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus } from '../utils';

import {
    REQUEST_MEALS,
    RECEIVE_MEALS,
    CREATE_MEAL,
    CREATED_MEAL,
    DELETE_MEAL,
    DELETED_MEAL,
    EDIT_MEAL,
    EDITED_MEAL
} from '../constants';


export const requestMeals = () => ({
    type: REQUEST_MEALS
})

export const receiveMeals = meals => ({
    type: RECEIVE_MEALS,
    meals,
})

const deleteMealAction = meal_id => ({
    type: DELETE_MEAL,
    meal_id
})

const deletedMeal = meal_id => ({
    type: DELETED_MEAL,
    meal_id
})

const editMealAction = meal => ({
    type: EDIT_MEAL,
    meal
})

const editedMeal = meal => ({
    type: EDITED_MEAL,
    meal
})

const createMeal = meal => ({
    type: CREATE_MEAL,
    meal
});

const createdMeal= meal => ({
    type: CREATED_MEAL,
    meal
});

const fetchMeals = (token, url) => dispatch => {
    dispatch(requestMeals)
    return fetch(`${SERVER_URL}/api/meals/${url}/`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',                
                 Authorization: `Token ${token}`
            }
        })
  .then(response => response.json())
  .then(json => dispatch(receiveMeals(json)))
}

const shouldFetchMeals = state => {
    const meals = state.meals
    if (!meals) {
  return true
    }
    if (meals.isFetching) {
  return false
    }
    return true
}

export const fetchMealsIfNeeded = (token, url) => (dispatch, getState) => {
    if (shouldFetchMeals(getState())) {
  return dispatch(fetchMeals(token, url))
    }
}

export const postMeal = (meal, token) => dispatch => {
    dispatch(createMeal(meal))

    return fetch(`${SERVER_URL}/api/meals/list/`, {
        method: 'POST',
        body: JSON.stringify(meal),
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
  })
  .then(response => response.json())
  .then(json => dispatch(createdMeal(json)))
}

export const deleteMeal = (meal_id, token) => dispatch => {
    dispatch(deleteMealAction(meal_id))
    return fetch(`${SERVER_URL}/api/meals/${meal_id}/`, {
        method: 'DELETE',
        headers: {
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
  })
  .then(response => dispatch(deletedMeal(meal_id)))
}

export const editMeal = (meal, token) => dispatch => {
    dispatch(editMealAction(meal.id));
    const id = meal.id

    return fetch(`${SERVER_URL}/api/meals/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(meal),
        headers: {
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
  })
  .then(response => response.json())
  .then(json => dispatch(editedMeal(json)))
  .then(dispatch(push(redirect)))
}

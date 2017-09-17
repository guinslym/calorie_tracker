import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';

import {
    REQUEST_USERS,
    RECEIVE_USERS,
    CREATE_USER,
    CREATED_USER,
    DELETE_USER,
    DELETED_USER,
    EDIT_USER,
    EDITED_USER
} from '../constants';


export const requestUsers = () => ({
    type: REQUEST_USERS
})

export const receiveUsers = users => ({
    type: RECEIVE_USERS,
    users,
})

const createUser = (user) => ({
    type: CREATE_USER,
    user
});

const createdUser= user => ({
    type: CREATED_USER,
    user
});

const deleteUserAction = user_id => ({
    type: DELETE_USER,
    user_id
})

const deletedUser = user_id => ({
    type: DELETED_USER,
    user_id
})

const editUserAction = user => ({
    type: EDIT_USER,
    user
})

const editedUser = user => ({
    type: EDITED_USER,
    user
})


const fetchUsers = (token) => dispatch => {
    dispatch(requestUsers)
    return fetch(`${SERVER_URL}/api/users/list/`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
        })
	.then(response => response.json())
	.then(json => dispatch(receiveUsers(json)))
}

const shouldFetchUsers = state => {
    const users = state.users
    if (!users) {
	return true
    }
    if (users.isFetching) {
	return false
    }
    return true
}

export const fetchUsersIfNeeded = (token) => (dispatch, getState) => {
    if (shouldFetchUsers(getState())) {
	return dispatch(fetchUsers(token))
    }
}

export const postUser = (user, token) => dispatch => {
    dispatch(createUser(user))

    return fetch(`${SERVER_URL}/api/users/list/`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
  })
  .then(response => response.json())
  .then(json => dispatch(createdUser(json)))
}

export const deleteUser = (user_id, token) => dispatch => {
    dispatch(deleteUserAction(user_id))
    return fetch(`${SERVER_URL}/api/users/${user_id}/`, {
    method: 'DELETE',
    headers: {
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
    })
    .then(response => dispatch(deletedUser(user_id)))
}

export const editUser = (user, token, url='') => dispatch => {
    dispatch(editUserAction(user));
    const id = user.id;

    return fetch(`${SERVER_URL}/api/users/${id}/${url}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
                'Content-Type': 'application/json',
                 Authorization: `Token ${token}`
            }
  })
  .then(response => response.json())
  .then(json => dispatch(editedUser(json)))
  .then(dispatch(push(redirect)))
}

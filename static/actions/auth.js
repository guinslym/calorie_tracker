import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus } from '../utils';
import {
    AUTH_LOGIN_USER_REQUEST,
    AUTH_LOGIN_USER_FAILURE,
    AUTH_LOGIN_USER_SUCCESS,
    AUTH_LOGOUT_USER,
    AUTH_REGISTER_USER_FAILURE,
    AUTH_REGISTER_USER_REQUEST
} from '../constants';


export function authLoginUserSuccess(token, user) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    return {
        type: AUTH_LOGIN_USER_SUCCESS,
        payload: {
            token,
            user
        }
    };
}

export function authLoginUserFailure(error) {
    sessionStorage.removeItem('token');
    return {
        type: AUTH_LOGIN_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function authLoginUserRequest() {
    return {
        type: AUTH_LOGIN_USER_REQUEST
    };
}

export function authRegisterUserFailure(error) {
    sessionStorage.removeItem('token');
    return {
        type: AUTH_REGISTER_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function authRegisterUserRequest() {
    return {
        type: AUTH_REGISTER_USER_REQUEST
    };
}

export function authLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return {
        type: AUTH_LOGOUT_USER
    };
}

export function authLogoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(authLogout());
        dispatch(push('/login'));
        return Promise.resolve(); // TODO: we need  promise here because of tests, find a better way
    };
}

export function authLoginUser(username, password, redirect = '/') {
    return (dispatch) => {
        dispatch(authLoginUserRequest());
        const auth = btoa(`${username}:${password}`);
        return fetch(`${SERVER_URL}/api/users/login/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        })
            .then(checkHttpStatus)
            .then(response => response.json())
            .then((response) => {
                try {
                    dispatch(authLoginUserSuccess(response.token, response.user));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(authLoginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch((error) => {
                dispatch(authLoginUserFailure(error));
            });
    };
}

export function authRegisterUser(username, password, redirect = '/') {

    const newUser = {
    username: username,
    password: password
  };
    return (dispatch) => {
        dispatch(authRegisterUserRequest());
        return fetch(`${SERVER_URL}/api/users/register/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(checkHttpStatus)
            .then(response => response.json())
            .then((response) => {
                try {
                    dispatch(authLoginUser(username, password, redirect));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(authRegisterUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch((error) => {
                dispatch(authRegisterUserFailure(error));
            });
    };
}


export function createNewUser(username, password, token, redirect = '/protected') {

    const newUser = {
    username: username,
    password: password
  };
    return (dispatch) => {
        dispatch(authRegisterUserRequest());
        return fetch(`${SERVER_URL}/api/users/register/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(checkHttpStatus)
            .then(response => response.json())
            .then((response) => {
                try {
                    dispatch(authLoginUser(username, password, redirect));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(authRegisterUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch((error) => {
                dispatch(authRegisterUserFailure(error));
            });
    };
}

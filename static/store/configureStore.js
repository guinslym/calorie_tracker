import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers';

export default function configureStore(initialState, history) {
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = applyMiddleware(thunk, reduxRouterMiddleware);

    const createStoreWithMiddleware = compose(
        middleware
    );

    const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

    if (module.hot) {
        module.hot
            .accept('../reducers', () => {
                const nextRootReducer = require('../reducers/index');
                store.replaceReducer(nextRootReducer);
            });
    }

    return store;
}

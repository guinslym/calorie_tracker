import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import { LoginView, RegisterView, NotFoundView, HomeView, UserView, MealView, SettingsView} from './containers';
import requireAuthentication from './utils/requireAuthentication';
import requireAdmin from './utils/requireAdmin';
import requireStaff from './utils/requireStaff';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={requireAuthentication(HomeView)}/>
        <Route path="login" component={LoginView}/>
        <Route path="register" component={RegisterView}/>
        <Route path="users" component={requireStaff(UserView)}/>
        <Route path="meals" component={requireAdmin(MealView)}/>
        <Route path="settings" component={requireAuthentication(SettingsView)}/>
        <Route path="*" component={NotFoundView}/>
    </Route>
);

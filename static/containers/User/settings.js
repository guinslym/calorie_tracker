import React from 'react';
import { connect } from 'react-redux';
import { editUser} from '../../actions/users';


class SettingsView extends React.Component {

    static propTypes = {
        user: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        token: React.PropTypes.string.isRequired        
    };

    render() {        
        const {user, token, dispatch} = this.props;
        let calorie_limit, username;
        return (
            <div className="container">
                <div className="col-md-10 column">
                    <h2>Settings</h2> 
                    <form className="form" onSubmit={e => {
                        let allFields = [calorie_limit, username];
                        e.preventDefault()
                        if (!allFields.reduce((prev, field) => prev && !!field.value.trim(), true))
                            {
                                return
                            }
                        user.username = username.value;
                        user.calorie_limit = calorie_limit.value;
                        dispatch(editUser(user, token, 'settings/'));
                        }}>
                        <div className="form-group col-md-6">
                            <label>Username</label>
                            <input className="form-control" type="text" defaultValue={user.username} name="username" id="username" ref={node => username = node} />
                        </div>        
                        <div className="form-group col-md-6">
                            <label>Daliy Limit</label>
                            <input className="form-control"  name="calorie_limit" id="calorie_limit" defaultValue={user.calorie_limit} type="number" ref={node => calorie_limit = node} />
                        </div>                              
                        <div className="form-group col-md-12">
                            <input type="submit" value="Save" className="btn btn-primary" />
                        </div> 
                    </form>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
    token: state.auth.token,
    user: state.auth.user
    }
}

export default connect(mapStateToProps)(SettingsView);

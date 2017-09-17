import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUsersIfNeeded, postUser, deleteUser, editUser} from '../../actions/users';
import t from 'tcomb-form';

const Form = t.form.Form;

 const AddUser = t.struct({
    username: t.String,
    password: t.String,
    calorie_limit: t.Number,
    manager: t.Boolean
});

const formLayout = (locals) => {
  return (   
  <div>
    <div className="form-group col-md-6">
        {locals.inputs.username}
    </div>                
    <div className="form-group col-md-6">
        {locals.inputs.password}
    </div>                
    <div className="form-group col-md-6">
        {locals.inputs.calorie_limit}
    </div>       
    <div className="form-group col-md-6">
        {locals.inputs.manager}
    </div>
  </div>
  );
};

const AddUserFormOptions = {
    template: formLayout,
    fields: {
        password: {
            type: 'password',
        },
        calorie_limit: {
            type: 'number',
        }
    }
};

class UserView extends Component {
    static propTypes = {
	users: PropTypes.array.isRequired,
	dispatch: PropTypes.func.isRequired,
	token: PropTypes.string.isRequired,
	currentUser: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            editing: null,
            editStaff: false,
            formValues: {
                username: '',
                password: '',
                manager: false,
                admin: false
            }
        };
    }

    onFormChange = (value) => {
        this.setState({ formValues: value });
    };

    componentDidMount() {
	const { token, dispatch } = this.props;
	dispatch(fetchUsersIfNeeded(token))
    }


    create = (e) => {
        e.preventDefault();
        const value = this.addUserForm.getValue();
        const { token, currentUser, dispatch } = this.props;
        if (value) {
            dispatch(postUser({username:value.username, password:value.password, calorie_limit: value.calorie_limit, is_staff:value.manager}, token));
            this.state = {
                formValues: {
                    username: '',
                    password: '',
                    calorie_limit: 0,
                    manager: false
                }
            };
            
            
        }
    };

    render() {
	const { users, token, dispatch, currentUser } = this.props;
    let editCalories, editUsername, editStaff, editAdmin;
	
    return (
		<div className="container">
    		<div className="col-md-10 column">
      			<h2>Users</h2>
                <form onSubmit={this.create}>
                    <Form ref={(ref) => { this.addUserForm = ref; }}
                        type={ AddUser}
                        options={AddUserFormOptions}
                        value={this.state.formValues}
                        onChange={this.onFormChange}/>
                    <button type="submit" className="btn btn-default btn-block">
                        Submit
                    </button>
                </form>				  	
		      	<hr/>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Calorie Limit</th>
                            <th>Manager</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map(user => 
                        user.id == this.state.editing ?
                        <tr>
                            <td>
                                <input className="form-control" defaultValue={user.username} name="editUsername" id="editUsername" ref={node => editUsername = node} />
                            </td>
                            <td>
                                <input className="form-control" type="number" min="0" defaultValue={user.calorie_limit} name="editCalories" id="editCalories" ref={node => editCalories = node} />
                            </td>
                            <td>
                                <input className="form-control" type="checkbox" defaultValue={user.is_staff} name="editStaff" id="editStaff" ref={node => editStaff = node}  />
                            </td>
                            <td>
                                { currentUser.is_superuser ?
                                    <input className="form-control" type="checkbox" defaultValue={user.is_superuser} name="editAdmin" id="editAdmin" ref={node => editAdmin = node}  />
                                :
                                    <input className="form-control" type="checkbox" defaultValue={user.is_superuser} name="editAdmin" id="editAdmin" disabled readonly ref={node => editAdmin = node}  />
                                }
                            </td>
                            <td>
                                <button className="btn btn-primary btn-xs" onClick={e => {
                                        let allFields2 = [editUsername, editCalories];
                                        e.preventDefault()
                                        if (!allFields2.reduce((prev, field) => prev && !!field.value.trim(), true))
                                        {
                                            return
                                        }
                                        user.username = editUsername.value;
                                        user.calorie_limit = editCalories.value;
                                        user.is_staff = editStaff.checked;
                                        user.is_superuser = editAdmin.checked;
                                        this.setState({editing: null});
                                        dispatch(editUser(user, token));                                        
                                        dispatch(fetchUsersIfNeeded(token))
                                    }}
                                >
                                    <span className="glyphicon glyphicon-save"></span>
                                </button>
                            </td>
                        </tr>
                        :
                        <tr>
                            <td>{user.username}</td>
                            <td>{user.calorie_limit}</td>
                            <td><input type="checkbox" checked={user.is_staff} disabled readonly /></td>
                            <td><input type="checkbox" checked={user.is_superuser} disabled readonly /></td>
                            <td>
                                <button className="btn btn-danger btn-xs" onClick={e => this.setState({editing: user.id})}>
                                    <span className="glyphicon glyphicon-edit"></span>
                                </button>
                                <button className="btn btn-danger btn-xs" onClick={e => dispatch(deleteUser(user.id, token))}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
    		</div>
		</div>
		)
    }
}

const mapStateToProps = state => {
    const { users } = state
    return {
    currentUser: state.auth.user,
    token: state.auth.token,
	users: state.users.users || []
    }
}

export default connect(mapStateToProps)(UserView);
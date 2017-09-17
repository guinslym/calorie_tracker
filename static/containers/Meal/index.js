import React from 'react';
import { connect } from 'react-redux';
import { fetchMealsIfNeeded, postMeal, deleteMeal, editMeal } from '../../actions/meals';
import { fetchUsersIfNeeded } from '../../actions/users';

class MealView extends React.Component {

 static propTypes = {
    meals: React.PropTypes.array.isRequired,
    users: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    token: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state ={
            editing: null
        };
    }

  componentDidMount() {
       const { token, dispatch } = this.props;
       dispatch(fetchMealsIfNeeded(token, 'admin'))
       dispatch(fetchUsersIfNeeded(token))
    }

render() {
    const { meals, token, dispatch, user, users } = this.props;
    let text, calories, time, date, uname, editText, editCalories, editTime, editDate, editUname;

    return (
        <div className="container">
            <div className="col-md-10 column">
                <h2>Meals</h2> 
                    <form className="form" onSubmit={e => {
                        let allFields = [text, calories, time, date, uname];
                        e.preventDefault()
                        if (!allFields.reduce((prev, field) => prev && !!field.value.trim(), true))
                        {
                            return
                        }
                        dispatch(postMeal({
                            text: text.value,
                            calories: calories.value,
                            time: time.value,
                            date: date.value,
                            username: uname.value,
                        }, token))
                        allFields.map(field => field.value = '');
                        dispatch(fetchMealsIfNeeded(token, 'admin'))
                        }}>                 
                
                        <div className="form-group col-md-12">
                            <label>Text</label>
                            <input className="form-control" placeholder="text" name="text" id="text" ref={node => text = node} />
                        </div>     
                        <div className="form-group col-md-3">
                            <label>User</label>
                            <select className="form-control" ref={node => uname = node} defaultValue="">
                                { users.map (us => 
                                    <option value={us.username}>{us.username}</option>
                                )}
                             </select>    
                        </div>           
                        <div className="form-group col-md-3">
                            <label>Calories</label>
                            <input className="form-control" type="number" min="0" placeholder="calories" name="calories" id="calories" ref={node => calories = node} />                                
                        </div>                
                        <div className="form-group col-md-3">
                            <label>Time</label>
                            <input className="form-control" type="time" placeholder="HH:mm" name="time" id="time" ref={node => time = node}/>
                        </div>                               
                        <div className="form-group col-md-3">
                            <label>Date</label>
                            <input className="form-control" placeholder="YYYY-MM-DD" name="date" id="date" type="date" ref={node => date = node}/><br />                     
                            <input type="submit" value="Add" className="btn btn-primary" />
                        </div> 
                    </form>                  
                <hr/>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Text</th>
                            <th>Calories</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {meals.map(meal => 
                        meal.id == this.state.editing ?
                        <tr>
                            <td>
                                <select className="form-control" ref={node => editUname = node} defaultValue={meal.username}>
                                { users.map (us => 
                                    <option value={us.username}>{us.username}</option>
                                )}
                             </select>
                            </td>
                            <td>
                                <input className="form-control" defaultValue={meal.text} name="editText" id="editText" ref={node => editText = node} />
                            </td>
                            <td>
                                <input className="form-control" type="number" min="0" defaultValue={meal.calories} name="editCalories" id="editCalories" ref={node => editCalories = node} />                                </td>
                            <td>
                                <input className="form-control" type="time" defaultValue={meal.time} name="editTime" id="editTime" ref={node => editTime = node}/>

                            </td>
                            <td>
                                <input className="form-control" defaultValue={meal.date} name="editDate" id="editDate" type="date" ref={node => editDate = node}/><br />                     

                            </td>
                            <td>
                                <button className="btn btn-primary btn-xs" onClick={e => {
                                        let allFields2 = [editUname, editText, editCalories, editTime, editDate];
                                        e.preventDefault()
                                        if (!allFields2.reduce((prev, field) => prev && !!field.value.trim(), true))
                                        {
                                            return
                                        }
                                        meal.user = editUname.value
                                        meal.text = editText.value;
                                        meal.time = editTime.value;
                                        meal.date = editDate.value;
                                        meal.calories = editCalories.value;
                                        this.setState({editing: null});
                                        dispatch(editMeal(meal, token))                                        
                                        dispatch(fetchMealsIfNeeded(token, 'admin'))
                                    }}
                                >
                                    <span className="glyphicon glyphicon-save"></span>
                                </button>
                            </td>
                        </tr>
                        :
                        <tr>
                            <td>{meal.user}</td>
                            <td>{meal.text}</td>
                            <td>{meal.calories}</td>
                            <td>{meal.time}</td>
                            <td>{meal.date}</td>
                            <td>
                                <button className="btn btn-danger btn-xs" onClick={e => this.setState({editing: meal.id})}>
                                    <span className="glyphicon glyphicon-edit"></span>
                                </button>       
                                <button className="btn btn-danger btn-xs" onClick={e => dispatch(deleteMeal(meal.id, token))}>
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
    const { meals } = state
    return {
    token: state.auth.token,
    user: state.auth.user,
    meals: state.meals.meals || [],
    users: state.users.users || []
    }
}

export default connect(mapStateToProps)(MealView);
export { MealView as MealViewNotConnected };

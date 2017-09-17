import React from 'react';
import { connect } from 'react-redux';
import { fetchMealsIfNeeded, postMeal, deleteMeal, editMeal } from '../../actions/meals';

class HomeView extends React.Component {

 static propTypes = {
    meals: React.PropTypes.array.isRequired,
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
       dispatch(fetchMealsIfNeeded(token, 'list'))
    }

render() {
    const { meals, token, dispatch, user } = this.props;
    let text, calories, time, date, editText, editCalories, editTime, editDate;
    let totalCalories = 0;
    meals.forEach(function(meal) {
      totalCalories += meal.calories;
    });

    return (
        <div className="container">
            <div className="col-md-12 column">
                <h2>Meals</h2> 
                    <form className="form" onSubmit={e => {
                        let allFields = [text, calories, time, date];
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
                        }, token))
                        allFields.map(field => field.value = '');
                        dispatch(fetchMealsIfNeeded(token, 'list'))
                        }}>
                
                        <div className="form-group col-md-12">
                            <label>Text</label>
                            <input className="form-control" placeholder="text" name="text" id="text" ref={node => text = node} />
                        </div>                
                        <div className="form-group col-md-4">
                            <label>Calories</label>
                            <input className="form-control" type="number" min="0" placeholder="calories" name="calories" id="calories" ref={node => calories = node} />                                
                        </div>                
                        <div className="form-group col-md-4">
                            <label>Time</label>
                            <input className="form-control" type="time" placeholder="HH:mm" name="time" id="time" ref={node => time = node}/>
                        </div>                               
                        <div className="form-group col-md-4">
                            <label>Date</label>
                            <input className="form-control" placeholder="YYYY-MM-DD" name="date" id="date" type="date" ref={node => date = node}/><br />                     
                            <input type="submit" value="Add" className="btn btn-primary" />
                        </div> 
                    </form>                  
                <hr/>
                <div className="form-group col-md-6">
                    <label>Total Calories</label>
                    <input className="form-control" value = {totalCalories} disabled />                                
                </div>                
                <div className="form-group col-md-6">
                    <label>Daily Limit</label>
                    <input className="form-control" value = {user.calorie_limit} disabled/>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
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
                                        let allFields2 = [editText, editCalories, editTime, editDate];
                                        e.preventDefault()
                                        if (!allFields2.reduce((prev, field) => prev && !!field.value.trim(), true))
                                        {
                                            return
                                        }
                                        meal.text = editText.value;
                                        meal.time = editTime.value;
                                        meal.date = editDate.value;
                                        meal.calories = editCalories.value;
                                        this.setState({editing: null});
                                        dispatch(editMeal(meal, token))
                                        
                                        dispatch(fetchMealsIfNeeded(token, 'list'))
                                    }}
                                >
                                    <span className="glyphicon glyphicon-save"></span>
                                </button>
                            </td>
                        </tr>
                        :
                        <tr>
                            <td>{meal.text} </td>
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
    meals: state.meals.meals || []
    }
}

export default connect(mapStateToProps)(HomeView);
export { HomeView as HomeViewNotConnected };
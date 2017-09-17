import React from 'react';


export const Meals = ({ meals }) => (
    			<div className="container">
                    <div className="col-xs-12 col-sm-12 col-md-offset-3 col-md-10 col-lg-offset-3 col-lg-10">
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
                            dispatch(fetchMealsIfNeeded(token,""))
                            }}>
                            <div className="input-group">
                                <input className="form-control" placeholder="text" name="text" id="text" ref={node => text = node} />
                                <input className="form-control" type="number" placeholder="calories" name="calories" id="calories" ref={node => calories = node} />
                                <input className="form-control" type="time" placeholder="HH:mm" name="time" id="time" ref={node => time = node}/>
                                <input className="form-control" placeholder="YYYY-MM-DD" name="date" id="date" type="date" ref={node => date = node}/><br />
                                <input type="submit" value="Add" className="btn btn-primary" />
                            </div>
                        </form>                        
                        <hr/>
                        <p> total: {totalCalories} </p>
                        <p> limit: {user.calorie_limit} </p>
                        <ul className="list-group">
                        {meals.map(meal => 
                            <li className="list-group-item clearfix task"> 
                                <span className="lead">name: {meal.text}</span>
                                &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;
                                <span className="lead">calories: {meal.calories} </span>
                                &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;
                                <span className="lead">date: {meal.date}</span>
                                &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp;
                                <span className="lead">time: {meal.time}</span>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
);

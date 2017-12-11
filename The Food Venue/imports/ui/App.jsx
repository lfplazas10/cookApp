import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import{Chefs} from '../api/chef.js'


import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Landing from './Landing.jsx';
import NewRecipe from './NewRecipe.jsx';
import Recipe from './Recipe.jsx';
import NewUser from './NewUser.jsx';
import Chef from './Chef.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'Landing',
    };
  }
  toggleCreateRecipe() {
    this.setState({
      currentPage: 'CreateRecipe',
    });
  }
  incompleteUser() {
    if (this.state.currentPage != 'incompleteUser') {
      if (!this.props.user && this.props.currentUser) {
        this.setState({
          currentPage: 'incompleteUser',
        });
      }
    }
  }
  toggleShowRecipes() {
    this.setState({
      currentPage: 'Recipes',
    });
  }
  renderRecipes() {
    let i = 0;
    return this.props.recipes.map((recipe) => {
      i++;
      return (
        <Recipe key={recipe._id} recipe={recipe} num={i}/>
      );
    })
  }
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
  toggleMyProfile() {
    this.setState({
      currentPage: 'Chef',
    });
  }
  render() {
    return (
      <div className="container">
        {this.incompleteUser() ? '' : ''}
        <header>
          <div className="navbar">
            <img src="logo.svg" alt="" />
            <div className="navTitle"> 
              the food venue
            </div>
            <button aria-label="Search a recipe" onClick={this.toggleShowRecipes.bind(this)}>SEE ALL RECIPES</button>
            { this.props.currentUser ? <span> <button aria-label="Add a new recipe"  onClick={this.toggleCreateRecipe.bind(this)}>ADD RECIPE</button> <button aria-label="See my profile"  onClick={this.toggleMyProfile.bind(this)}>MY PROFILE</button></span> : '' }
            <AccountsUIWrapper />
          </div>
        </header>
        {this.state.currentPage === 'Landing' ?  <Landing /> : ''}
        {this.state.currentPage === 'CreateRecipe' ?  <NewRecipe /> : ''}
        {this.state.currentPage === 'incompleteUser'? <NewUser /> : ''}
        {this.state.currentPage === 'Recipes' ?  this.renderRecipes.bind(this) : ''}
        {this.state.currentPage === 'Chef' ?  <Chef chef_id={this.props.currentUser._id}/> : ''}
        <div className="footer">
          <span>
            2017 The Food Venue. Sas Zero rights reserved. The Food Venue is not a registered service mark of The Food Venue. Sas.
          </span>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user:PropTypes.object,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('chefs');
  Meteor.subscribe('recipes');
  if (Meteor.user()) {
    
    return {
      user: Chefs.findOne({userID: Meteor.user()._id }),
      currentUser: Meteor.user(),
    }
  } else {
    return {
      currentUser: Meteor.user(),

    }
  }
}, App);

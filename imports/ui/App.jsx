import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// luu tru du lieu trong mongodb
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { Tasks } from '../api/tasks.js';

import {Meteor} from 'meteor/meteor';

import Task from './Task.jsx';
// App component - represents the whole app
class App extends Component {

  handleSubmit(event) {
   event.preventDefault();

   // Find the text field via the React ref with value textInput (tuy gia tri dat cua input)
   const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
  //  unsecurity
  //  Tasks.insert({
  //    text,
  //    createdAt: new Date(), // current time
  //    owner: Meteor.userId(),           // _id of logged in user
  //    username: Meteor.user().username,  // username of logged in user
  //  });


   Meteor.call('tasks.insert', text);
   // Clear form
   ReactDOM.findDOMNode(this.refs.textInput).value = '';
 }

  renderTasks() {
    //cach khac goi truc tiep luon va return ve tam1.map luon
    // let tam1  = Tasks.find({}).fetch();
    // console.log(tam1);
    // return tam1.map((task) => (
    //   <Task key={task._id} task={task} tam ="vinh dep trai"/>
    // ));

    //Sconsole.log(this.props.vinhdep);
    //cach 1 dung props de chuyen gia tri o day ta dung createContainer
    return this.props.tasks.map((task) => (
      
      <Task key={task._id} task={task} tam ="vinh dep trai"/>// ta chuyen gia tri giua cac components dung props de lay gia trij

        //chu y la kieu no la gi propTypes la object hay string hay number ....
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

           <AccountsUIWrapper />

            {/*kiem tra neu nguoi dung da dang nhap thi hien la add text neu khong hienj la ''*/}
             { this.props.currentUser ?
             <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
               <input
                 type="text"
                 ref="textInput"
                 placeholder="Type to add new tasks"
               />
             </form> : ''
           }

        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
 );
}
}
// khai bao kieu co the co hoac khong nhung khuyen cao nen dung de dinh nghia kieu du lieu
App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
   Meteor.subscribe('tasks');
  return {
     tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
     vinhdep:Tasks.find({}).fetch(),
     incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
     currentUser: Meteor.user(),

  };
}, App);

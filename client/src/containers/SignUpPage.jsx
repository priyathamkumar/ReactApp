import React from 'react';
import PropTypes from 'prop-types'; 
import SignUpForm from '../components/SignUpForm.jsx';

class SignUpPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        userName: '',
        emailId: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const userName = this.state.user.userName;
    const emailId = this.state.user.emailId;
    const password = this.state.user.password;
    const data = {
      'userName' : userName,
      'password' : password,
      'emailId' : emailId
    };

    const errors = {};

    if(userName.trim().length === 0){
      errors.userName = 'Please provide your User Name.';
      this.setState({
        errors
      });
    }

    if(password.trim().length === 0){
      errors.password = 'Please provide your Password.';
      this.setState({
        errors
      });
    }

    if(!(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(emailId))){
      errors.emailId = 'Please provide valid Email Id.';
      this.setState({
        errors
      });
    }
    
    if(Object.keys(errors).length === 0){
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/register');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          this.setState({
            errors: {}
          });
          this.context.router.replace('/'); 
        } else if (xhr.status === 500){
          errors.summary = 'Something went wrong.. Please try again.';
          this.setState({
            errors
          });
        } else {
          errors.summary = xhr.response.message;
          this.setState({
            errors
          });
        }
      });
      xhr.send(JSON.stringify(data));
    }  
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
    const errors = {};

    const xhr = new XMLHttpRequest();
    xhr.open('get', '/user/validateUserName/'+user['userName']);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 400) {
        errors.userName = xhr.response.message;
        this.setState({
          errors
        });
      } else if (xhr.status === 500) {
        errors.summary = 'Something went wrong.. Please try again.';
        this.setState({
          errors
        });
      } else {
        errors.userName = '';
        this.setState({
          errors
        });
      }
    });
    xhr.send();
  }

  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;
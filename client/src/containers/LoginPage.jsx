import React from 'react';
import PropTypes from 'prop-types'; 
import LoginForm from '../components/LoginForm.jsx';


class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        userName: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const userName = this.state.user.userName;
    const password = this.state.user.password;
    const data = {
      'userName' : userName,
      'password' : password
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
    
    if(Object.keys(errors).length === 0){
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/login');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          this.setState({
            errors: {}
          });
          localStorage.setItem('token', xhr.response.token);
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
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
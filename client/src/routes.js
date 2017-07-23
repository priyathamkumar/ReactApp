import Base from './components/Base.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, callback) => {
        if (localStorage.getItem('token') !== null) {
          callback(null, DashboardPage);
        } else {
          callback(null, LoginPage);
        }
      }
    },
    {
      path: '/signup',
      component: SignUpPage
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        localStorage.removeItem('token');
        replace('/');
      }
    }
  ]
};

export default routes;
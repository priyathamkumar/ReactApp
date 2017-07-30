import Base from './components/Base.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import DashboardPage from './containers/DashboardPageNew.jsx';
import AddProductPage from './containers/AddProductPage.jsx';
import EditProductPage from './containers/EditProductPage.jsx';

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
    },
    {
      path: '/addProduct',
      getComponent: (location, callback) => {
        if (localStorage.getItem('token') !== null) {
          callback(null, AddProductPage);
        } else {
          callback(null, LoginPage);
        }
      }
    },
    {
      path: '/editProduct/:product',
      getComponent: (location, callback) => {
        if (localStorage.getItem('token') !== null) {
          callback(null, EditProductPage);
        } else {
          callback(null, LoginPage);
        }
      }
    }
  ]
};

export default routes;
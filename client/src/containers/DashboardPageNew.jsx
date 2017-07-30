import React from 'react';
import PropTypes from 'prop-types'; 
import MuiTable from '../components/DashboardNew.jsx';
import _ from 'underscore'

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      products : [],
      selectedProducts: [],
      pages: [],
      currentPage: 0,
      itemsPerPage: 10
    }

    this.handlePagination = this.handlePagination.bind(this);
    this.isAllChecked = this.isAllChecked.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleDeleteProducts = this.handleDeleteProducts.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
  }

  isAllChecked(products){
    const tempSelected = [];
    products.forEach((product) => {
      tempSelected.push(product.productId)
    }); 
    if(_.difference(tempSelected, this.state.selectedProducts).length === 0){  
      return true;
    } else {
      return false;
    }
  }

  isChecked(productId){
    const index = this.state.selectedProducts.indexOf(productId);
    if(index > -1){  
      return true;
    } else {
      return false;
    }
  }

  handlePagination(index){
    const xhr = new XMLHttpRequest();
    var token = localStorage.getItem('token');
    xhr.open('get', '/product/api/fetchProducts');
    xhr.setRequestHeader('Authorization', 'Bearer '+token);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          products: xhr.response.products.splice(index*this.state.itemsPerPage,this.state.itemsPerPage),
          currentPage: index
        });
      } else {
        localStorage.removeItem('token');
        this.context.router.replace('/');
      }
    });
    xhr.send();
  }

  handleAllCheckboxChange(event){
    const tempSelected = [];
    if(event.target.checked){
      this.state.products.forEach((product) => {
        tempSelected.push(product.productId)
      });
    }  
    this.setState({
      selectedProducts: tempSelected
    })
  }

  handleCheckboxChange(event, productId) {
    const tempSelected = this.state.selectedProducts;
    if(event.target.checked){
      tempSelected.push(productId);
    } else {
      const index = tempSelected.indexOf(productId);
      if(index > -1){  
        tempSelected.splice(index, 1);
      }
    }
    this.setState({
      selectedProducts: tempSelected
    });
  }

  handleDeleteProducts(){
    if(this.state.selectedProducts.length === 0){
      alert('Please Select aleast one Product to perform Delete operation.')
    } else {
      const data = {
        'productIds' : this.state.selectedProducts
      };

      const xhr = new XMLHttpRequest();
      var token = localStorage.getItem('token');
      xhr.open('delete', '/product/api/deleteProducts');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer '+token);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const xhr1 = new XMLHttpRequest();
          var token = localStorage.getItem('token');
          xhr1.open('get', '/product/api/fetchProducts');
          xhr1.setRequestHeader('Authorization', 'Bearer '+token);
          xhr1.responseType = 'json';
          xhr1.addEventListener('load', () => {
            if (xhr1.status === 200) {
              const pages = [];
              for(var i=0; i<Math.ceil(xhr1.response.products.length/this.state.itemsPerPage); i++){
                pages.push(i);
              }
              this.setState({
                products: xhr1.response.products.splice(0,this.state.itemsPerPage),
                pages: pages,
                selectedProducts: [],
                currentPage: 0
              });
              alert('Selected Products Deleted Successfully');
            } else if (xhr1.status === 401) {
              localStorage.removeItem('token');
              this.context.router.replace('/');
            }
          });
          xhr1.send();
        } else {
          localStorage.removeItem('token');
          this.context.router.replace('/');
        }
      });
      xhr.send(JSON.stringify(data));
    }  
  }

  handleEditProduct(product) {
    this.context.router.replace('/editProduct/'+btoa(JSON.stringify(product)));
  }

  componentDidMount() {
    const xhr = new XMLHttpRequest();
    var token = localStorage.getItem('token');
    xhr.open('get', '/product/api/fetchProducts');
    xhr.setRequestHeader('Authorization', 'Bearer '+token);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const pages = [];
        for(var i=0; i<Math.ceil(xhr.response.products.length/this.state.itemsPerPage); i++){
          pages.push(i);
        }
        this.setState({
          products: xhr.response.products.splice(0,this.state.itemsPerPage),
          pages: pages
        });
      } else {
        localStorage.removeItem('token');
        this.context.router.replace('/');
      }
    });
    xhr.send();
  }

  render() {
    return (
      <MuiTable 
        data={this.state.products} 
        pages={this.state.pages}
        currentPage={this.state.currentPage}
        handlePagination={this.handlePagination}
        isAllChecked={this.isAllChecked}
        isChecked={this.isChecked}
        handleAllCheckboxChange={this.handleAllCheckboxChange}
        handleCheckboxChange={this.handleCheckboxChange}
        handleDeleteProducts={this.handleDeleteProducts}
        handleEditProduct={this.handleEditProduct}/>
    );  
  }
  
}  

DashboardPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default DashboardPage;
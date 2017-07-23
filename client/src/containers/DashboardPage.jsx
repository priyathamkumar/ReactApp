import React from 'react';
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard.jsx';

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      productsData: []
    };

    this.options = {
      afterInsertRow: this.onAfterInsertRow.bind(this),
      noDataText: 'No Products Found',
      insertText: 'Add Product',
      deleteText: 'Delete Product',
      afterDeleteRow: this.onAfterDeleteRow.bind(this),
      handleConfirmDeleteRow: this.customConfirm.bind(this)
    };

    this.selectRowProp = {
      mode: 'checkbox'
    };

    this.cellEditProp = {
      mode: 'click',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell.bind(this), 
      afterSaveCell: this.onAfterSaveCell.bind(this)
    }

    this.productCodeValidator = this.productCodeValidator.bind(this);
    this.productNameValidator = this.productNameValidator.bind(this);
    this.qtyValidator = this.qtyValidator.bind(this);
    this.expiryDateValidator = this.expiryDateValidator.bind(this);
  }

  productCodeValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    var newIndexOf = function(arr, key, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return i;
        }
      }
      return -1;
    }
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Product Code is mandatory';
      response.notification.title = 'Invalid Value';
    } else {
      var index = newIndexOf(this.state.productsData, "code", value);
      if (row.createdDate === "" && index !== -1){
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Product Code "'+value+'" already Exists';
        response.notification.title = 'Invalid Value';
      } else if(row.createdDate != ""){
        if(index !== -1 && row.productId !== this.state.productsData[index]["productId"]){
          response.isValid = false;
          response.notification.type = 'error';
          response.notification.msg = 'Product Code "'+value+'" already Exists';
          response.notification.title = 'Invalid Value';
        }  
      }  
    }  
    return response;
  }

  productNameValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Product Name is mandatory';
      response.notification.title = 'Invalid Value';
    }
    return response;
  }

  qtyValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if(!value){
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Quantity is mandatory';
      response.notification.title = 'Invalid Value';
    } else if (value <= 0) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Quantity has to be a more than Zero';
      response.notification.title = 'Invalid Value';
    }  
    return response;
  }

  expiryDateValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Expiry date cannot be empty';
      response.notification.title = 'Invalid Value';
    } else if((new Date(value)).getTime() < (new Date()).getTime()){
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Expiry date cannot be previous date';
      response.notification.title = 'Invalid Value';
    }
    return response;
  }

  onAfterInsertRow(row) {
    const data = {
      'name' : row['name'],
      'code' : row['code'],
      'qty' : parseInt(row['qty']),
      'expiryDate' : row['expiryDate']
    };

    const xhr = new XMLHttpRequest();
    var token = localStorage.getItem('token');
    xhr.open('post', '/product/api/addProduct');
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
            this.setState({
              productsData: xhr1.response.products
            });
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

  onAfterDeleteRow(rowKeys) {
    const data = {
      'productIds' : rowKeys,
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
            this.setState({
              productsData: xhr1.response.products
            });
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

  customConfirm(next, dropRowKeys) {
    if (confirm('Are you sure you want to Delete these Products ?')) {
      next();
    }
  }

  onBeforeSaveCell(row, cellName, cellValue) {
    // console.log(cellValue)
    return true;
  }

  onAfterSaveCell(row, cellName, cellValue) {
    const data = {
      'productId' : row['productId'],
      'name' : row['name'],
      'code' : row['code'],
      'qty' : parseInt(row['qty']),
      'expiryDate' : row['expiryDate']
    };

    const xhr = new XMLHttpRequest();
    var token = localStorage.getItem('token');
    xhr.open('put', '/product/api/updateProduct');
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
            this.setState({
              productsData: xhr1.response.products
            });
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

  componentDidMount() {
    const xhr = new XMLHttpRequest();
    var token = localStorage.getItem('token');
    xhr.open('get', '/product/api/fetchProducts');
    xhr.setRequestHeader('Authorization', 'Bearer '+token);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          productsData: xhr.response.products
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
      <Dashboard
        productsData={this.state.productsData}
        options={this.options}
        selectRowProp={this.selectRowProp}
        cellEditProp={this.cellEditProp}
        productCodeValidator={this.productCodeValidator}
        productNameValidator={this.productNameValidator}
        qtyValidator={this.qtyValidator}
        expiryDateValidator={this.expiryDateValidator}
      />
    );  
  }
}

DashboardPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default DashboardPage;
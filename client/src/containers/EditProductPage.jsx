import React from 'react';
import PropTypes from 'prop-types'; 
import EditProductForm from '../components/EditProductForm.jsx';

class EditProductPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      product: {
        productId: JSON.parse(atob(this.props.params.product)).productId,
        code: JSON.parse(atob(this.props.params.product)).code,
        name: JSON.parse(atob(this.props.params.product)).name,
        qty: JSON.parse(atob(this.props.params.product)).qty,
        expiryDate: JSON.parse(atob(this.props.params.product)).expiryDate
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeProduct = this.changeProduct.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const productId = this.state.product.productId;
    const code = this.state.product.code;
    const name = this.state.product.name;
    const qty = this.state.product.qty;
    const expiryDate = this.state.product.expiryDate;
    const data = {
      'code' : code,
      'name' : name,
      'qty' : qty,
      'expiryDate' : expiryDate
    };

    const errors = {};

    if(code.trim().length === 0){
      errors.code = 'Please provide Product Code.';
      this.setState({
        errors
      });
    }

    if(name.trim().length === 0){
      errors.name = 'Please provide Product Name.';
      this.setState({
        errors
      });
    }

    if(qty === ""){
      errors.qty = 'Please provide Quantity.';
      this.setState({
        errors
      });
    } else if(qty < 0){
      errors.qty = 'Quantity has to be valid Number.';
      this.setState({
        errors
      });
    } else if(qty == 0){
      errors.qty = 'Quantity cannot be Zero.';
      this.setState({
        errors
      });
    }

    if(expiryDate.trim().length === 0){
      errors.expiryDate = 'Please provide Expiry Date.';
      this.setState({
        errors
      });
    }
  
    if(Object.keys(errors).length === 0){
      const data = {
        'productId' : productId,
        'name' : name,
        'code' : code,
        'qty' : parseInt(qty),
        'expiryDate' : expiryDate
      };

      const xhr = new XMLHttpRequest();
      var token = localStorage.getItem('token');
      xhr.open('put', '/product/api/updateProduct');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer '+token);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          alert('Product Updated Successfully');
          this.context.router.replace('/');
        } else if (xhr.status === 400) {
          errors.summary = xhr.response.message;
          this.setState({
            errors
          });
        } else {
          localStorage.removeItem('token');
          this.context.router.replace('/');
        }
      });
      xhr.send(JSON.stringify(data));
    }  
  }

  changeProduct(event) {
    const field = event.target.name;
    const product = this.state.product;
    product[field] = event.target.value;

    this.setState({
      product
    });
  }

  changeDate(event, date) {
    const product = this.state.product;
    product['expiryDate'] = date.getFullYear()+"-"+('0' + (date.getMonth() + 1)).slice(-2) +"-"+ ('0' + date.getDate()).slice(-2);
    
    this.setState({
      product
    });
  }
    
  render() {
    return (
      <EditProductForm
        onSubmit={this.processForm}
        onChange={this.changeProduct}
        onDateChange={this.changeDate}
        errors={this.state.errors}
        product={this.state.product}
      />
    );
  }

}

EditProductPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default EditProductPage;
import React from 'react';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const AddProductForm = ({
  onSubmit,
  onChange,
  onDateChange,
  errors,
  product,
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Product Details</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Product Code"
          name="code"
          errorText={errors.code}
          onChange={onChange}
          value={product.code}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Product Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
          value={product.name}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Quantity"
          type="number"
          name="qty"
          onChange={onChange}
          errorText={errors.qty}
          value={product.qty}
        />
      </div>

      <div className="field-line" style={{padding:'20px'}}>
        <DatePicker 
          floatingLabelText="Expiry Date"
          hintText="Expiry Date"
          name="expiryDate"
          onChange={onDateChange}
          minDate={new Date()}
          errorText={errors.expiryDate}/>
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Add Product" primary />
      </div>
    </form>
  </Card>
);

AddProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired
};

export default AddProductForm;
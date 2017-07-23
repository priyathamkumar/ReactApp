import React from 'react';
import PropTypes from 'prop-types'; 
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

function productCodeFormatter(cell, row) {
  return `${cell}<i class='glyphicon glyphicon-edit' style='float:right;cursor:pointer'></i>`;
}

function productNameFormatter(cell, row) {
  return `${cell}<i class='glyphicon glyphicon-edit' style='float:right;cursor:pointer'></i>`;
}

function qtyFormatter(cell, row) {
  var color = '';
  if(cell<10){
    color='red';
  } else if(cell>10 && cell<30){
    color='#ffa500';
  } else {
    color='green';
  }
  return `<div style='background-color:${color};color:white'>${cell}<i class='glyphicon glyphicon-edit' style='float:right;cursor:pointer'></i></div>`;
}

function expiryDateFormatter(cell, row) {
  return `${('0' + new Date(cell).getDate()).slice(-2)}/${('0' + (new Date(cell).getMonth() + 1)).slice(-2)}/${new Date(cell).getFullYear()}<i class='glyphicon glyphicon-edit' style='float:right;cursor:pointer'></i>`;
}

const Dashboard = ({ productsData, options, selectRowProp, cellEditProp, productCodeValidator, productNameValidator, qtyValidator, expiryDateValidator }) => (
  <BootstrapTable data={ productsData } 
  	pagination
  	insertRow={ true } 
  	deleteRow={ true }
  	selectRow={ selectRowProp }
  	options={ options }
  	cellEdit={ cellEditProp }>
  		<TableHeaderColumn dataField='productId' hidden={ true } isKey={ true} autoValue={ true } >Product Id</TableHeaderColumn>
	  	<TableHeaderColumn dataField='code' dataSort={ true } dataFormat={ productCodeFormatter } filter={ { type: 'TextFilter' } } editable={ { validator: productCodeValidator } } >Product Code</TableHeaderColumn>
	    <TableHeaderColumn dataField='name' dataSort={ true } dataFormat={ productNameFormatter } filter={ { type: 'TextFilter' } } editable={ { validator: productNameValidator } } >Product Name</TableHeaderColumn>
	    <TableHeaderColumn dataField='qty' dataSort={ true } dataFormat={ qtyFormatter } editable={ { type: 'number', validator: qtyValidator } } >Quantity</TableHeaderColumn>
	    <TableHeaderColumn dataField='expiryDate' dataSort={ true } dataFormat={ expiryDateFormatter } editable={ { type: 'date', validator: expiryDateValidator } } >Expiry Date</TableHeaderColumn>
      <TableHeaderColumn dataField='createdDate' hidden={ true } hiddenOnInsert={ true } >Created Date</TableHeaderColumn>
  </BootstrapTable>
);

Dashboard.propTypes = {
	options: PropTypes.object.isRequired,
  productsData: PropTypes.array.isRequired,
  selectRowProp: PropTypes.object.isRequired,
  cellEditProp: PropTypes.object.isRequired,
  productCodeValidator: PropTypes.func.isRequired,
  productNameValidator: PropTypes.func.isRequired,
  qtyValidator: PropTypes.func.isRequired,
  expiryDateValidator: PropTypes.func.isRequired
};

export default Dashboard;
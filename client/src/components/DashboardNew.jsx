import React from 'react';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router';

const MuiTable = ({data, pages, currentPage, handlePagination, handleDeleteProducts, isAllChecked, isChecked, handleAllCheckboxChange, handleCheckboxChange, handleEditProduct}) => (
  <div>
    <div className="well clearfix">
      <div className="pull-left">
        <button type="button" className="btn btn-default" style={{marginRight: '10px'}}><span className="glyphicon glyphicon-plus"></span><Link to={'/addProduct'}>Add Product</Link></button>
        <button type="button" className="btn btn-danger" onClick={handleDeleteProducts}><span className="glyphicon glyphicon-trash"></span> Delete Products</button>
      </div>
    </div>
    <table className="table table-striped table-condensed">
      <thead>
        <tr>
          <th style={{textAlign: 'center'}}><input type="checkbox" checked={isAllChecked(data)} onChange={(e) => handleAllCheckboxChange(e)}/></th>
          <th style={{textAlign: 'center',fontWeight: 'bold',fontSize: '15px'}}>Product Code</th>
          <th style={{textAlign: 'center',fontWeight: 'bold',fontSize: '15px'}}>Product Name</th>
          <th style={{textAlign: 'center',fontWeight: 'bold',fontSize: '15px'}}>Quantity</th>
          <th style={{textAlign: 'center',fontWeight: 'bold',fontSize: '15px'}}>Expiry Date</th>
          <th style={{textAlign: 'center',fontWeight: 'bold',fontSize: '15px'}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr>
              <td style={{textAlign: 'center'}}><input type="checkbox" checked={isChecked(row.productId)} onChange={(e) => handleCheckboxChange(e, row.productId)}/></td>
              <td style={{textAlign: 'center'}}>{row.code}</td>
              <td style={{textAlign: 'center'}}>{row.name}</td>
              <td style={{textAlign: 'center', color: 'white', backgroundColor: row.qtyColor}}>{row.qty}</td>
              <td style={{textAlign: 'center'}}>{row.expiryDate}</td>
              <td style={{textAlign: 'center'}}><button type="button" className="btn btn-default command-edit" onClick={()=>handleEditProduct(row)}><span className="glyphicon glyphicon-edit"></span></button></td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <div style={{textAlign: 'center'}}>
      <ul className="pagination">
        { pages.map((obj, index) => {
          if(index==currentPage){
            return (
              <li style={{cursor: 'pointer'}} className="active"><a onClick={()=>handlePagination(index)}>{index+1}</a></li>
            )
          } else {
            return (
              <li style={{cursor: 'pointer'}} ><a onClick={()=>handlePagination(index)}>{index+1}</a></li>
            )
          }  
        })}      
      </ul>
    </div>
  </div>  
)

MuiTable.propTypes = {
  data: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePagination: PropTypes.func.isRequired,
  handleDeleteProducts: PropTypes.func.isRequired,
  isAllChecked: PropTypes.func.isRequired,
  isChecked: PropTypes.func.isRequired,
  handleAllCheckboxChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleEditProduct: PropTypes.func.isRequired
};

export default MuiTable
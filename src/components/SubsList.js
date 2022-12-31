import React, { useEffect } from 'react';

import {Button} from 'react-bootstrap';
import '../styles/subsList.css';
import Loading from './Loading';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { render } from 'react-dom';

const columns = [
    { id: 'index', label: '#', minWidth:10,  maxWidth: 20, color:"#D0A44D", align:'left'},
    { id: 'creator_id', label: 'SINGER ID', minWidth:100, maxWidth: 200, color:"#D0A44D", align:'left' },
    { id: 'subscriber_id', label: 'USER ID', minWidth: 10, maxWidth: 20, align:'left'},
    { id: 'subscription',
      label: 'SUBSCRIPTION',
      minWidth: "80px",
      maxWidth: 100,
      align:'center',
    }
  ];
  
  const SubRow = ({index, creator_id, subscriber_id}) => {
    const cookieList = document.cookie.replace(/\s/g, "").split(";");
    const cookieMap = new Map();
    cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
    const token = cookieMap.get("accessToken");
    // const navigate = useNavigate();

  const subsClickHandler = (creator_id, subscriber_id,functionName) => {
    // isi LOADING_EPI

    console.log(creator_id, subscriber_id, functionName)
    axios({
      method: 'post',
      data: { "creator_id": creator_id, "subscriber_id": subscriber_id },
      url: `http://localhost:8083/api/subscription/${functionName}SubscriptionSoap`,
      headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
    })
    .then(function (response) {
        // set cookie from response
        // matiin LOADING_EPI
        console.log(response.data);
        window.location.reload();
    })
    .catch(function (e) {
        //handle error
        console.log(e)
        window.location.reload();
    });
  }

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={index}> 
      <TableCell
        key={"index"} 
        align={"left"} 
        style={{ 
          minWidth: 10,
          color:"#FFFFFF", 
          backgroundColor:"transparent", 
          fontFamily:"Montserrat", 
          fontWeight:"600" }}>
        {index}
      </TableCell>
      <TableCell
        key={"creator_id"} 
        align={"left"} 
        style={{ 
          minWidth: 200, 
          color:"#FFFFFF", 
          backgroundColor:"transparent", 
          fontFamily:"Montserrat", 
          fontWeight:"600" }}>
        {creator_id}
      </TableCell>
      <TableCell
        key={"subscriber_id"} 
        align={"left"} 
        style={{ 
          minWidth: 200, 
          color:"#FFFFFF", 
          backgroundColor:"transparent", 
          fontFamily:"Montserrat", 
          fontWeight:"600" }}>
        {subscriber_id}
      </TableCell>
      <TableCell key={'subscription'} align={'center'}>
        <Button type="button" className="def_button" id="accept_button" onClick={() => {subsClickHandler(creator_id, subscriber_id, 'accept');}}>
            <span id="accept">
                ACCEPT
            </span>
        </Button>
        <Button type="button" className="def_button" id="reject_button" onClick={() => {subsClickHandler(creator_id, subscriber_id, 'reject');}}>
            <span id="reject">
                REJECT
            </span>
        </Button>
      </TableCell>
    </TableRow>
  )
}

const SubsList = () => {
  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
  const token = cookieMap.get("accessToken");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [requestList, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // get List Of Song once on page load
  
  useEffect(() => {
    axios({
      method: 'post',
      data: {},
      url: `http://localhost:8083/api/subscription/listSubscriptionSoap`,
      headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
    })
    .then(function (response) {
      // matiin LOADING_EPI
      // set cookie from response
      setLoading(false);
      setRequests(response.data.value)
    })
    .catch(function (e) {
        //handle error
        console.log(e)
        window.location.reload();
    });
  }, [])

  console.log(requestList)
  console.log("OKeE")
  

  return (
    <>
      {loading ? <Loading />: null}
      <div class='subs__table'>
          <div id='table'>
              <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                      <TableHead className='table_header'>
                          <TableRow className="table_header__element">
                          {columns.map((column) => (
                              <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth, color:"#D0A44D", backgroundColor:"transparent", fontFamily:"Montserrat", fontWeight:"600" }}
                              color="#D0A44D"
                              >
                              {column.label}
                              </TableCell>
                          ))}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {requestList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request,index) => {
                          return (
                            SubRow({index:index+1, creator_id:request.creator_id, subscriber_id:request.subscriber_id})
                          )                            
                        })};  
                      </TableBody>
                  </Table>
              </TableContainer>
          </div>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={requestList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="table_pagination"
          />
      </div>
    </>
  )
}

export default SubsList
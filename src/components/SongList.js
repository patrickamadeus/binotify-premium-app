import React, { useEffect } from 'react'
import Loading from './Loading';

import {Button, Container} from 'react-bootstrap'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/subsList.css'
import '../styles/songList.css'
import { BiPlay, BiPencil} from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import jwtDecode from '../jwt/jwt-decoder';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DefaultMode = ({index,song_id,judul}) => {
  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
  const token = cookieMap.get("accessToken");
  const userId = jwtDecode(token).user_id;

  const navigate = useNavigate();

  const deleteHandler = (song_id) => {
    axios({
      method: 'delete',
      url: 'http://localhost:8083/api/premiumSong/deletePremiumSong',
      data: { song_id : parseInt(song_id) },
      headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
    })
    .then(function (response) {
        // set cookie from response
        console.log(response.data);
        window.location.reload();
    })
    .catch(function (e) {
        //handle error
        console.log(e.response.data)
        // if null token        
        window.location.reload();
    });
  }
  
  let href = "/editSong/" + song_id;
  return (
    <>
      <TableCell style={{color:'#B2B2B2', width:'20px'}}>{index}</TableCell>
      <TableCell style={{color:'white', fontSize:'20px', fontWeight:'600'}}>
        <Container>
          <Row>
            <Col sm={9}>
              <div style={{color:'#B2B2B2', fontSize:'15px', letterSpacing:'2pt'}} class="song_title__label">TITLE</div>
              <div style={{color:'white', fontSize:'20px', fontWeight:'600'}} class="song__title">{judul}</div>
            </Col>
          </Row>
        </Container>
      </TableCell>
      <TableCell>
        <div style={{display:'flex', justifyContent:'flex-end'}} class="edit_delete">
          <Button style={{backgroundColor:"transparent", border:'none'}}>
            <a href= {href}>
              <BiPencil style={{fontSize:'25px', color:'white'}} className="button_group"/>
            </a>
          </Button>
          <Button style={{backgroundColor:"transparent", border:'none'}} onClick={() => {deleteHandler(song_id);}}>
            <AiFillDelete style={{fontSize:'25px', color:'#C13B3B'}} className="button_group"/>
          </Button>
        </div>
      </TableCell>
    </>
  )
}

const SongList = () => {
  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
  const token = cookieMap.get("accessToken");
  const userId = jwtDecode(token).user_id;
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [songs, setSongs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // get List Of Song once on page load
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:8083/api/premiumSong/getPremiumSongDetailByPenyanyiId?penyanyi_id=${userId}`,
      headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
    })
    .then(function (response) {
        // set cookie from response
        setLoading(false);
        setSongs(response.data.content)
    })
    .catch(function (e) {
        //handle error
        console.log(e)
        navigate("/")
    });
  }, [])
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log(songs)
  console.log("OKE")

  return (
    <>
    {loading ? <Loading />: null}
        <div className='subs__table'>
          <div id="table">
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableBody>
                        {songs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((song,index) =>(
                          <TableRow className="song__line">
                            <DefaultMode index={index+1} song_id = {song.song_id} judul={song.judul}/>
                          </TableRow>
                        ))}
                        <TableRow>
                          {songs.length === 0 ? <td style={{color:'white', fontSize:'20px', fontWeight:'600'}}>No Song</td> : <td></td>}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
          </div>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={songs.length}
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

export default SongList
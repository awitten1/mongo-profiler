import {Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import Timestamps2 from './Timestamps2';

const Item = styled(Paper)(() => ({
                             background: 'blue',
                             backgroundColor: '#1A8727',
                             textAlign: 'center',
                           }));

const Button = styled.button`
  background-color: #C1BEBC;
  color: white;
  padding: 55px 15px;
  border-radius: 100%;
  outline: 0;
  text-transform: uppercase;
  font-size: 15px;
  margin: 10px 20px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #006400;
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Hostnames =
    () => {
      let hostnameList = [];
      const [post, setPost] = React.useState(null);

      React.useEffect(() => {
        axios.get('http://localhost:8000/hostnames').then((res) => {
          setPost(res.data);
        });
      }, []);

      if (!post) return null;
      const nodeLabel = window.innerWidth / 10;

      hostnameList = post.hostnames;

      const renderHostnames = () => hostnameList.map(
          (hostname) => (
              <div style = {
                {
                  height: '230px', width: {window}
                }
              }><Grid container>


              <Grid xs = {3} sm = {7} md = {2}>

              <Item sx = {
                {
                  backgroundColor: 'transparent', border: '2px solid black'
                }
              }>

              <Link to = {`/${hostname}`}>
              <Button>{hostname}</Button>
              </Link>
              </Item>

        </Grid><div style = {
                {
                  height: '30px', width: '50px'
                }
              }>
              </div>

        <Grid xs = {3} sm = {2} md = {9}><Item sx = {
                {
                  backgroundColor: 'transparent',
                  border: '2px solid black',
                }}>
        <Timestamps2 hostname = {
          hostname
        } />
              </Item></Grid></Grid>
  </div>));
      return (<div >
        <h1 style={{
    textAlign: 'center', color: '#E8E7D5', fontSize: '40px',
        marginBottom: '50px'}}>MongoDB Continuous
Profiler<
    /h1>
    <div>





            </div>

    {renderHostnames()} < /div>);
    }


export default Hostnames;
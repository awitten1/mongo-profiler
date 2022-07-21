import {Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {textAlign} from '@mui/system';
import axios from 'axios';
import React, {Component} from 'react';
import {useEffect, useParams} from 'react-router-dom';
import styled from 'styled-components';

import Timestamps2 from './Timestamps2';

const Item = styled(Paper)(() => ({
                             backgroundColor: '#1A2027',
                             textAlign: 'center',
                           }));

const Button = styled.button`
  background-color: #4DB33D;
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
    background-color: #3FA037;
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

      hostnameList = post.hostnames;

      const renderHostnames = () => hostnameList.map(
          (hostname) => (
              <div style = {
                {
                  height: '200px', width: '1400px'
                }
              }><Grid container>


              <Grid item xs = {3} sm = {7} md = {2}>

              <Item>
              <a href = {`http://localhost:3000/${hostname}`} target =
                   '_blank' rel = 'noreferrer'>
              <Button>{hostname}</Button>
              </a>
              </Item>

        </Grid><div style = {
                {
                  height: '30px', width: '50px'
                }
              }>
              </div>

        <Grid item xs = {3} sm = {2} md = {9}><Item>
        <Timestamps2 hostname = {
          hostname
        } />
              </Item></Grid></Grid>
  </div>));

      return (<div>
        <h2 style={{
    textAlign: 'center'}}>MongoDB Continuous
                  Profiler</h2>
        {renderHostnames()}
        </div>);
    }


export default Hostnames;
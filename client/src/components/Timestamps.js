import axios from 'axios';
import React, {Component} from 'react';
import {useEffect, useParams} from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #3f51b5
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #283593;
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Timestamps = () => {
  const {hostname} = useParams();
  let timestamps = [];
  console.log(hostname);
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(`http://localhost:8000/${hostname}/timestamps`).then((res) => {
      setPost(res.data);
    });
  }, []);

  if (!post) return null;

  timestamps = post.timestamps;
  console.log(timestamps);

  return (<div><h2>{hostname}<
          /h2> 
    <ul>{timestamps.map((timestamp) =>
     <a href = {`http://localhost:8000/${hostname}/flamegraph/${timestamp.date}`} target =
     '_blank' rel = 'noreferrer'>
<Button>{timestamp.date}</Button>
</a>)}</ul>
</div>
 );
}
;

export default Timestamps;
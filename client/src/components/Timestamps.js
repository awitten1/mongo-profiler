import axios from 'axios';
import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #E8E7D5;
  padding: 40px 10px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 20px 50px;
  cursor: pointer;
  font-size: 10px;
  box-shadow: 0px 2px 2px gray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #C1BEBC;
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

  return (<div><h2 style={{
    textAlign: 'center', color: '#E8E7D5'}}>Flamegraphs for {hostname}</h2> 
    <ul>{timestamps.map((timestamp) =>
     <a href = {`http://localhost:8000/${
    hostname}/flamegraph/${
    timestamp.date}`} target =
     '_blank' rel = 'noreferrer'>
<Button>{new Date(timestamp.date).toString().slice(0,25)+ "(EST)"}</Button>
</a>)}</ul>
</div>
 );
}
;

export default Timestamps;
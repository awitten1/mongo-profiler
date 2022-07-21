
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import axios from 'axios';
import React from 'react';
import {useEffect, useParams} from 'react-router-dom';
import Slider from 'react-slick';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #C4A484;
  padding: 60px 15px;
  border-radius: 100%;
  outline: 0;
  text-transform: uppercase;
  margin: 20px 50px;
  cursor: pointer;
  font-size: 10px;
  box-shadow: 0px 2px 2px gray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #6F4E37;
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

export default function Timestamps2(props) {
  function Arrow(props) {
    let className = props.type === 'next' ? 'nextArrow' : 'prevArrow';
    className += ' arrow';
    const char = props.type === 'next' ? '>' : '<';
        return (
          <span className={className} onClick={props.onClick}>
            {char}
          </span>
        );
      }

console.log(props)
  const hostname = props.hostname;
  let timestamps = [];
  console.log(hostname);
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(`http://localhost:8000/${
      hostname}/timestamps`).then((res) => {
      setPost(res.data);
    });
  }, []);

  if (!post) return null;

  timestamps = post.timestamps;
  console.log(timestamps);


  const renderSlides = () => timestamps.map(
      timestamp => (<div><h3><a href = {`http://localhost:8000/${
      hostname}/flamegraph/${
      timestamp.date}`} target =
      '_blank' rel = 'noreferrer'>
 <Button>{timestamp.date}</Button>
 </a></h3>
      </div>));

  return (
    <div className='timestamps2'>
      <Slider
        nextArrow={<Arrow type='next' />
  }
        dots={false}
        slidesToShow={5}
        slidesToScroll={5}
        autoplay={false}
        autoplaySpeed={3000}
        prevArrow={<Arrow type='prev' />}
      >
        {renderSlides()}
      </Slider>
    </div>
  );
}
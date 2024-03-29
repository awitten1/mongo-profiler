
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import axios from 'axios';
import React from 'react';
import Slider from 'react-slick';
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

function SampleNextArrow(props) {
  const {className, style, onClick} = props;
  return (
    <div
  className = {className} style = {
    { ...style, background: 'black' }}
      onClick={
    onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={
        {...style, background: 'black' }}
      onClick={onClick}
    />
  );
}

export default function Timestamps2(props) {
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

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerPadding: '100px',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  timestamps.map(timestamp => {
    var temp = new Date(timestamp.date);
    console.log(temp.toString().slice(0, 25))
  });


  const renderSlides = () => timestamps.map(
      timestamp => (<div><h3>
                    <a href = {`http://localhost:8000/${hostname}/flamegraph/${
                         timestamp.date}`} target = '_blank' rel = 'noreferrer'>
                    <Button>{new Date(timestamp.date).toString().slice(0, 25) +
                             '(EST)'}</Button>
</a></h3>
    </div>));

  return (<div className = 'timestamps2'>
          <Slider{...settings}>{renderSlides()}</Slider>
  </div>);
}
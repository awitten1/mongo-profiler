import axios from 'axios';
import React, {Component} from 'react';
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

class Hostnames extends Component {
  constructor(props) {
    super(props);
    this.state = {hostnames: [], isLoaded: false};
  }

  componentDidMount() {
    axios
        .get(
            'http://localhost:8000/hostnames',
            {headers: {'Access-Control-Allow-Origin': '*'}})
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.setState({hostnames: res.data.hostnames, isLoaded: true});
        })
  }

  render() {
    const {hostnames, isLoaded} = this.state;
    /*if (!isLoaded) {
        return <div>Loading...</div>;
    }*/
    return (<div><ul>{hostnames.map(
        (hostname) =>
            <a href = {`http://localhost:3000/${hostname}`} target =
                 '_blank' rel = 'noreferrer'>
        <Button>{hostname}</Button>
        </a>)}</ul>
          </div>);
  }
}

export default Hostnames;
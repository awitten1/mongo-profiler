import React, { setState } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
const axios = require('axios');

class Sample extends React.Component {
    render() {
      return (
        <button className="square">
          {this.props.ts}
        </button>
      );
    }
}

class NodeTL extends React.Component {
    renderSquare(ts) {
        return <Sample ts={ts} />;
    }

    constructor(props) {
        super(props)
        this.state = {hostnames: [], isLoaded: false}
    }

    componentDidMount() {
        axios.get("http://localhost:8000/hostnames", {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then((res)=>{
            console.log(res);
            console.log(res.data);
            this.setState({hostnames: res.data.hostnames,  isLoaded: true});
        })
    }

    render() {
        const { hostnames, isLoaded } = this.state;
        /*if (!isLoaded) {
            return <div>Loading...</div>;
        }*/
        console.log(hostnames)
        return hostnames.map((hostname) => <li>{hostname}</li>);
        /*return (
        <ul>
        {
          this.state.hostnames
          .map(hostname =>
            <li>{hostname.name}</li>
          )
        }
      </ul>
      );*/
        /*return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );*/
    }
}

class AllNodesTL extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <NodeTL />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  // ========================================

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<AllNodesTL />);

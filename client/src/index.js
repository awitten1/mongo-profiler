import React from 'react';
import ReactDOM from 'react-dom/client';
const axios = require('axios');

import './index.css';

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

    render() {
        const status = 'Next player: X';

        return (
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
        );
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

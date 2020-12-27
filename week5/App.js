import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import Chart from './chart.js'

class App extends Component {
  render() {
    return (
        <div className="chart-area">
          <Chart />
        </div>
    )
  }
}

export default App;

import React, { Component } from 'react';
import './LoadingIndicator.css';

export default class LoadingIndicator extends Component {
  render() {
    return (
        <div className="loading-indicator">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
        </div>
    );
  }
}

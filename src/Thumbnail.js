import React, { Component } from 'react';

export default class Thumbnail extends Component {
  render() {
    return (
        <div className="thumbnail">
            <img src={this.props.image} alt={this.props.title} />
        </div>
    );
  }
}

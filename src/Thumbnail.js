import React, { Component } from 'react';

export default class Thumbnail extends Component {
  render() {
    return (
        <div className="thumbnail" onClick={() => this.props.openLightbox(this.props.image)}>
            <img 
                src={this.props.image.image} 
                alt={this.props.image.title} 
                className={this.props.image.landscape && "landscape"} />
        </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Thumbnail extends Component {
  render() {
    return (
        <div className="thumbnail" onClick={() => this.props.openLightbox(this.props.image)}>
            <img
                src={this.props.image.src}
                alt={this.props.image.title}
                className={this.props.image.landscape && 'landscape'}
            />
        </div>
    );
  }
}

Thumbnail.propTypes = {
  image: PropTypes.object.isRequired,
  openLightbox: PropTypes.func.isRequired
};

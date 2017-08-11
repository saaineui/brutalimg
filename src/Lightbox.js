import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleVisible: false
    };

    this.toggleTitle = this.toggleTitle.bind(this);
  }

  toggleTitle() {
    let titleVisible = this.state.titleVisible;
    this.setState({titleVisible: !titleVisible});
  }

  render() {
    return (
      <div id="lightbox"
           className={this.props.currentImageLarge && 'fit-on-screen'}
           style={{backgroundImage: 'url(' + this.props.image.src + ')'}}
      >
          {this.props.hasPreviousImage &&
          <nav id="prev" onClick={this.props.viewPreviousImage}>
              <svg className="lightbox-icon" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="0" x2="0" y2="12" />
                  <line x1="0" y1="12" x2="48" y2="12" />
              </svg>
              Previous
          </nav>
          }
          {this.props.hasNextImage &&
          <nav id="next" onClick={this.props.viewNextImage}>
              <svg className="lightbox-icon" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">
                  <line x1="36" y1="0" x2="48" y2="12" />
                  <line x1="0" y1="12" x2="48" y2="12" />
              </svg>
              Next
          </nav>
          }
          <div id="image-title" onClick={this.toggleTitle}>
              {this.state.titleVisible ?
                  this.props.image.title
                  :
                  <div aria-label="View info" className="info-icon" title="View info">i</div>
              }
          </div>
          <nav id="close" onClick={this.props.closeLightbox}>
              <svg className="lightbox-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="24" y2="24" />
                  <line x1="0" y1="24" x2="24" y2="0" />
              </svg>
              Close
          </nav>
      </div>
    );
  }
}

Lightbox.propTypes = {
  currentImageLarge: PropTypes.bool.isRequired,
  image: PropTypes.object.isRequired,
  hasNextImage: PropTypes.bool.isRequired,
  hasPreviousImage: PropTypes.bool.isRequired,
  viewNextImage: PropTypes.func.isRequired,
  viewPreviousImage: PropTypes.func.isRequired,
  closeLightbox: PropTypes.func.isRequired
};

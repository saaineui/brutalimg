import React, { Component } from 'react';

export default class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleVisible: false
    };
  }
  
  render() {
    return (
        <div id="lightbox" style={{backgroundImage: 'url('+this.props.currentImage.image+')'}}>
            <nav id="prev">
                <svg className="lightbox-icon" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="0" x2="0" y2="12" />
                    <line x1="0" y1="12" x2="48" y2="12" />
                </svg> 
                Previous
            </nav>
            <nav id="next">
                <svg className="lightbox-icon" viewBox="0 0 48 13" xmlns="http://www.w3.org/2000/svg">
                    <line x1="36" y1="0" x2="48" y2="12" />
                    <line x1="0" y1="12" x2="48" y2="12" />
                </svg> 
                Next
            </nav>
            <div id="image-title">
                {this.state.titleVisible ?
                    this.props.currentImage.title
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

import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Slack - Lightbox - SS</h1>
        <h2>&ldquo;brutalism&rdquo;</h2>
    
        <div id="thumbnails" className="clearfix">
        </div>
    
        <div aria-hidden="true" id="errors">
            We're sorry, images can not be loaded right now. Please wait and try again.
        </div>
    
        <div><button id="more-images" className="btn">+ More Images</button></div>
    
        <div aria-hidden="true" id="lightbox">
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
                <span aria-hidden="true"></span>
                <div aria-label="View info" className="info-icon" title="View info">i</div>
            </div>
            <nav id="close">
                <svg className="lightbox-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="0" x2="24" y2="24" />
                    <line x1="0" y1="24" x2="24" y2="0" />
                </svg> 
                Close
            </nav>
        </div>
    </div>
    );
  }
}

export default App;

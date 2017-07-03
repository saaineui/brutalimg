import React, { Component } from 'react';
import Thumbnail from './Thumbnail';
import './App.css';

const thumbnails = [{image: "https://s-media-cache-ak0.pinimg.com/736x/82/57/a2/8257a2128cca2cbe64af5d71122d6ffa--brutalism-portsmouth.jpg", title: "image 1"}, {image: "https://s-media-cache-ak0.pinimg.com/originals/ae/dd/16/aedd16ebd17785abf47c60065e206728.jpg", title: "image 2"}]
const renderThumbnails = thumbnails.map((thumbnail, index) =>
  <Thumbnail key={index} image={thumbnail.image} title={thumbnail.title} />
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>SS Lightbox - React</h1>
        <h2>&ldquo;{this.props.search_term}&rdquo;</h2>
    
        <div id="thumbnails" className="clearfix">
            {renderThumbnails}
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

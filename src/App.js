import React, { Component } from 'react';
import Thumbnail from './Thumbnail';
import Lightbox from './Lightbox';
import './App.css';

const GCSE_URI = 'https://www.googleapis.com/customsearch/v1';
const GCSE_CX = 'redacted';
const GCSE_KEY = 'redacted';

var query_params = ['searchType=image'];
query_params.push('key='+GCSE_KEY);
query_params.push('cx='+GCSE_CX);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightboxVisible: false,
      moreImagesBtnVisible: true,
      errorMessageVisible: false,
      currentImage: {image: "", title: "title"},
      startIndex: 1,
      images: []
    };
      
    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.moreImages = this.moreImages.bind(this);
  }
    
  openLightbox(image) {
    this.setState({lightboxVisible: true, currentImage: image});
  }
    
  closeLightbox() {
    this.setState({lightboxVisible: false});
  }
  
  moreImages() {
     var temp_query_params = query_params;
     temp_query_params.push('q='+this.props.searchTerm);
     temp_query_params.push('start='+this.state.startIndex);      
     var self = this;

     var request = new XMLHttpRequest();
     request.open('GET', GCSE_URI+'?'+temp_query_params.join('&'), true);

     request.onload = function() {
         if (request.status >= 200 && request.status < 400) {
             var image_results = JSON.parse(request.responseText);
         
             if (image_results.items) {
                 self.setState({images: self.state.images.concat(self.formatImageResults(image_results.items))})
                 
                 if (image_results.queries.nextPage && image_results.queries.nextPage[0].startIndex) 
                     self.setState({startIndex: image_results.queries.nextPage[0].startIndex});
                 else
                     self.setState({moreImagesBtnVisible: false});
             } else {
                 self.show_error_and_autofade();
             }
         
         } else {
             self.show_error_and_autofade();
         }
     };

     request.onerror = () => self.show_error_and_autofade();
     request.send();
  }
    
  formatImageResults(items) {
      var images = [];
      
      items.forEach(function(item){
          var image = {image: item.link, title: item.title, landscape: item.image.height < item.image.width};
          images.push(image);
      });
      return images;
  }
    
  show_error_and_autofade() {
      console.log("api error");
  }
    
  render() {
    var renderThumbnails = this.state.images.map((image, index) =>
      <Thumbnail key={index} image={image} openLightbox={this.openLightbox} />
    )
    
    return (
      <div className="App">
        <h1>SS Lightbox - React</h1>
        <h2>&ldquo;{this.props.searchTerm}&rdquo;</h2>
    
        <div id="thumbnails" className="clearfix">
            {renderThumbnails}
        </div>
    
        {this.state.errorMessageVisible &&
            <div id="errors">
                We're sorry, images can not be loaded right now. Please wait and try again.
            </div>
        }
    
        {this.state.moreImagesBtnVisible &&
            <div><button id="more-images" className="btn" onClick={this.moreImages}>+ More Images</button></div>
        }
        {this.state.lightboxVisible && 
            <Lightbox currentImage={this.state.currentImage} closeLightbox={this.closeLightbox} />
        }
    </div>
    );
  }
}

export default App;

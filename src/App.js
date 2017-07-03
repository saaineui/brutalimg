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

  function formatImageResults(items) {
      var images = [];
      
      items.forEach(function(item, index){
          var image = {key: index, image: item.link, title: item.title, landscape: item.image.height < item.image.width};
          images.push(image);
      });
      return images;
  }
    


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightboxVisible: false,
      moreImagesBtnVisible: true,
      errorMessageVisible: false,
      currentImageIndex: null,
      startIndex: 1,
      images: []
    };
      
    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.viewPreviousImage = this.viewPreviousImage.bind(this);
    this.viewNextImage = this.viewNextImage.bind(this);
    this.moreImages = this.moreImages.bind(this);
  }
    
  componentDidMount() {
      this.moreImages();
  }
    
  openLightbox(image) {
    this.setState({lightboxVisible: true, currentImageIndex: image.key});
  }
    
  closeLightbox() {
    this.setState({lightboxVisible: false});
  }
    
  viewPreviousImage() {
    this.setState({currentImageIndex: this.state.currentImageIndex-1});
  }
  
  viewNextImage() {
    this.setState({currentImageIndex: this.state.currentImageIndex+1});
  }
  
  moreImages() {
     if (this.state.errorMessageVisible)
         this.setState({errorMessageVisible: false});
      
     var temp_query_params = [].concat(query_params);
     temp_query_params.push('q='+this.props.searchTerm);
     temp_query_params.push('start='+this.state.startIndex.toString());
     var self = this;

     var request = new XMLHttpRequest();
     request.open('GET', GCSE_URI+'?'+temp_query_params.join('&'), true);
     request.onload = function() {
         if (request.status >= 200 && request.status < 400) {
             var image_results = JSON.parse(request.responseText);
         
             if (image_results.hasOwnProperty("items")) {
                 var images = self.state.images.concat(formatImageResults(image_results.items));
                 var hasNextPageStartIndex = image_results.hasOwnProperty("queries") && image_results.queries.hasOwnProperty("nextPage") && image_results.queries.nextPage.length > 0 && image_results.queries.nextPage[0].hasOwnProperty("startIndex");
                 var startIndex = hasNextPageStartIndex ? image_results.queries.nextPage[0].startIndex : self.state.startIndex;
                 
                 self.setState({images: images, startIndex: startIndex, moreImagesBtnVisible: hasNextPageStartIndex});
             } else {
                 self.show_error_message();
             }       
         } else {
             self.show_error_message();
         }
     };
     request.onerror = () => self.show_error_message();
     request.send();
  }
    
  show_error_message() {
    this.setState({errorMessageVisible: false});
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
                We&rsquo;re sorry, images can not be loaded right now. Please wait and try again.
            </div>
        }
    
        {this.state.moreImagesBtnVisible &&
            <div><button id="more-images" className="btn" onClick={this.moreImages}>+ More Images</button></div>
        }
        {this.state.lightboxVisible && 
            <Lightbox 
                image={this.state.images[this.state.currentImageIndex]} 
                viewNextImage={this.viewNextImage}
                viewPreviousImage={this.viewPreviousImage}
                closeLightbox={this.closeLightbox} 
                hasNextImage={this.state.currentImageIndex < this.state.images.length-1}
                hasPreviousImage={this.state.currentImageIndex > 0}
            />
        }
    </div>
    );
  }
}

export default App;

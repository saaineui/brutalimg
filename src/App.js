import React, { Component } from 'react';
import Thumbnail from './Thumbnail';
import Lightbox from './Lightbox';
import LoadingIndicator from './LoadingIndicator';
import './App.css';

var sjcl = require("sjcl");

const GCSE_URI = 'https://www.googleapis.com/customsearch/v1';
const GCSE_CX = sjcl.codec.utf8String.fromBits([808466488, 842347571, 925971250, 859257138, 925905975, 960128108, 1970878063, 1802266471, 8798055956480]); 
const GCSE_KEY = sjcl.codec.utf8String.fromBits([1095334497, 1400456275, 1934640474, 1162368360, 1514432111, 1196963688, 1800761931, 929510723, 1417114183, 26389423142912]); 

var query_params = ['searchType=image'];
query_params.push('key='+GCSE_KEY);
query_params.push('cx='+GCSE_CX);

var Promise = require("bluebird");
Promise.config({ longStackTraces: true, warnings: true });

    function is_larger_than_window(img) {
        return (img.naturalHeight > window.innerHeight) || (img.naturalWidth > window.innerWidth);
    }

    function ajaxGetAsync(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("error", () => reject(new Error("Could not connect to GCSE")));
            xhr.addEventListener("load", resolve);
            xhr.open("GET", url);
            xhr.send(null);
        });
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
      images: [],
      currentImageLarge: false, 
      searching: false
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
    this.viewInLightbox(image.key);
  }
    
  closeLightbox() {
    this.setState({lightboxVisible: false});
  }
    
  viewPreviousImage() {
    this.viewInLightbox(this.state.currentImageIndex-1);
  }
  
  viewNextImage() {
    this.viewInLightbox(this.state.currentImageIndex+1);
  }
    
  viewInLightbox(imageIndex) {
      var self = this;
      this.setState({lightboxVisible: true, currentImageIndex: imageIndex}, () => self.shrinkLargeImage());
  }
    
  shrinkLargeImage() {
      var currentImage = this.thumbnailsDiv.children[this.state.currentImageIndex].children[0];
      this.setState({currentImageLarge: is_larger_than_window(currentImage)});
  }
    
  hasSearchTerm() {
      return this.props.searchTerm !== "";
  }
    
  moreImages() {
    if (this.hasSearchTerm()) {
     this.setState({errorMessageVisible: false, searching: true});
     var temp_query_params = [].concat(query_params);
     temp_query_params.push('q='+this.props.searchTerm);
     temp_query_params.push('start='+this.state.startIndex.toString());
     var self = this;

     ajaxGetAsync(GCSE_URI+'?'+temp_query_params.join('&'))
     .then(function(e){
         return e.currentTarget;
     })
     .then(function(xhr){
         return xhr.responseText;
     })
     .then(JSON.parse)
     .then(function(image_results){
            self.addImagesAndUpdateState(image_results.items);
                 
            var hasNextPageStartIndex = image_results.hasOwnProperty("queries") &&     
                                        image_results.queries.hasOwnProperty("nextPage") && 
                                        image_results.queries.nextPage.length > 0 && 
                                        image_results.queries.nextPage[0].hasOwnProperty("startIndex");
            var startIndex = hasNextPageStartIndex ? image_results.queries.nextPage[0].startIndex : self.state.startIndex;
            self.setState({startIndex: startIndex, moreImagesBtnVisible: hasNextPageStartIndex});
     })
     .catch(Error, function(e) {
         console.error(e.message);
         self.show_error_message();
     })
     .finally(function(){
         self.setState({searching: false});
     });
    }
  }
    
  addImagesAndUpdateState(items) {
      var images = this.state.images;      
      items.forEach(function(item){
          var image = {key: images.length, image: item.link, title: item.title, landscape: item.image.height < item.image.width};
          images.push(image);
      });
      
      this.setState({images: images});
  }
    
  show_error_message() {
    this.setState({errorMessageVisible: true});
  }
    
  render() {
    var renderThumbnails = this.state.images.map((image, index) =>
      <Thumbnail key={index} image={image} openLightbox={this.openLightbox} />
    )
    
    return (
      <div className="App">
        <h1><a href="/">brutalimg</a></h1>
        <h2>brutally simple image search</h2>
        {this.hasSearchTerm() &&
            <h3>&ldquo;{this.props.searchTerm}&rdquo;</h3>
        }
    
        <div id="thumbnails" className="clearfix" ref={(thumbnailsDiv) => { this.thumbnailsDiv = thumbnailsDiv; }}>
            {renderThumbnails}
        </div>
    
        {this.state.errorMessageVisible &&
            <div id="errors">
                We&rsquo;re sorry, images can not be loaded right now. Please wait and try again.
            </div>
        }

        {this.state.searching && <LoadingIndicator />}
    
        {this.state.moreImagesBtnVisible && this.hasSearchTerm() && !this.state.searching &&
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
                currentImageLarge={this.state.currentImageLarge}
            />
        }
        <form className="search-form" method="get">
            <label htmlFor="searchTerm">
                Search for images related to: 
                <input type="text" name="searchTerm" />
                <input type="submit" value="Search" className="btn" />
            </label>
        </form>
    </div>
    );
  }
}

export default App;

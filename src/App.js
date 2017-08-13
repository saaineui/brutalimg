import React, { Component } from 'react';
import Thumbnail from './Thumbnail';
import Lightbox from './Lightbox';
import LoadingIndicator from './LoadingIndicator';
import * as utils from './utils';
import './App.css';
import PropTypes from 'prop-types';

const Promise = require('bluebird');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightboxVisible: false,
      moreImagesBtnVisible: false,
      errorMessageVisible: false,
      currentImageIndex: null,
      queryParams: utils.buildQueryParams().concat('q=' + props.searchTerm),
      startIndex: 1,
      images: [],
      currentImageLarge: false,
      searching: false
    };

    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.viewPreviousImage = this.viewPreviousImage.bind(this);
    this.viewNextImage = this.viewNextImage.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.hasSearchTerm() && this.search();
  }

  hasSearchTerm() {
    return (typeof this.props.searchTerm === 'string') && this.props.searchTerm !== '';
  }

  search() {
    this.setState({ moreImagesBtnVisible: false, errorMessageVisible: false, searching: true });
    let query_params = this.state.queryParams.slice(0);
    query_params.push('start=' + this.state.startIndex.toString());

    var self = this;

    utils.ajaxGetAsync(Promise, this.props.apiURI + '?' + query_params.join('&'))
      .then(e => e.currentTarget)
      .then(xhr => xhr.responseText)
      .then(JSON.parse)
      .then((search_results) => {
        self.addImagesAndUpdateState(search_results.items);
        utils.updateStartIndex(search_results) &&
          self.setState({ startIndex: search_results.queries.nextPage[0].startIndex, moreImagesBtnVisible: true });
      })
      .catch(Error, (e) => {
        console.error(e.message);
        self.showErrorMessage();
        self.hasMoreImages() && self.setState({ moreImagesBtnVisible: true });
      })
      .finally(() => { self.setState({ searching: false }); });
  }

  addImagesAndUpdateState(items) {
    var images = this.state.images.concat(items.map((item, index) => {
      return {
        index: this.state.images.length + index,
        src: item.link,
        title: item.title,
        landscape: item.image.height < item.image.width
      };
    }));

    this.setState({ images: images });
  }

  showErrorMessage() {
    this.setState({ errorMessageVisible: true });
  }

  hasMoreImages() {
    return this.state.startIndex > this.state.images.length;
  }

  hasNextImage() {
    return this.hasCurrentImageIndex() &&
      this.state.currentImageIndex < this.state.images.length - 1;
  }

  hasPreviousImage() {
    return this.hasCurrentImageIndex() && this.state.currentImageIndex > 0;
  }

  hasCurrentImageIndex() {
    return typeof this.state.currentImageIndex === 'number';
  }

  openLightbox(image) {
    this.viewInLightbox(image.index);
  }

  closeLightbox() {
    this.setState({ lightboxVisible: false });
  }

  viewPreviousImage() {
    this.viewInLightbox(this.state.currentImageIndex - 1);
  }

  viewNextImage() {
    this.viewInLightbox(this.state.currentImageIndex + 1);
  }

  viewInLightbox(imageIndex) {
    var self = this;
    this.setState({ lightboxVisible: true, currentImageIndex: imageIndex }, () => self.shrinkLargeImage());
  }

  shrinkLargeImage() {
    var currentImage = this.thumbnailsDiv.children[this.state.currentImageIndex].children[0];
    this.setState({ currentImageLarge: utils.largerThanWindow(currentImage) });
  }

  render() {
    var renderThumbnails = this.state.images.map((image, index) =>
      <Thumbnail key={index} image={image} openLightbox={this.openLightbox} />
    );

    return (
      <div className="App">
        <h1><a href="/">brutalimg</a></h1>
        <h2>brutally simple image search</h2>
        {this.hasSearchTerm() && <h3>&ldquo;{this.props.searchTerm}&rdquo;</h3>}

        <div id="thumbnails" className="clearfix" ref={(thumbnailsDiv) => { this.thumbnailsDiv = thumbnailsDiv; }}>
            {renderThumbnails}
        </div>

        {this.state.errorMessageVisible &&
            <div id="errors">
                We&rsquo;re sorry, images can not be loaded right now. Please wait and try again.
            </div>
        }

        {this.state.searching && <LoadingIndicator />}

        {this.state.moreImagesBtnVisible &&
            <div><button id="more-images" className="btn" onClick={this.search}>+ More Images</button></div>
        }

        {this.state.lightboxVisible &&
            <Lightbox
                image={this.state.images[this.state.currentImageIndex]}
                viewNextImage={this.viewNextImage}
                viewPreviousImage={this.viewPreviousImage}
                closeLightbox={this.closeLightbox}
                hasNextImage={this.hasNextImage()}
                hasPreviousImage={this.hasPreviousImage()}
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

App.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  apiURI: PropTypes.string.isRequired
};

export default App;

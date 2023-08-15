import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import fetchImages from '../Services/fetchImages';

import { ImageGallery } from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    images: [],
    page: '',
    searchQuery: '',
    per_page: 12,
    isLoading: false,
    loadMore: false,
    error: null,
    showModal: false,
    largeImageURL: 'largeImageURL',
    id: '',
  };

  componentDidUpdate(_, prevState) {
    const { searchQuery, page } = this.state;
    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.getImages(searchQuery, page);
    }
  }

  formSubmit = searchQuery => {
    this.setState({
      searchQuery,
      images: [],
      page: 1,
      loadMore: false,
    });
  };

  getImages = async (searchQuery, page) => {
    this.setState({ isLoading: true });
    if (!searchQuery) {
      return;
    }
    try {
      const { hits, totalHits } = await fetchImages(searchQuery, page);
      const normalizedImages = hits.map(
        ({ id, webformatURL, largeImageURL, tags }) => {
          return {
            id,
            webformatURL,
            largeImageURL,
            tags,
          };
        }
      );

      if (totalHits === 0) {
        alert('Oops! We have no images');
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...normalizedImages],
        loadMore: this.state.page < Math.ceil(totalHits / this.state.per_page),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };
  onloadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = largeImageURL => {
    this.setState({
      showModal: true,
      largeImageURL: largeImageURL,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      largeImageURL: null,
    });
  };

  render() {
    const { images, isLoading, loadMore, page, showModal, largeImageURL } =
      this.state;

    return (
      <div>
        <Searchbar onSubmit={this.formSubmit} />
        <Loader isLoading={isLoading} />
        <ImageGallery images={images} openModal={this.openModal} />
        {loadMore && <Button onloadMore={this.onloadMore} page={page} />}
        {showModal && (
          <Modal largeImageURL={largeImageURL} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

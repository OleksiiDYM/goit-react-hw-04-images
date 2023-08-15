import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import fetchImages from '../Services/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('largeImageURLmayBe');
  const per_page = 12;

  useEffect(() => {
    getImages(searchQuery, page);
  }, [searchQuery, page]);

  const getImages = async (searchQuery, page) => {
    if (!searchQuery) {
      return;
    }
    try {
      const { hits, totalHits } = await fetchImages(searchQuery, page);
      setIsLoading(true);
      setIsLoading(true);
      if (totalHits === 0) {
        alert('Oops! We have no images');
      }
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
      setImages(prevImages => [...prevImages, ...normalizedImages]);
      setLoadMore(page < Math.ceil(totalHits / per_page));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
    setLoadMore(false);
  };

  const onloadMore = () => {
    setIsLoading(true);
    setPage(prevPage => prevPage + 1);
  };

  const openModal = (largeImageURL, tags) => {
    console.log(largeImageURL);
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={formSubmit} />
      <Loader isLoading={isLoading} />
      <ImageGallery images={images} openModal={openModal} />
      {loadMore && <Button onloadMore={onloadMore} page={page} />}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </div>
  );
};
export default App;

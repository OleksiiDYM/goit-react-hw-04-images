// import { Component } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

// export class Modal extends Component {
export const Modal = ({ largeImageURL, onClose, tags }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  // componentDidMount() {
  //   window.addEventListener('keydown', this.handleKeyDown);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.handleKeyDown);
  // }
  const handleKeyDown = event => {
    console.log(event.code);
    if (event.code === 'Escape') {
      onClose();
    }
  };
  // handleKeyDown = event => {
  //   const codeKey = event.code;
  //   console.log(codeKey);
  //   if (event.code === 'Escape') {
  //     this.props.onClose();
  //   }
  // };
  const handleBackDropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
  // handleBackDropClick = event => {
  //   if (event.currentTarget === event.target) {
  //     this.props.onClose();
  //   }
  // };

  // render() {
  return createPortal(
    <div className="Overlay" onClick={handleBackDropClick}>
      <div className="Modal">
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>,
    modalRoot
  );
};
// }

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  largeImageUrl: PropTypes.string,
};

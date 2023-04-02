import React, { useState } from 'react';
import styled from '@emotion/styled';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  min-height: 150px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #43a047;
  }
`;

const CloseButton = styled(Button)`
  background-color: #f44336;
  color: white;

  &:hover {
    background-color: #d32f2f;
  }
`;

const UploadDeckModal = ({ onSubmit, onClose }) => {
  const [commander, setCommander] = useState('');
  const [deckList, setDeckList] = useState('');

  const handleUpload = () => {
    const parsedCommander = parseCommander(commander);
    const parsedDeckList = parseDeckList(deckList);
    onSubmit({ commander: parsedCommander, deckList: parsedDeckList });
  };
  
  const parseCommander = (inputCommander) => {
    const match = inputCommander.match(/^\d*\s*(.*)$/);
    if (match) {
      return match[1];
    }
    return inputCommander;
  };
  

  const parseDeckList = (list) => {
    const lines = list.split('\n');
    const cards = [];
    lines.forEach((line) => {
      const match = line.match(/^(\d*)\s*(.*)$/);
      if (match) {
        const [, count, card] = match;
        const parsedCount = count ? parseInt(count, 10) : 1;
        for (let i = 0; i < parsedCount; i++) {
          cards.push(card);
        }
      }
    });
    return cards;
  };
  

  return (
    <Modal>
      <h2>Upload Deck</h2>
      <label htmlFor="commander">Commander</label>
      <Input
        type="text"
        id="commander"
        placeholder="Commander"
        value={commander}
        onChange={(e) => setCommander(e.target.value)}
      />
      <label htmlFor="deck-list">Deck List</label>
      <TextArea
        id="deck-list"
        placeholder="Deck List"
        value={deckList}
        onChange={(e) => setDeckList(e.target.value)}
      />
      <div>
        <SubmitButton onClick={handleUpload}>Submit</SubmitButton>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </div>
    </Modal>
  );  
};

export default UploadDeckModal;

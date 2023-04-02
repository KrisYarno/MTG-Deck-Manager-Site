import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import api from '../api';
import NavigationMenu from './NavigationMenu';
import UploadDeckModal from './UploadDeckModal';


const CreateDeckContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 20px;
`;

const DeckNameInput = styled.input`
  font-size: 1.1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 50%;
`;

const SearchBar = styled.input`
  font-size: 1.1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 50%;
`;

const SearchResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchResultImage = styled.img`
  width: 30%;
`;

const SearchResultButtons = styled.div`
  display: flex;
`;

const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 2px;
  cursor: pointer;
  border-radius: 5px;
`;

const DeckList = styled.div`
display: grid;
grid-template-columns: repeat(9, 1fr);
grid-auto-rows: min-content;
gap: 0.5vw;
font-size: 1vw;
padding-left: 10vw;
padding-right: 10vw;
`;

const DeckListItem = styled.div`
display: flex;
align-items: center;
justify-content: center;
background-color: #E0E0E0;
border-radius: 4px;
border: 1px solid #ccc;
padding: 0.5vw;
text-align: center;
word-wrap: break-word;
overflow-wrap: break-word;
cursor: pointer;
`;

const SaveDeckButton = styled.button`
background-color: #007bff;
border: none;
color: white;
padding: 0.5rem 1rem;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 1rem;
margin: 1rem 2px;
cursor: pointer;
border-radius: 5px;
`;

const UploadDeckButton = styled.button`
background-color: #007bff;
border: none;
color: white;
padding: 0.5rem 1rem;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 1rem;
margin: 1rem 2px;
cursor: pointer;
border-radius: 5px;
`;

const RemoveCardPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const RemoveCardContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CreateDeck = ({ userId }) => {
  const [deckName, setDeckName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [commander, setCommander] = useState('');
  const [deckList, setDeckList] = useState([]);
  const [removeCardPopup, setRemoveCardPopup] = useState({ visible: false, index: null });
  const [showModal, setShowModal] = useState(false);

  const handleUploadSubmit = ({ commander: newCommander, deckList: newDeckList }) => {
    setCommander(newCommander);
    setDeckList(newDeckList);
    setShowModal(false);
  };

  useEffect(() => {
    if (searchQuery) {
      const fetchAutocompleteSuggestions = async () => {
        const response = await axios.get(
          `https://api.scryfall.com/cards/autocomplete?q=${searchQuery}`,
        );
        setSearchResults(response.data.data);
      };

      fetchAutocompleteSuggestions();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const saveDeckToDatabase = async (deckName, commander, deckList) => {
    try {
      const response = await api.post('/decks', {
        userId,
        name: deckName,
        commander,
        deckList,
      });
      console.log('Deck saved to database:', response.data);
      alert('Deck saved to database:' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error saving deck to database:', error);
      alert('Error saving deck to database:' + error);
    }
  };

  const handleSaveDeck = () => {
    if (deckName === "") {
      alert("Please enter a deck name.");
      return;
    }
  
    saveDeckToDatabase(deckName, commander, deckList);
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      setSearchQuery(searchResults[0]);
    }
  };

  const handleAddToDeck = (cardName) => {
    if (commander && deckList.length >= 99) {
      alert('You already have 100 cards!');
    } else {
      setDeckList((prevDeckList) => [...prevDeckList, cardName]);
    }
  };

  const handleSetAsCommander = (cardName) => {
    setCommander(cardName);
  };

  const handleRemoveCommander = () => {
    setCommander('');
  };


  const handleRemoveCardClick = (index) => {
    setRemoveCardPopup({ visible: true, index });
  };

  const handleRemoveCardConfirm = () => {
    setDeckList((prevDeckList) => prevDeckList.filter((_, i) => i !== removeCardPopup.index));
    setRemoveCardPopup({ visible: false, index: null });
  };

  const handleRemoveCardCancel = () => {
    setRemoveCardPopup({ visible: false, index: null });
  };

  return (
    <CreateDeckContainer>
      <NavigationMenu />
      <h2>Create Deck</h2>
      <DeckNameInput
        type="text"
        placeholder="Deck name"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />
      <SearchBar
        type="text"
        placeholder="Search cards"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyPress}
        list="autocomplete-results"
      />
      <datalist id="autocomplete-results">
        {searchResults.map((result) => (
          <option key={result} value={result} />
        ))}
      </datalist>
      {searchResults.length > 0 && (
        <SearchResult>
          <SearchResultImage
            src={`https://api.scryfall.com/cards/named?exact=${searchResults[0]}&format=image`}
            alt={searchResults[0]}
          />
          <SearchResultButtons>
            <Button onClick={() => handleAddToDeck(searchResults[0])}>
              Add to Deck
            </Button>
            <Button onClick={() => handleSetAsCommander(searchResults[0])}>
              Set as Commander
            </Button>
          </SearchResultButtons>
        </SearchResult>
      )}
      <h3>Commander</h3>
      {commander && (
        <div>
          <span>{commander}</span>
          <Button onClick={handleRemoveCommander}>Remove Commander</Button>
        </div>
      )}
      <DeckList>
        {deckList.map((cardName, index) => (
          <DeckListItem key={`${cardName}-${index}`} onClick={() => handleRemoveCardClick(index)}>
            {cardName}
          </DeckListItem>
        ))}
      </DeckList>
      {removeCardPopup.visible && (
        <RemoveCardPopup onClick={handleRemoveCardCancel}>
          <RemoveCardContent>
            <h4>Remove card?</h4>
            <Button onClick={handleRemoveCardConfirm}>Remove card</Button>
          </RemoveCardContent>
        </RemoveCardPopup>
      )}
      <SaveDeckButton onClick={handleSaveDeck}>Save Deck</SaveDeckButton>
      <UploadDeckButton onClick={() => setShowModal(true)}>Upload Deck</UploadDeckButton>
      {showModal && (
        <UploadDeckModal
          onSubmit={handleUploadSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </CreateDeckContainer>
  );
};

export default CreateDeck;

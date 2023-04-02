import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import NavigationMenu from './NavigationMenu';
import api from '../api';


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

const DeckListContainer = styled.div`
  max-height: 80vh; // Adjust this value based on your desired maximum height

`;

const DeckList = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-auto-rows: min-content; // Add this line
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

const UpdateDeckButton = styled.button`
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

const DeleteDeckButton = styled.button`
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

const DeckButton = styled.button`
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

const CommanderImageContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
font-size: 20px;
padding-left: 20px;
align-items: center;
justify-content: center
`;

const CommanderNameText = styled.div`
writing-mode: vertical-rl;
text-orientation: mixed;
transform: rotate(180deg);
position: absolute;
padding-left: 285px;
pointer-events: none; // Add this line

`;

const CommanderImage = styled.img`
  width: 250px;
  height: auto;
`;

const CommanderImageOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 20px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(8px);

  &:hover {
    opacity: 1;
  }
`;

const CommanderOverlayText = styled.div`
  color: white;
  font-size: 20px;
  position: absolute;
  text-align: center;
  font-family: Constantia, sans-Serif;
  font-variant: small-caps;

`;



const ModifyDeck = ({ userId }) => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckName, setDeckName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [commander, setCommander] = useState('');
  const [deckList, setDeckList] = useState([]);
  const [removeCardPopup, setRemoveCardPopup] = useState({ visible: false, index: null });
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);


  console.log('User ID in ModifyDeck:', userId);

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

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await api.get(`/decks?userId=${userId}`);
        console.log("Fetched decks:", response.data);
        setDecks(response.data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };
  
    fetchDecks();
  }, [userId]);
  

  const handleDeckClick = (deck) => {
    setSelectedDeck(deck);
    setDeckName(deck.name);
    setCommander(deck.commander);
    setDeckList(deck.deckList);
  };
  

  const updateDeckInDatabase = async (id, updatedDeck) => {
    try {
      const response = await api.put(`/decks/${id}`, updatedDeck);
      console.log('Deck updated in database:', response.data);
      alert('Deck updated in database: ' + JSON.stringify(response.data));
      
      // Refresh the page after the update is successful
      window.location.reload();
    } catch (error) {
      console.error('Error updating deck in database:', error);
      alert('Error updating deck in database: ' + error);
    }
  };
  
  


  const handleUpdateDeck = () => {
    if (!selectedDeck) {
      alert("Please select a deck to update.");
      return;
    }
  
    const updatedDeck = {
      name: deckName,
      commander: commander,
      deckList: deckList,
      userId: userId,
    };
  
    updateDeckInDatabase(selectedDeck._id, updatedDeck);
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck) {
      alert("Please select a deck to delete.");
      return;
    }
  
    try {
      await api.delete(`/decks/${selectedDeck._id}`);
      alert(`Deck '${selectedDeck.name}' has been deleted.`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting deck:", error);
      alert("Error deleting deck: " + error);
    }
  };

  const handleDeleteDeckClick = () => {
    setDeletePopupVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeletePopupVisible(false);
  };
  


  

  return (
    <CreateDeckContainer>
      <NavigationMenu />
      <h2>Modify Deck</h2>
      <ul>
      {decks
  .map((deck) => (
    <DeckButton key={deck._id} onClick={() => handleDeckClick(deck)}>
      {deck.name}
    </DeckButton>
))}
      </ul>
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
      <DeckListContainer>
        <DeckList>
          {deckList.map((cardName, index) => (
            <DeckListItem key={`${cardName}-${index}`} onClick={() => handleRemoveCardClick(index)}>
              {cardName}
            </DeckListItem>
          ))}
        </DeckList>
      </DeckListContainer>
      {commander && (
      <CommanderImageContainer>
        <CommanderImage
          src={`https://api.scryfall.com/cards/named?exact=${commander}&format=image`}
          alt={commander}
        />
        <CommanderImageOverlay onClick={handleRemoveCommander}>
        <CommanderOverlayText>
          <span>Remove Commander?</span>
        </CommanderOverlayText>  
        </CommanderImageOverlay>
        <CommanderNameText>
          <div>
            <span>{commander}</span>
          </div>
          </CommanderNameText>
      </CommanderImageContainer>
    )}
      {removeCardPopup.visible && (
        <RemoveCardPopup onClick={handleRemoveCardCancel}>
          <RemoveCardContent>
            <h4>Remove card?</h4>
            <Button onClick={handleRemoveCardConfirm}>Remove card</Button>
          </RemoveCardContent>
        </RemoveCardPopup>
      )}
 <UpdateDeckButton onClick={handleUpdateDeck}>Update Deck</UpdateDeckButton>
  <DeleteDeckButton onClick={handleDeleteDeckClick}>Delete Deck</DeleteDeckButton>
  {deletePopupVisible && (
    <RemoveCardPopup onClick={handleDeleteCancel}>
      <RemoveCardContent>
        <h4>Are you sure you want to delete this deck?</h4>
        <Button onClick={handleDeleteDeck}>Yes, delete</Button>
        <Button onClick={handleDeleteCancel}>Cancel</Button>
      </RemoveCardContent>
    </RemoveCardPopup>
  )}
    </CreateDeckContainer>
  );
};

export default ModifyDeck;

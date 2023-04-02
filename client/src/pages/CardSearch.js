import React, { useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import NavigationMenu from './NavigationMenu';


const CardSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75%;
  position: relative;
  padding-top: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  outline: none;
`;

const SearchButton = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
`;

const SearchResultImage = styled.img`
  display: block;
  margin: 1rem auto;
  max-width: 30%;
  height: auto;
  width: calc(50% - 2rem);
`;

const AutocompleteList = styled.ul`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0;
  margin: 0;
  list-style-type: none;
  z-index: 10;
`;

const AutocompleteItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const CardSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [cardImage, setCardImage] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  const handleSearch = async () => {
    const response = await axios.get(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(searchText)}`
    );

    if (response.data && response.data.image_uris) {
      setCardImage(response.data.image_uris.normal);
    } else {
      setCardImage('');
      alert('No card found with the specified name.');
    }
  };

  const handleAutocomplete = async (e) => {
    const input = e.target.value;
    setSearchText(input);

    if (input.length > 2) {
      const response = await axios.get(
        `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(input)}`
      );

      setAutocompleteOptions(response.data.data);
    } else {
      setAutocompleteOptions([]);
    }
  };

  const handleSelectAutocomplete = (option) => {
    setSearchText(option);
    setAutocompleteOptions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && autocompleteOptions.length > 0) {
      setSearchText(autocompleteOptions[0]);
      setAutocompleteOptions([]);
    }
  };

  return (
    <CardSearchContainer>
      <NavigationMenu />
      <SearchWrapper>
        <SearchInput type="text"
        placeholder="Search cards"
        value={searchText}
        onChange={handleAutocomplete}
        onKeyDown={handleKeyPress}
      />
      <SearchButton onClick={handleSearch}>Search</SearchButton>
      {autocompleteOptions.length > 0 && (
        <AutocompleteList>
          {autocompleteOptions.map((option) => (
            <AutocompleteItem
              key={option}
              onClick={() => handleSelectAutocomplete(option)}
            >
              {option}
            </AutocompleteItem>
          ))}
        </AutocompleteList>
      )}
    </SearchWrapper>
    {cardImage && <SearchResultImage src={cardImage} alt={searchText} />}
  </CardSearchContainer>
);

};

export default CardSearch;

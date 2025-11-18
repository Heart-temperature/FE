import { useState } from 'react';
import { CHARACTERS } from '../constants';

/**
 * 캐릭터 슬라이더 훅
 * @param {string} initialCharacter - 초기 캐릭터 ID
 * @returns {Object} 캐릭터 관련 상태와 함수들
 */
export const useCharacterSlider = (initialCharacter = 'robot') => {
  const [character, setCharacter] = useState(initialCharacter);
  
  const currentIndex = CHARACTERS.findIndex(char => char.id === character);
  
  const nextCharacter = () => {
    const nextIndex = (currentIndex + 1) % CHARACTERS.length;
    setCharacter(CHARACTERS[nextIndex].id);
  };
  
  const prevCharacter = () => {
    const prevIndex = (currentIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
    setCharacter(CHARACTERS[prevIndex].id);
  };

  const setCharacterById = (characterId) => {
    setCharacter(characterId);
  };

  return {
    character,
    currentIndex,
    characters: CHARACTERS,
    nextCharacter,
    prevCharacter,
    setCharacter: setCharacterById
  };
};






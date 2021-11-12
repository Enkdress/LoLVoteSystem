import { useState, useEffect } from "react";
import { Pokemon } from "../../models/models.pokemon";

const generateRandomNumber = () => {
  const min = 1;
  const max = 850;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const usePokemon = () => {
  const [firstPokemon, setFirstPokemon] = useState<Pokemon | null>(null);
  const [secondPokemon, setSecondPokemon] = useState<Pokemon | null>(null);

  const fetchPokemon = async (randomNumber: number) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
    );
    const pokemon = await response.json();

    return pokemon;
  };

  const validateDuplication = () => {
    const setSelectedPokemon = async () => {
      let rn = generateRandomNumber();
      let rn2 = generateRandomNumber();
      do {
        if (rn != rn2) {
          let pokemon1 = await fetchPokemon(rn);
          let pokemon2 = await fetchPokemon(rn2);
          setFirstPokemon(pokemon1);
          setSecondPokemon(pokemon2);
          break;
        }

        // regenerate the number if they are the same
        rn2 = generateRandomNumber();
      } while (rn == rn2);
    };

    setSelectedPokemon();
  };

  useEffect(() => {
    validateDuplication();
  }, []);

  return {
    firstPokemon,
    secondPokemon,
    validateDuplication,
  };
};

export default usePokemon;

import React from "react";
import Image from "next/image";

import { Pokemon } from "../models/models.pokemon";

import styles from "../styles/Champion.module.css";

const Pokemon: React.FC<Props> = ({ pokemon, onVote }) => {
  if (!pokemon) return <h1>Loading...</h1>;

  const dmFrontDefault = pokemon?.sprites.other.dream_world.front_default;
  const hFrontDefault = pokemon?.sprites.other.home.front_default;
  const pokemonImageSrc = dmFrontDefault ? dmFrontDefault : hFrontDefault;

  return (
    <div className={styles.container}>
      <h2 className={styles.capitalize}>{pokemon.name}</h2>
      <Image
        src={pokemonImageSrc}
        alt={pokemon?.name}
        height={dmFrontDefault ? 360 : 200}
        width={220}
      />

      <button
        onClick={() => onVote({ pokemonVoted: pokemon.name })}
        className={styles.voteButton}
      >
        Vote
      </button>

      <div className={styles.stats}>
        <ul>
          {pokemon?.stats
            .filter(
              ({ stat }) =>
                stat.name !== "special-attack" &&
                stat.name !== "special-defense"
            )
            .map((stat, idx) => (
              <li key={idx}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Pokemon;

interface Props {
  pokemon: Pokemon;
  onVote: ({ pokemonVoted }: { pokemonVoted: string }) => void;
}

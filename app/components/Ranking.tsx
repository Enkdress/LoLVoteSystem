import React, { useEffect } from "react";

const Ranking: React.FC<Props> = ({ pokemonPairs, getPairs }) => {
  useEffect(() => {
    getPairs();
  }, []);

  if (!pokemonPairs) return <h1>No voted pokemons</h1>;

  return (
    <>
      <div className="rankingList">
      {pokemonPairs.map((pair, idx) => {
        return (
          <div className="ranking" key={idx}>
            <h2>
              {pair?.pokemonOne}: {pair?.pokemonOneVotes.toString()}
            </h2>
            <h3>VS</h3>
            <h2>
              {pair?.pokemonTwo}: {pair?.pokemonTwoVotes.toString()}
            </h2>
          </div>
        );
      })}
</div>
      <style jsx>
        {`
          .ranking {
            display: flex;
            justify-content: space-around;
          }

          .rankingList {
            max-height: 500px;
            overflow-y: scroll;
          }
        `}
      </style>
    </>
  );
};

export default Ranking;

interface Props {
  pokemonPairs: any[];
  getPairs: () => void;
}

export interface PokemonStats {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface Pokemon {
  id: string;
  name: string;
  front_default: string;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
      home: {
        front_default: string;
      }
    };
  };
  stats: PokemonStats[];
}

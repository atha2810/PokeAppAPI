import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=20"
      );
      const results = response.data.results;
      const detailedData = await Promise.all(
        results.map(async pokemon => {
          const pokemonDetails = await axios.get(pokemon.url);
          return pokemonDetails.data;
        })
      );
      setPokemonList(results);
      setPokemonData(detailedData);
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm === "") {
      fetchPokemonList();
      return;
    }
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      setPokemonData([response.data]);
    } catch (error) {
      console.error("Pokemon not found:", error);
    }
  };

  return (
    <div>
      <h1>PokeAPI Data</h1>
      <input
        type="text"
        placeholder="Search Pokemon"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {pokemonData.map((pokemon, index) => (
          <div
            key={index}
            style={{
              border: "5px solid #ccc",
              display: "flex",
              flexDirection: "column",

              alignContent: "center",
              justifyContent: "center",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px",
              width: "200px",
            }}
          >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

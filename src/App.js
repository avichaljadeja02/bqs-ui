import React, { useState } from 'react';
import '../src/PlayerTable.css';

const PlayerTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
  
    const apiUrl = 'https://baseball-query-searcher.onrender.com/api/search';
    const searchUrl = `${apiUrl}?q=${encodeURIComponent(searchQuery)}`;
  
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <div className="container">
      <h1>Player Search</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Enter search query"
        />
        <button type="submit">Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Player Name</th> {/* Moved "Player Name" to the first column */}
            <th>Year</th>
            <th>Round</th>
            <th>Pick</th>
            <th>Team</th>
            <th>Position</th>
            <th>School</th>
            <th>Type</th>
            <th>State</th>
            <th>Signed</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              {player.map((value, innerIndex) => (
                <td key={innerIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;

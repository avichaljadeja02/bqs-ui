import React, { useState } from 'react';
import '../src/PlayerTable.css';

const PlayerTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'https://baseball-query-searcher.onrender.com/api/search';
    const searchUrl = `${apiUrl}?q=${encodeURIComponent(searchQuery)}`;

    try {
      // Show the loading indicator
      setLoading(true);

      const response = await fetch(searchUrl);
      const data = await response.json();

      // Update the state with the fetched data
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Hide the loading indicator, whether the request succeeds or fails
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <h1>Baseball player searcher</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Enter search query"
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <><p>Results found: {players.length}</p>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Round</th>
                <th>Pick</th>
                <th>Team</th>
                <th>Player Name</th>
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
          </table></>
      )}
    </div>
  );
};

export default PlayerTable;

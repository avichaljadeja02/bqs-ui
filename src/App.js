import React, { useState } from 'react';
import '../src/PlayerTable.css';

const PlayerTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage, setPlayersPerPage] = useState(10);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e, page = 1) => {
    console.log("HEREEEE")
    e.preventDefault();
    const apiUrl = 'https://baseball-query-searcher.onrender.com/api/search';
    const searchUrl = `${apiUrl}?q=${encodeURIComponent(searchQuery)}&page=${page}`;

    try {
      // Show the loading indicator
      setLoading(true);

      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log(data)
      setPlayers(data)
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
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
        <>
          <p>{players.length === 0 ? `No results found :(` : ''}</p>
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
            </thead>            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  {player.map((value, innerIndex) => (
                    <td key={innerIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            {currentPage !== 1 && (
              <button className="pagination-button" onClick={(e) => handleSearchSubmit(e, currentPage - 1)}>
                Previous Page
              </button>
            )}
            {players.length >= playersPerPage && (
              <button className="pagination-button" onClick={(e) => handleSearchSubmit(e, currentPage + 1)}>
                Next Page
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
};

export default PlayerTable;
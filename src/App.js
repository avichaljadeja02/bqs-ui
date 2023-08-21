import React, { useState } from 'react';
import '../src/PlayerTable.css';

const PlayerTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage, setPlayersPerPage] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getSortIcon = (columnName) => {
    if (sortBy === columnName) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const handleColumnSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const headers = [
    'Year',
    'Round',
    'Pick',
    'Team',
    'Player Name',
    'Position',
    'School',
    'Type',
    'State',
    'Signed',
    'Bonus',
  ];


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
                {headers.map((header) => (
                  <th key={header} onClick={() => handleColumnSort(header)}>
                    {header} {getSortIcon(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players
                .slice()
                .sort((a, b) => {
                  if (sortBy) {
                    const aValue = a[headers.indexOf(sortBy)];
                    const bValue = b[headers.indexOf(sortBy)];

                    if (sortOrder === 'asc') {
                      return aValue.localeCompare
                        ? aValue.localeCompare(bValue)
                        : aValue - bValue;
                    } else {
                      return bValue.localeCompare
                        ? bValue.localeCompare(aValue)
                        : bValue - aValue;
                    }
                  }
                  return 0;
                })
                .map((player, index) => (
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
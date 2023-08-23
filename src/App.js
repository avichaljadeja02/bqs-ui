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
  const [total, setTotal] = useState(1);
  const [totalPlayer, setTotalPlayers] = useState(1);

  const [accordionOpen, setAccordionOpen] = useState(true); // Initially open

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

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
    e.preventDefault();
    const apiUrl = 'https://baseball-query-searcher.onrender.com/api/search';
    const searchUrl = `${apiUrl}?q=${encodeURIComponent(searchQuery)}&page=${page}`;

    try {
      setLoading(true);

      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log(data)
      setPlayers(data.data)
      setTotal(data.total_pages)
      setTotalPlayers(data.total_results)
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <h1>Pitch Perfect: Assistant for your best draft pick</h1>
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
          <p>{players && players.length === 0 ? `No results found :(` : ''}</p>
          {players && players.length === 0 && (
                <div> 
                  <h3>Some general instructions are:</h3>
                  <p>If you would like to search on a particular field, try to specify that field eg. Players drafted in the first round</p>
                  <p>If no field is found, the search would be performed on all columns</p>
                  <p>The results are paginated, so if you would like more results (and there are more), you can click on the next page button</p>
                  <p>The columns can be sorted by clicking on the column header</p>
                </div>
          )}
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
              {players && players
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
            {players && players.length >= playersPerPage && (
              <button className="pagination-button next-button" onClick={(e) => handleSearchSubmit(e, currentPage + 1)}>
                Next Page
                <img src="https://cdn-icons-png.flaticon.com/512/44/44567.png" width={20} height={20} alt="Previous Page" />
              </button>
            )}
            {currentPage !== 1 && (
              <button className="pagination-button previous-button" onClick={(e) => handleSearchSubmit(e, currentPage - 1)}>
                <img src="https://cdn-icons-png.flaticon.com/512/44/44897.png" width={20} height={20} alt="Next Page" />
                Previous Page
              </button>
            )}

          </div>
          {players && players.length > 0 && (
            <div className="page-info">
              Page: {currentPage}/{total}
            </div>
          )}
          {players && players.length > 0 && (
            <div className="page-info">
              Total results found : {totalPlayer}
            </div>
          )}
        </>
      )}
    </div>
)};

export default PlayerTable;
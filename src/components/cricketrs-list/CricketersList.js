import React, { useState, useEffect } from 'react';
import './CricketersList.scss';
import getPlayers from '../../service/get-players';
import { CricketersDetails } from '../cricketers-details/CricketersDetails';

const ITEMS_PER_PAGE = 10;

export const CricketersList = () => {
  const [cricketers, setCricketers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [filters, setFilters] = useState(() => {
    const storedFilters = JSON.parse(localStorage.getItem('cricketersFilters'));
    return storedFilters || {
      name: '',
      type: '',
      points: '',
      rank: '',
      dob: '',
    };
  });
  const [selectedCricketer, setSelectedCricketer] = useState(null);
  const [similarPlayers, setSimilarPlayers] = useState([]);

  useEffect(() => {
    const fetchCricketers = async () => {
      const data = await getPlayers();
      setCricketers(data);
    };

    fetchCricketers();
  }, []);

  useEffect(() => {
    localStorage.setItem('cricketersFilters', JSON.stringify(filters));
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(cricketers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCricketers = cricketers
    .filter((cricketer) => {
    
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          const filterValue = filters[key].toLowerCase();
          if (filterValue && !cricketer[key]?.toString().toLowerCase().includes(filterValue)) {
            return false;
          }
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortColumn === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortColumn === 'rank') {
        return sortDirection === 'asc' ? a.rank - b.rank : b.rank - a.rank;
      } else if (sortColumn === 'dob') {
        return sortDirection === 'asc'
          ? new Date(a.dob) - new Date(b.dob)
          : new Date(b.dob) - new Date(a.dob);
      }
      return 0;
    })
    .slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevSortDirection) =>
        prevSortDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };
  const handleCricketerClick = (cricketer) => {
    setSelectedCricketer(cricketer);

    const filteredSimilarPlayers = cricketers.filter(
      (player) => player.type === cricketer.type && player.id !== cricketer.id
    );
    const limitedSimilarPlayers = filteredSimilarPlayers.slice(0, 5);
    setSimilarPlayers(limitedSimilarPlayers);
  };

  const handleBackToCricketers = () => {
    setSelectedCricketer(null);
  };

  return (
    <div className="page-container">
    {selectedCricketer ? (
      <CricketersDetails cricketer={selectedCricketer} similarPlayers={similarPlayers} onBackToCricketers={handleBackToCricketers} />
    ) : (
      <div className="cricketers-list">
        <table>
          <thead>
            <tr>
              <th>
                <div>Name</div>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </th>
              <th>
                <div>Type</div>
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
              </th>
              <th>
                <div>Points</div>
                <input
                  type="text"
                  value={filters.points}
                  onChange={(e) => handleFilterChange('points', e.target.value)}
                />
              </th>
      

<th onClick={() => handleSort('rank')}>
  <div>Rank</div>
  {sortColumn === 'rank' && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      width="10"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sort-icon ${sortDirection === 'asc' ? 'asc' : 'desc'}`}
    >
      {sortDirection === 'asc' ? (
        <path d="M12 4L6 12H18L12 4Z" />
      ) : (
        <path d="M12 20L18 12H6L12 20Z" />
      )}
    </svg>
  )}
  <input
    type="text"
    value={filters.rank}
    onChange={(e) => handleFilterChange('rank', e.target.value)}
  />
</th>

<th onClick={() => handleSort('dob')}>
  <div>DOB</div>
  {sortColumn === 'dob' && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      width="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sort-icon ${sortDirection === 'asc' ? 'asc' : 'desc'}`}
    >
      {sortDirection === 'asc' ? (
        <path d="M19 18L12 5L5 18H19Z" />
      ) : (
        <path d="M5 6L12 19L19 6H5Z" />
      )}
    </svg>
  )}
  <input
    type="text"
    value={filters.dob}
    onChange={(e) => handleFilterChange('dob', e.target.value)}
  />
</th>


            </tr>
          </thead>
          <tbody>
            {currentCricketers.map((cricketer) => (
              <tr key={cricketer.id}>
     
                <td onClick={() => handleCricketerClick(cricketer)} style={{color:"blue",cursor:"pointer"}}>{cricketer.name}</td>
                <td>{cricketer.type}</td>
                <td>{cricketer.points}</td>
                <td>{cricketer.rank}</td>
                <td>{new Date(cricketer.dob).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

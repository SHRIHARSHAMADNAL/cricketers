import React from 'react';
import './CricketersDetails.scss';

export const CricketersDetails = ({ cricketer, similarPlayers, onBackToCricketers }) => {
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(cricketer.dob);

  return (
    <div className="cricketer-details-container">
      <h2>{cricketer.name}</h2>
      <p>{cricketer.description}</p>
      <p>Type: {cricketer.type}</p>
      <p>Points: {cricketer.points}</p>
      <p>Rank: {cricketer.rank}</p>
      <p>Date of Birth: {new Date(cricketer.dob).toLocaleDateString()}</p>
      <p>Age: {age}</p>

      <h3>Similar Players</h3>
      <table className="similar-players-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {similarPlayers.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.points}</td>
              <td>{player.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onBackToCricketers}>Back to Cricketers</button>
    </div>
  );
};

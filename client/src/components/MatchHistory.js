import React, { useEffect, useState } from 'react';
import axios from 'axios';
import championImageMap from '../utility/championImageMap'; // Adjust the path as needed
import './MatchHistory.css';

const MatchHistory = ({ puuid }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatchIds = async () => {
      try {
        const response = await axios.get(`/match-history/${puuid}`);
        fetchMatchDetails(response.data); // Fetch match details with the retrieved IDs
      } catch (error) {
        console.error('Error fetching match IDs:', error);
      }
    };

    const fetchMatchDetails = async (ids) => {
      const matchDetailsPromises = ids.map(id => axios.get(`/match-details/${id}`));
      try {
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        setMatches(matchDetailsResponses.map(res => res.data));
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchIds();
  }, [puuid]);

  return (
    <div>
      <h2>Match History</h2>
      <ul>
        {matches.map(match => {
          const participant = match.info.participants.find(p => p.puuid === puuid);
          return (
            <li key={match.metadata.matchId}>
              {participant && (
                <>
                  <img 
                    src={championImageMap[participant.championName]} // Use championName to get the image
                    alt="Champion Icon" 
                    className="champion-icon" 
                  />
                  <div className="match-info">
                    <h3>Match ID: {match.metadata.matchId}</h3>
                    <p>Duration: {match.info.gameDuration} seconds</p>
                    <p>Winner: {match.info.teams[0].win ? 'Team 1' : 'Team 2'}</p>
                    <p>Champion: {participant.championName}</p>
                    <p>KDA: {participant.kills}/{participant.deaths}/{participant.assists}</p>
                    <p>Game Type: {match.info.queueId === 420 ? 'Ranked' : 'Normal'}</p>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MatchHistory;
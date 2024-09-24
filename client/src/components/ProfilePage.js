import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MatchHistory from './MatchHistory';
import axios from 'axios';
import './ProfilePage.css'; // Import the CSS file

const ProfilePage = () => {
  const { puuid, name, tag } = useParams(); // Get the PUUID, name, and tag from the URL parameters
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null); // State to store last refresh time

  const fetchProfileData = useCallback(async () => {
    try {
      // Fetch summoner data using PUUID
      const response = await axios.get(`/summoner/${puuid}`);
      setSummonerData(response.data);
      setError(''); // Clear error if successful
    } catch (err) {
      console.error('Error fetching summoner data:', err);
      setError('Failed to fetch summoner data.');
    }
  }, [puuid]);

  useEffect(() => {
    fetchProfileData(); // Fetch data on initial load
  }, [fetchProfileData]);

  const refreshProfile = () => {
    fetchProfileData(); // Refresh the summoner data
    setLastRefreshed(new Date().toLocaleString()); // Update the last refreshed time
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summonerData && (
        <div>
          <h3 className="profile-name">{name} <span className="profile-tag">({tag})</span></h3>
          <img 
            className="profile-icon"
            src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/profileicon/${summonerData.profileIconId}.png`} 
            alt={`${name}'s Profile Icon`} 
          />
          <p className="profile-level">Level: {summonerData.summonerLevel}</p>
        </div>
      )}

      <button className="refresh-button" onClick={refreshProfile}>Refresh Profile</button>
      <p className="last-refreshed">
        {lastRefreshed ? `Last Refreshed: ${lastRefreshed}` : 'Not refreshed yet'}
      </p>

      <MatchHistory puuid={puuid} /> {/* Match history will fetch its data based on updated PUUID */}
    </div>
  );
};

export default ProfilePage;
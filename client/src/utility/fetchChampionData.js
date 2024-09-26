import axios from 'axios';

const fetchChampionData = async () => {
  try {
    // Fetch the latest version
    const versionResponse = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionResponse.data[0]; // The first version is the latest
    
    // Fetch champion data using the latest version
    const championResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
    
    const championData = championResponse.data.data;
    const championImageMap = {};

    // Map each champion's name to their image URL
    for (const champion in championData) {
      championImageMap[champion] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championData[champion].image.full}`;
    }

    return championImageMap;
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return {}; // Return an empty object in case of failure
  }
};

export default fetchChampionData;
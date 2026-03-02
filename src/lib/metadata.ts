// metadata.ts

import axios from 'axios';

const IGDB_API_URL = 'https://api.igdb.com/v4/games';
const HLTB_API_URL = 'https://howlongtobeat.com/api';
const IGDB_API_KEY = 'YOUR_IGDB_API_KEY'; // Replace with your actual IGDB API key

async function fetchGameMetadata(igdbIds) {
    const response = await axios.post(IGDB_API_URL, igdbIds, {
        headers: {
            'Client-ID': IGDB_API_KEY,
            'Authorization': `Bearer ${IGDB_API_KEY}`,
        }
    });
    return response.data;
}

async function fetchGameLength(hlTbIds) {
    const response = await axios.get(`${HLTB_API_URL}/games`, {
        params: { ids: hlTbIds }
    });
    return response.data;
}

export { fetchGameMetadata, fetchGameLength };
import express from 'express';
import axios from 'axios';
import { getDb } from '../database.js';

const router = express.Router();
const QWEATHER_API_KEY = process.env.QWEATHER_API_KEY;
const BASE_URL = 'https://devapi.qweather.com/v7';
const GEO_URL = 'https://geoapi.qweather.com/v2';

// Helper to get location ID from city name
async function getLocationId(cityName: string) {
  if (!QWEATHER_API_KEY) {
    // Mock location ID for testing without API key
    return '101010100'; // Beijing
  }
  
  try {
    const response = await axios.get(`${GEO_URL}/city/lookup`, {
      params: {
        location: cityName,
        key: QWEATHER_API_KEY
      }
    });
    
    if (response.data.code === '200' && response.data.location.length > 0) {
      return response.data.location[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching location ID:', error);
    return null;
  }
}

router.get('/realtime', async (req, res) => {
  const { city } = req.query;
  
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City is required' });
  }

  if (!QWEATHER_API_KEY) {
    // Mock data if no API key
    return res.json({
      code: '200',
      now: {
        temp: '25',
        feelsLike: '26',
        text: 'Sunny',
        windScale: '3',
        humidity: '45',
        vis: '10'
      }
    });
  }

  try {
    const locationId = await getLocationId(city);
    if (!locationId) {
      return res.status(404).json({ error: 'City not found' });
    }

    const response = await axios.get(`${BASE_URL}/weather/now`, {
      params: {
        location: locationId,
        key: QWEATHER_API_KEY
      }
    });

    if (response.data.code === '200') {
      // Save to database asynchronously
      try {
        const db = getDb();
        const now = response.data.now;
        await db.run(
          'INSERT INTO weatherdata (city, weather_condition, temperature, apparent_temperature, humidity, wind_scale, visibility) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [city, now.text, now.temp, now.feelsLike, now.humidity, now.windScale, now.vis]
        );
      } catch (dbError) {
        console.error('Error saving weather data to DB:', dbError);
      }
      
      res.json(response.data);
    } else {
      res.status(400).json({ error: 'Failed to fetch weather data' });
    }
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/history', async (req, res) => {
  const { city } = req.query;
  
  try {
    const db = getDb();
    let query = 'SELECT * FROM weatherdata';
    const params: any[] = [];
    
    if (city) {
      query += ' WHERE city = ?';
      params.push(city);
    }
    
    query += ' ORDER BY record_time DESC LIMIT 50';
    
    const data = await db.all(query, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/map-data', async (req, res) => {
  // Mock data for map visualization since we can't easily fetch all provinces at once without hitting rate limits
  const provinces = [
    { name: '北京', value: 25 },
    { name: '天津', value: 26 },
    { name: '上海', value: 28 },
    { name: '重庆', value: 30 },
    { name: '河北', value: 24 },
    { name: '河南', value: 27 },
    { name: '云南', value: 22 },
    { name: '辽宁', value: 18 },
    { name: '黑龙江', value: 15 },
    { name: '湖南', value: 29 },
    { name: '安徽', value: 26 },
    { name: '山东', value: 25 },
    { name: '新疆', value: 32 },
    { name: '江苏', value: 27 },
    { name: '浙江', value: 28 },
    { name: '江西', value: 29 },
    { name: '湖北', value: 28 },
    { name: '广西', value: 31 },
    { name: '甘肃', value: 20 },
    { name: '山西', value: 22 },
    { name: '内蒙古', value: 18 },
    { name: '陕西', value: 23 },
    { name: '吉林', value: 16 },
    { name: '福建', value: 30 },
    { name: '贵州', value: 24 },
    { name: '广东', value: 32 },
    { name: '青海', value: 12 },
    { name: '西藏', value: 10 },
    { name: '四川', value: 26 },
    { name: '宁夏', value: 21 },
    { name: '海南', value: 35 },
    { name: '台湾', value: 30 },
    { name: '香港', value: 31 },
    { name: '澳门', value: 31 }
  ];
  
  res.json(provinces);
});

export default router;

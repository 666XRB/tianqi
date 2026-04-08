import { useState } from 'react';
import axios from 'axios';
import { Search, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

export default function Realtime() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/weather/realtime?city=${encodeURIComponent(city)}`);
      setWeather(response.data.now);
    } catch (err: any) {
      setError(err.response?.data?.error || '查询失败，请检查城市名称或稍后重试');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">实时天气查询</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="输入城市名称，例如：北京"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      {weather && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold mb-2">{city}</h3>
              <p className="text-blue-100 text-lg">{weather.text}</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-light">{weather.temp}°C</div>
              <p className="text-blue-100 mt-2">体感温度 {weather.feelsLike}°C</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-blue-400/30">
            <div className="flex items-center gap-3">
              <Wind className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-blue-200 text-sm">风力</p>
                <p className="font-semibold text-lg">{weather.windScale} 级</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-blue-200 text-sm">湿度</p>
                <p className="font-semibold text-lg">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-blue-200 text-sm">能见度</p>
                <p className="font-semibold text-lg">{weather.vis} km</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-blue-200 text-sm">气压</p>
                <p className="font-semibold text-lg">{weather.pressure || '--'} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

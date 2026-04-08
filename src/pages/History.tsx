import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { Search } from 'lucide-react';

export default function HistoryPage() {
  const [city, setCity] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (searchCity?: string) => {
    setLoading(true);
    try {
      const url = searchCity ? `/api/weather/history?city=${encodeURIComponent(searchCity)}` : '/api/weather/history';
      const response = await axios.get(url);
      setHistoryData(response.data.reverse()); // Reverse to show chronological order in charts
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(city);
  };

  const getChartOption = () => {
    if (!historyData.length) return {};

    const times = historyData.map(d => new Date(d.record_time).toLocaleString());
    const temps = historyData.map(d => d.temperature);
    const humidities = historyData.map(d => d.humidity);

    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['温度 (°C)', '湿度 (%)']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: [
        {
          type: 'value',
          name: '温度',
          position: 'left',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        {
          type: 'value',
          name: '湿度',
          position: 'right',
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      series: [
        {
          name: '温度 (°C)',
          type: 'line',
          data: temps,
          smooth: true,
          itemStyle: { color: '#ef4444' }
        },
        {
          name: '湿度 (%)',
          type: 'line',
          yAxisIndex: 1,
          data: humidities,
          smooth: true,
          itemStyle: { color: '#3b82f6' }
        }
      ]
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">历史天气数据</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="输入城市名称筛选记录"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            筛选
          </button>
          <button
            type="button"
            onClick={() => { setCity(''); fetchHistory(''); }}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
          >
            重置
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">加载中...</div>
      ) : historyData.length > 0 ? (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">温度与湿度变化趋势</h3>
            <ReactECharts option={getChartOption()} style={{ height: '400px' }} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">记录时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">城市</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">天气</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">温度</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">湿度</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">风力</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyData.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.record_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.weather_condition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.temperature}°C
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.humidity}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.wind_scale} 级
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">暂无历史数据</p>
        </div>
      )}
    </div>
  );
}

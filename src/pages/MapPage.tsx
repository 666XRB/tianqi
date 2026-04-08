import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

export default function MapPage() {
  const [mapData, setMapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapRegistered, setMapRegistered] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Fetch China GeoJSON from a public CDN
        const geoJson = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
        echarts.registerMap('china', geoJson.data);
        setMapRegistered(true);
        
        const response = await axios.get('/api/weather/map-data');
        setMapData(response.data);
      } catch (err) {
        console.error('Failed to load map data', err);
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, []);

  const getMapOption = () => {
    return {
      title: {
        text: '全国主要省份实时温度分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>温度: {c} °C'
      },
      visualMap: {
        min: -10,
        max: 40,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [
        {
          name: '温度',
          type: 'map',
          map: 'china',
          roam: true,
          label: {
            show: true,
            fontSize: 10
          },
          data: mapData
        }
      ]
    };
  };

  const getBarOption = () => {
    const sortedData = [...mapData].sort((a, b) => b.value - a.value);
    
    return {
      title: {
        text: '各省份温度排名',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '温度 (°C)'
      },
      yAxis: {
        type: 'category',
        data: sortedData.map(item => item.name),
        inverse: true
      },
      series: [
        {
          name: '温度',
          type: 'bar',
          data: sortedData.map(item => item.value),
          itemStyle: {
            color: function(params: any) {
              const val = params.value;
              if (val > 30) return '#ef4444';
              if (val > 20) return '#f97316';
              if (val > 10) return '#eab308';
              if (val > 0) return '#3b82f6';
              return '#1d4ed8';
            }
          }
        }
      ]
    };
  };

  if (loading) {
    return <div className="text-center py-20">加载地图数据中...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">天气地图可视化</h2>
      
      {mapRegistered ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <ReactECharts option={getMapOption()} style={{ height: '600px' }} />
        </div>
      ) : (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          无法加载地图数据，请检查网络连接。
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ReactECharts option={getBarOption()} style={{ height: '800px' }} />
      </div>
    </div>
  );
}

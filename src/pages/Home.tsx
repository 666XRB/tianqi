import { Link } from 'react-router-dom';
import { Cloud, Map, History, BarChart2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          天气数据分析与可视化系统
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          基于实时数据和历史记录，为您提供全面的天气洞察和直观的可视化展示。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/realtime" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            查询实时天气
          </Link>
          <Link to="/map" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
            查看天气地图
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Cloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">实时天气</h3>
          <p className="text-gray-500 text-sm">获取全国主要城市的实时天气情况，包括温度、湿度、风力等详细指标。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">历史数据</h3>
          <p className="text-gray-500 text-sm">检索和分析历史天气数据，了解天气变化趋势和历史极值。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <Map className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">地图可视化</h3>
          <p className="text-gray-500 text-sm">基于热力图展示全国天气分布，直观感受各地区天气差异。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">统计分析</h3>
          <p className="text-gray-500 text-sm">多维度数据统计与分析，通过图表直观展示天气规律。</p>
        </div>
      </section>
    </div>
  );
}

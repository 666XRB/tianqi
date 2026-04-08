import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Cloud, Map as MapIcon, History, BarChart2, User, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Realtime from './pages/Realtime';
import HistoryPage from './pages/History';
import MapPage from './pages/MapPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserCenter from './pages/UserCenter';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Cloud className="h-6 w-6" />
              <span>天气数据分析系统</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">首页</Link>
                <Link to="/realtime" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">实时天气</Link>
                <Link to="/history" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">历史数据</Link>
                <Link to="/map" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">天气地图</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link to="/user" className="flex items-center gap-1 hover:text-blue-200">
                  <User className="h-5 w-5" />
                  <span>个人中心</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-blue-200">
                  <LogOut className="h-5 w-5" />
                  <span>退出</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">登录</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/realtime" element={<Realtime />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/user" element={<UserCenter />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
          <p>© 2026 天气数据分析与可视化系统. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}


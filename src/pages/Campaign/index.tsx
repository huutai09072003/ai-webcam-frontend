import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';

type Campaign = {
  id: number;
  title: string;
  description: string;
  location: string;
  goal: string;
  status: string;
  thumb_nail_url: string;
  created_at: string;
};

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/campaigns`)
      .then(response => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-600 text-lg">Đang tải chiến dịch...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            to={`/campaigns/${c.id}`}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden block"
          >
            {c.thumb_nail_url && (
              <img
                src={c.thumb_nail_url}
                alt={c.title}
                className="w-full object-contain rounded-t-2xl"
              />
            )}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{c.title}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  c.status === 'approved' ? 'bg-green-100 text-green-700'
                  : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-600'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
              <div className="text-sm text-gray-500">
                📍 {c.location} • 🎯 {c.goal}
              </div>
              <div className="text-xs text-gray-400">📅 {formatDate(c.created_at)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;

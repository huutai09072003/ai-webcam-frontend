// src/pages/Recyclopedia.tsx
import './index.scss';

import {
  useEffect,
  useState,
} from 'react';

import { API_BASE_URL } from '../../config/api';
import CardItemModal from './CardItemModal';

interface Section {
  id: number;
  name: string;
  slug: string;
}

interface RelatedItem {
  id: number;
  name: string;
  image_url: string;
}

interface Facility {
  id: number;
  name: string;
  category: string;
  link: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  image_url: string;
  section_name: string;
  life_cycle: string;
  recycle_way: string;
  can_recycle: boolean;
  related_items: RelatedItem[];
  facilities: Facility[];
}

const Recyclopedia = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const perPage = 12;

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sections`);
        const data = await res.json();
        setSections(data);
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      }
    };
    fetchSections();
  }, []);

  const fetchItems = async (pageNum: number, isReset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSectionId !== 'all') params.append('section_id', selectedSectionId.toString());
      if (searchQuery) params.append('q[name_cont]', searchQuery);
      if (sortOption) params.append('q[s]', sortOption);
      params.append('page', pageNum.toString());
      params.append('per_page', perPage.toString());

      const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`);
      const data = await res.json();

      if (isReset) setItems(data.items);
      else setItems((prev) => [...prev, ...data.items]);

      setHasMore(pageNum < data.pagination.total_pages);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
    // eslint-disable-next-line
  }, [selectedSectionId, searchQuery, sortOption]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-white to-emerald-50 min-h-screen recyclopedia">
      {/* Header: flex container */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        {/* Left: Title & Filters */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold mb-6 text-emerald-700 text-center md:text-left">
            ♻️ Recyclopedia
          </h1>
          {/* Section filter */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            <button
              onClick={() => setSelectedSectionId('all')}
              className={`section-button px-4 py-2 rounded-full border ${
                selectedSectionId === 'all' ? 'active' : ''
              }`}
            >
              🌿 Tất cả
            </button>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSectionId(s.id)}
                className={`section-button px-4 py-2 rounded-full border ${
                  selectedSectionId === s.id ? 'active' : ''
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          {/* Search + Sort */}
          <div className="filter-toolbar flex gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm kiếm theo tên sản phẩm..."
              className="flex-[2_1_0%] basis-2/3 px-4 py-2 rounded border-2 border-emerald-100 focus:border-emerald-400 transition"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="flex-[1_1_0%] basis-1/3 px-4 py-2 rounded border-2 border-emerald-100 font-medium bg-white"
            >
              <option value="">Sắp xếp</option>
              <option value="name asc">Tên A → Z</option>
              <option value="name desc">Tên Z → A</option>
              <option value="created_at desc">Mới nhất</option>
              <option value="created_at asc">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="item-card text-center space-y-2 cursor-pointer"
            onClick={() => {
              fetch(`${API_BASE_URL}/items/${item.id}`)
                .then((res) => res.json())
                .then((data) => setSelectedItem(data));
            }}
          >
            <div className="image-wrapper w-full h-[200px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-semibold text-gray-700">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="load-more-btn px-6 py-3 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <CardItemModal
          key={selectedItem.id}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onItemSelect={(item) => setSelectedItem(item)}
        />
      )}
    </div>
  );
};

export default Recyclopedia;

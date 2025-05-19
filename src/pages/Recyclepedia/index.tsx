import { useState, useEffect } from 'react';
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
  }, [selectedSectionId, searchQuery, sortOption]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recyclopedia</h1>

      <div className="grid grid-cols-2 md:grid-cols-10 gap-2 mb-4">
        <button
          onClick={() => setSelectedSectionId('all')}
          className={`w-full px-4 py-2 rounded text-center ${
            selectedSectionId === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Tất cả
        </button>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSectionId(s.id)}
            className={`w-full px-4 py-2 rounded text-center ${
              selectedSectionId === s.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên..."
          className="w-full md:w-4/5 border border-gray-300 rounded px-4 py-2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/5 border border-gray-300 rounded px-4 py-2"
        >
          <option value="">Sắp xếp</option>
          <option value="name asc">Tên A → Z</option>
          <option value="name desc">Tên Z → A</option>
          <option value="created_at desc">Mới nhất</option>
          <option value="created_at asc">Cũ nhất</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="text-center space-y-2 cursor-pointer"
            onClick={() => {
              fetch(`${API_BASE_URL}/items/${item.id}`)
                .then((res) => res.json())
                .then((data) => setSelectedItem(data));
          }}
          >
            <div className="w-full h-[200px] bg-gray-100 rounded-md overflow-hidden shadow-md">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-medium">{item.name}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}

      {selectedItem && (
        <CardItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Recyclopedia;

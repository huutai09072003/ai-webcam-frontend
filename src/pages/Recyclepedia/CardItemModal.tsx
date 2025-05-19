import React from 'react';

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

interface Props {
  item: Item;
  onClose: () => void;
}

const CardItemModal: React.FC<Props> = ({ item, onClose }) => {
  const groupedFacilities = item.facilities.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, Facility[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#f7f8fa] max-w-5xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <img src={item.image_url} alt={item.name} className="w-full h-auto object-cover" />
          </div>
          <div className="space-y-4 text-gray-800">
            <h2 className="text-3xl font-bold text-indigo-800">{item.name}</h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-indigo-800">Phân loại:</span> <span className="ml-1">{item.section_name}</span>
              </li>
              <li className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-green-800">Vòng đời:</span> <span className="ml-1">{item.life_cycle}</span>
              </li>
              <li className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
                <span className="font-semibold text-amber-800">Cách tái chế:</span> <span className="ml-1">{item.recycle_way}</span>
              </li>
              <li className="flex items-center bg-gradient-to-r from-purple-50 to-fuchsia-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-purple-800">Có thể tái chế?</span>{' '}
                <span className={`ml-1 ${item.can_recycle ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}`}>
                  {item.can_recycle ? 
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Có</span> : 
                    <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>Không</span>
                  }
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center text-gray-700 mb-2">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Mô tả chi tiết
              </h3>
              <p className="text-base text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-100">{item.description}</p>
            </div>
          </div>
        </div>

        {Object.entries(groupedFacilities).length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Cơ sở & Dịch vụ
            </h3>
            {Object.entries(groupedFacilities).map(([category, facilities]) => {
              const categoryColors = {
                'collection_point': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'recycling_center': 'bg-blue-50 text-blue-700 border-blue-200',
                'service': 'bg-purple-50 text-purple-700 border-purple-200',
                'store': 'bg-amber-50 text-amber-700 border-amber-200',
                'default': 'bg-gray-50 text-gray-700 border-gray-200'
              };
              
              const getCategoryIcon = (cat: string) => {
                switch(cat) {
                  case 'collection_point':
                    return <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
                  case 'recycling_center':
                    return <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>;
                  case 'service':
                    return <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
                  case 'store':
                    return <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>;
                  default:
                    return <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
                }
              };
              
              const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
              
              return (
                <div key={category} className="mb-6">
                  <h4 className="text-lg font-semibold capitalize mb-3 flex items-center">
                    {getCategoryIcon(category)}
                    {category.replace('_', ' ')}
                  </h4>
                  <ul className="space-y-2">
                    {facilities.map((f) => (
                      <li key={f.id}>
                        <a
                          href={f.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center py-2 px-3 rounded-lg border hover:shadow-sm transition-all ${colorClass}`}
                        >
                          <span className="flex-1">{f.name}</span>
                          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {item.related_items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Sản phẩm liên quan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {item.related_items.map((rel) => (
                <div key={rel.id} className="text-center">
                  <img
                    src={rel.image_url}
                    alt={rel.name}
                    className="w-full h-40 object-cover rounded-md shadow"
                  />
                  <p className="mt-2 font-medium">{rel.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItemModal;

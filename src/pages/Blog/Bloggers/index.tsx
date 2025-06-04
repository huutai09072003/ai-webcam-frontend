import React, {
  useEffect,
  useState,
} from 'react';

import axiosInstance from '../../../utils/axiosInstance';

interface Blogger {
  id: number;
  username: string;
  email: string;
}

const BloggerIndex: React.FC = () => {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);

  useEffect(() => {
    axiosInstance.get("/bloggers").then((res) => {
      setBloggers(res.data);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Danh sách Bloggers</h2>
      <ul className="space-y-2">
        {bloggers.map((blogger) => (
          <li
            key={blogger.id}
            className="border rounded-md p-4 hover:shadow-md transition"
          >
            <p className="font-medium">{blogger.username}</p>
            <p className="text-sm text-gray-500">{blogger.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BloggerIndex;

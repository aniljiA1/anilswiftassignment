import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState(localStorage.getItem('search') || '');
  const [sortConfig, setSortConfig] = useState(JSON.parse(localStorage.getItem('sort')) || { key: '', direction: '' });
  const [page, setPage] = useState(Number(localStorage.getItem('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(localStorage.getItem('pageSize')) || 10);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('search', search);
    localStorage.setItem('sort', JSON.stringify(sortConfig));
    localStorage.setItem('page', page);
    localStorage.setItem('pageSize', pageSize);
  }, [search, sortConfig, page, pageSize]);

  const filtered = comments.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.body.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered];
  if (sortConfig.key) {
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key].toString().toLowerCase();
      const bVal = b[sortConfig.key].toString().toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const start = (page - 1) * pageSize;
  const paginated = sorted.slice(start, start + pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const cycleSort = (key) => {
    if (sortConfig.key !== key) return setSortConfig({ key, direction: 'asc' });
    if (sortConfig.direction === 'asc') return setSortConfig({ key, direction: 'desc' });
    if (sortConfig.direction === 'desc') return setSortConfig({ key: '', direction: '' });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Swift</h1>
        <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Profile
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, comments"
          className="border p-2 rounded w-full"
        />
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="border p-2 rounded">
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th onClick={() => cycleSort('postId')} className="cursor-pointer">Post ID</th>
            <th onClick={() => cycleSort('name')} className="cursor-pointer">Name</th>
            <th onClick={() => cycleSort('email')} className="cursor-pointer">Email</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(comment => (
            <tr key={comment.id} className="border-t">
              <td>{comment.postId}</td>
              <td>{comment.name}</td>
              <td>{comment.email}</td>
              <td>{comment.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-2 py-1 ${page === num ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Admin/AdminNavbar';
import { RiFolderUploadFill, RiDeleteBin5Line } from 'react-icons/ri';
import clg from "../../images/clg.jpg";
import clg1 from "../../images/clg1.jpg";
import { Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [contentList, setContentList] = useState([]);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      let allBooks = response.data;

      if (categoryFilter) {
        allBooks = allBooks.filter((book) => book.category === categoryFilter);
      }

      if (categoryFilter === 'Subject E-books') {
        if (courseFilter) {
          allBooks = allBooks.filter((book) => book.course === courseFilter);
        } else {
          setBooks([]);
          return;
        }
      }

      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, [categoryFilter, courseFilter]);

  const fetchContent = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/content');
      const sortedContent = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setContentList(sortedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    if (categoryFilter === 'Fresh Drops') {
      fetchContent();
    } else {
      fetchBooks();
    }
  }, [categoryFilter, courseFilter, fetchBooks]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textContent && !file) {
      alert('Please provide text content or select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('textContent', textContent);
    if (file) {
      formData.append('files', file);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Content uploaded successfully!');
      setContentList([res.data, ...contentList]);
      setTextContent('');
      setFile(null);
      setPreview('');
    } catch (error) {
      console.error('Error uploading content:', error);
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/content/${id}`);
      setContentList(contentList.filter((item) => item._id !== id));
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setCategoryFilter(category);
    setCourseFilter('');
    setIsImageVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <AdminNavbar />
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {['E-books', 'Cheat sheets', 'Subject E-books', 'Interview Questions', 'Fresh Drops'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${categoryFilter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {categoryFilter === 'Subject E-books' && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <option value="">Select Course</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
            </select>
          </div>
        )}
      </div>


      {isImageVisible && !categoryFilter && (
        <div className="flex justify-center items-center mt-4 gap-3 flex-col md:flex-row">
          <img src={clg} alt="Admin Dashboard" className="w-96 h-96 md:w-[100vh] md:h-[500px]" />
          <img src={clg1} alt="Admin Dashboard" className="w-96 h-96 md:w-[100vh] md:h-[500px]" />
        </div>
      )}


      {categoryFilter === 'Fresh Drops' ? (
        <div className="w-full max-w-4xl px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Fresh Drops</h2>
          <div className="space-y-6">
            {contentList.map((item) => (
              <div key={item._id} className="p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                {item.textContent && <p className="mb-2">{item.textContent}</p>}
                {item.filePathImage && (
                  <img
                    src={`http://localhost:5000${item.filePathImage}`}
                    alt="Uploaded"
                    className="w-56 h-auto object-contain mb-4 mx-auto"
                  />
                )}
                {item.filePathAudio && (
                  <audio controls className="mb-4 mx-auto">
                    <source src={`http://localhost:5000${item.filePathAudio}`} type="audio/mp3" />
                  </audio>
                )}
                {item.filePathVideo && (
                  <video controls width="320" height="240" className="mb-4 mx-auto">
                    <source src={`http://localhost:5000${item.filePathVideo}`} type="video/mp4" />
                  </video>
                )}
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(item.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDeleteContent(item._id)}
                  className="mt-2 text-red-500 hover:text-red-400 flex items-center gap-1"
                >
                  <RiDeleteBin5Line />
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white p-8 rounded-lg shadow-xl mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
              <div className="flex flex-row items-center w-full space-x-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text content"
                  className="flex-1 h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                />
                <label
                  htmlFor="file-upload"
                  className="h-12 p-3 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-center block"
                >
                  <RiFolderUploadFill className="text-3xl" />
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Attach file"
                  />
                </label>
              </div>
              {preview && (
                <div className="w-full mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Preview:</h3>
                  {file.type.startsWith('image') && (
                    <img src={preview} alt="Preview" className="w-72 h-auto mx-auto" />
                  )}
                  {file.type.startsWith('audio') && (
                    <audio controls className="w-full mx-auto" src={preview} />
                  )}
                  {file.type.startsWith('video') && (
                    <video controls className="w-96 mx-auto" src={preview} />
                  )}
                </div>
              )}
              <button
                type="submit"
                className="w-44 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      ) : (

        categoryFilter && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-6">
            {books.map((book) => (
              <div key={book._id} className="border border-gray-300 rounded-lg shadow-md bg-white p-4 flex flex-col items-center">
                <img
                  src={`http://localhost:5000/uploads/${book.thumbnail}`}
                  alt={book.title}
                  className="w-full h-56 object-fit rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200';
                  }}
                />
                <h3 className="text-lg font-semibold mt-2 text-center">{book.title}</h3>
                <p className="text-gray-500 text-sm">{book.category}</p>
                {book.category === 'Subject E-books' && (
                  <p className="text-gray-500 text-sm">{book.course}</p>
                )}
                <div className="mt-4 flex flex-col lg:flex-row items-center gap-3 w-full">
                  <a
                    href={`http://localhost:5000/uploads/${book.pdf}`}
                    target="_blank"rel="noreferrer"
                    className="relative overflow-hidden h-12 px-8 rounded-full bg-[#3d3a4e] text-white border-none cursor-pointer group flex items-center justify-center w-full lg:w-auto lg:ml-12"
                  >
                    <span className="relative z-10 flex items-center">
                      <Eye size={24} className="mr-2" />
                      View PDF
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#965de9] to-[#6358ee] scale-x-0 origin-left transition-transform duration-[475ms] group-hover:scale-x-100 rounded-full"></div>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book._id);
                    }}
                    className="relative flex items-center justify-start w-10 lg:w-10 h-10 rounded-full cursor-pointer overflow-hidden transition-all shadow-md bg-gradient-to-br from-orange-500 via-red-500 to-red-600 hover:w-32 hover:mr-5 hover:rounded-lg active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <div className="flex items-center justify-center w-12 h-12 transition-all">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-5 h-5 fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"></path>
                      </svg>
                    </div>
                    <div className="absolute right-4 opacity-0 text-white text-lg font-semibold transition-all hover:opacity-100">
                      Delete
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <button
        onClick={() => navigate('/upload')}
        className="rounded-lg fixed bottom-6 right-6 w-40 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
      >
        <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">
          Add Item
        </span>
        <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
          <svg
            className="svg w-8 text-white"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../constants/api";
import muado from "../../../assets/img/muado.jpg";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  genre: string;
  description?: string;
  image?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const getImageUrl = (image?: string) => {
    if (!image) return muado;
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_API_BASE_URL}/storage/movies/${image}`;
  };

  // Hàm tìm kiếm phim
  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/movies?search=${searchText}`);
      // Lọc kết quả: chỉ giữ phim có tên bắt đầu bằng query
      const startsWithMatch = res.data.filter((m: Movie) =>
        m.title.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setMovies(startsWithMatch);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Tự động tìm sau khi người dùng dừng gõ 500ms
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="bg-black min-h-screen text-white relative">
      {/* Nút Quay về */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/tasks">
          <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-red-500 transition transform hover:scale-105">
            Back to Home
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-72 bg-gradient-to-r from-black via-gray-900 to-black flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 drop-shadow-lg mb-4">
          🎬 Tìm kiếm phim
        </h1>
        <p className="text-gray-300 mb-6">
          Gõ vài ký tự đầu tên phim để tìm nhanh 🔎
        </p>

        {/* Form tìm kiếm */}
        <div className="flex w-full max-w-xl bg-white rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập ký tự đầu tên phim..."
            className="px-4 py-3 w-full text-black outline-none"
          />
          <button
            onClick={() => handleSearch(query)}
            className="bg-yellow-500 px-6 py-3 font-semibold hover:bg-yellow-400 transition text-black"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Nội dung kết quả */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center text-gray-300 text-xl animate-pulse">
            Đang tải...
          </div>
        )}

        {!loading && movies.length === 0 && query && (
          <div className="text-center text-gray-400 text-lg">
            ❌ Không tìm thấy phim nào bắt đầu bằng{" "}
            <span className="text-yellow-400 font-semibold">"{query}"</span>
          </div>
        )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
  {movies.map((movie) => (
    <div
      key={movie.id}
      className="group relative bg-gray-900 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 hover:shadow-3xl transition-all duration-300"
    >
      {/* Ảnh phim */}
      <img
        src={getImageUrl(movie.image)}
        alt={movie.title}
        className="h-80 w-full object-cover group-hover:opacity-90 transition duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition duration-300"></div>

      {/* Thông tin phim */}
      <div className="absolute bottom-0 w-full p-4">
        <h3 className="text-lg font-bold text-yellow-400 drop-shadow-lg">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-300">{movie.genre}</p>

        {/* Nút hành động */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Nút đặt vé */}
          <button
            onClick={() => {
              if (user) {
                navigate("/booking"); // ✅ Có user thì cho đặt vé
              } else {
                alert("⚠️ Vui lòng đăng nhập để đặt vé!");
                navigate("/users/login"); // ❌ Chưa login thì về login
              }
            }}
            className="bg-red-600 w-full py-2 rounded-lg font-semibold text-white 
                       hover:bg-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] 
                       transition-all duration-200 transform hover:scale-105"
          >
            🎟️ Đặt vé
          </button>

          {/* Nút xem chi tiết */}
          <button
            onClick={() => navigate(`/detail/${movie.id}`)}
            className="bg-green-500 w-full py-2 rounded-lg font-semibold text-white 
                       hover:bg-green-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] 
                       transition-all duration-200 transform hover:scale-105"
          >
            ℹ️ Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

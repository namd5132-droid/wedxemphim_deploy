import { useParams,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../../constants/api";
import muado from "../../../assets/img/muado.jpg";

interface Movie {
  price: any;
  id: number;
  title: string;
  genre: string;
  description?: string;
  image?: string;
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [user] = useState<{ name: string } | null>(null); // user info

  const navigate = useNavigate();

  const getImageUrl = (image?: string) => {
    if (!image) return muado;
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_API_BASE_URL}/storage/movies/${image}`;
  };

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/movies/${id}`)
        .then((res) => setMovie(res.data))
        .catch((err) => console.error("API Error:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/tasks"), 400); // đợi animation xong mới chuyển trang
  };

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (!movie) return <div className="text-center mt-10">Không tìm thấy phim</div>;

  return (
    <div
      className={`relative bg-black text-white min-h-screen transition-all duration-500 ${
        isExiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Background mờ */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.image)}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
      </div>

      {/* EXIT icon góc phải */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleExit}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white text-lg font-bold hover:bg-red-500 transition shadow-lg"
        >
          ✖
        </button>
      </div>

      {/* Nội dung overlay */}
      <div className="relative z-10 flex flex-col md:flex-row max-w-5xl mx-auto py-16 px-6 gap-10 items-center">
        {/* Poster */}
        <div className="w-full md:w-1/3">
          <img
            src={getImageUrl(movie.image)}
            alt={movie.title}
            className="rounded-lg shadow-2xl w-full"
          />
        </div>

        {/* Thông tin */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-4xl font-bold text-red-500 drop-shadow-lg">
            {movie.title}
          </h2>
          <p className="text-gray-300 text-lg">🎬 Thể loại: {movie.genre}</p>
          {movie.description && (
            <p className="text-gray-200 leading-relaxed">{movie.description}</p>
            
          )}
          <p className="text-lg font-semibold text-green-400 mt-1">
           {Number(movie.price).toLocaleString()} VND
        </p>

          {/* Nút hành động */}
<div className="flex gap-4 mt-6">
  <button
    onClick={() => {
      if (user) {
        navigate("/booking"); // ✅ Nếu có user thì đi tiếp
      } else {
        alert("Vui lòng đăng nhập để đặt vé 🎟️");
        navigate("/users/login"); // ❌ Nếu chưa login thì chuyển login
      }
    }}
    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold 
               hover:bg-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.7)] 
               transition transform hover:scale-105"
  >
    🎟️ Đặt vé ngay
  </button>

  <button
    className="bg-sky-400 text-black px-6 py-3 rounded-lg font-semibold 
               hover:bg-sky-300 hover:shadow-[0_0_12px_rgba(56,189,248,0.7)] 
               transition transform hover:scale-105"
  >
    🎥 Xem trailer
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

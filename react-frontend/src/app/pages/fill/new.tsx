import { useState, useEffect, useRef } from "react";
import muado from "../../../assets/img/muado.jpg";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../../constants/api";
import crs1 from "../../../assets/img/crs1.png";
import crs2 from "../../../assets/img/crs2.png";
import crs3 from "../../../assets/img/crs3.jpg";
import crs4 from "../../../assets/img/crs4.jpg";
import crs5 from "../../../assets/img/crs5.jpg";


interface Movie {
  price: any;
  new: number;
  id: number;
  title: string;
  genre: string;
  image: string;
}

export default function fill() {
 const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null); // user info
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  // Ảnh carousel
  const carouselImages = [
    {
      src: crs1,
      title: "🎬 Bom tấn tháng 10 đã đổ bộ!",
      subtitle: "Trải nghiệm rạp phim chuẩn Galaxy ngay tại nhà!",
    },
    {
      src: crs2,
      title: "🔥 Ưu đãi vé chỉ từ 45K!",
      subtitle: "Mua vé online – Giảm giá cực sốc!",
    },
    {
      src: crs3,
      title: "💥 Phim Marvel trở lại!",
      subtitle: "Đặt vé sớm để chọn ghế đẹp nhất!",
    },
    {
      src: crs4,
      title: "🎁 Nhận quà hấp dẫn khi xem phim cuối tuần!",
      subtitle: "Đừng bỏ lỡ cơ hội nhận vé miễn phí và combo bắp nước!",
    },
    {
      src: crs5,
      title: "🌃 Thế giới điện ảnh trong tầm tay bạn",
      subtitle: "Chọn phim yêu thích – Xem ngay hôm nay!",
    },
  ];


  const handleBookingClick = () => {
    if (user) {
      navigate("/booking"); // ✅ Nếu đã login
    } else {
      alert("⚠️ Vui lòng đăng nhập để đặt vé!");
      navigate("/users/login"); // ❌ Chưa login → về login
    }
  };
  const handleCartClick = () => {
    if (user) {
      navigate("/cart"); // ✅ Có user thì cho vào giỏ hàng
    } else {
      alert("⚠️ Vui lòng đăng nhập để vào giỏ hàng!");
      navigate("/users/login"); // ❌ Chưa login thì về login
    }
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };
  useEffect(() => {
    // ✅ Check user login (lấy từ localStorage nếu có)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // đổi sau 4s
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // auto slide 5s
    return () => clearInterval(interval);
  }, []);
  // Lấy tên người dùng từ localStorage khi load trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ name: parsed.name });
    }


    apiClient
      .get("movies")
      .then((res: { data: Movie[] }) => setMovies(res.data))
      .catch((err: unknown) => console.error("Lỗi tải phim:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/users/login");
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
         <header className="fixed top-0 left-0 w-full z-50 bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">🎬 Movie Booking</h1>

        {/* Menu */}
        <nav>
          <ul className="flex gap-6 font-medium">
            <Link to="/tasks">
              <li className="hover:text-yellow-400 cursor-pointer">Trang chủ</li>
            </Link>
            <li
              className="hover:text-yellow-400 cursor-pointer relative"
              onMouseEnter={() => setShowSubMenu(true)}
              onMouseLeave={() => setShowSubMenu(false)}
            >
              Phim
              <ul
                className={`absolute top-full left-0 bg-white text-black shadow-lg rounded mt-2 w-40 transition-all duration-300 ease-in-out z-50 ${showSubMenu ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">
                  <Link to="/movies/fill/now">Phim đang chiếu</Link>
                </li>
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">
                  <Link to="/movies/fill/new">Phim sắp chiếu</Link>
                </li>
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">
                  <Link to="/movies/fill/imax">Phim Imax</Link>
                </li>
              </ul>
            </li>
            <li
              onClick={handleBookingClick}
              className="hover:text-yellow-400 cursor-pointer"
            >
              Đặt vé
            </li>
            <Link to="/contact">
              <li className="hover:text-yellow-400 cursor-pointer">Liên hệ</li>
            </Link>
          </ul>
        </nav>

        {/* Thanh tìm kiếm + nút đăng nhập/đăng xuất */}
        <div className="flex items-center gap-4">
          {/* Search button */}
          <Link to="/search">
            <button className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full text-black hover:bg-yellow-400 transition transform hover:scale-110 shadow-lg">
              🔍
            </button>
          </Link>

          {/* Cart button */}
          <button
            onClick={handleCartClick}
            className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full text-black hover:bg-yellow-400 transition transform hover:scale-110 shadow-lg"
          >
            🛒
          </button>

          {/* Nếu đã đăng nhập */}
          {user ? (
            <div ref={menuRef} className="relative">
              {/* Avatar */}
              <div
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-full font-bold cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {/* Dropdown menu */}
              {openMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b text-sm text-gray-600">
                    Xin chào, <b className="text-black">{user.name}</b>
                  </div>

                  

                  {/* Nút Đăng xuất */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Nếu chưa đăng nhập
            <Link
              to="/users/login"
              className="flex items-center space-x-1 hover:text-yellow-400 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Đăng nhập</span>
            </Link>
          )}

        </div>

      </header>

           {/* Hero Section - Carousel (Galaxy Style) */}
<section className="relative w-full h-[420px] overflow-hidden carousel__wrapper">
  {carouselImages.map((img, index) => (
    <div
      key={index}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
    >
      <img
        src={img.src}
        alt={`Banner ${index + 1}`}
        className="w-full h-full object-cover brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl md:text-5xl text-yellow-400 font-bold drop-shadow-2xl mb-2 animate-fade-in">
          {img.title}
        </h2>
        <p className="text-yellow-100 text-lg md:text-xl drop-shadow-lg mb-4 animate-fade-in delay-200">
          {img.subtitle}
        </p>
        <Link to="/booking">
          <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 animate-fade-in delay-400">
            { "Đặt vé ngay 🎟️"}
          </button>
        </Link>
      </div>
    </div>
  ))}

  {/* Nút điều hướng */}
  <button
    onClick={prevSlide}
    className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-3 hover:bg-black/70 transition"
  >
    ❮
  </button>
  <button
    onClick={nextSlide}
    className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-3 hover:bg-black/70 transition"
  >
    ❯
  </button>

  {/* Dots chỉ báo */}
  <div className="absolute bottom-5 w-full flex justify-center gap-2">
    {carouselImages.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
        className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-yellow-400 scale-125" : "bg-gray-500/70"} transition-all duration-300`}
      ></button>
    ))}
  </div>
</section>



      {/* Danh sách phim mới */}
<section className="p-8">
  <h1 className="text-2xl font-bold mb-6 text-yellow-400 text-center">🔥 Phim Sắp Chiếu</h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {movies
      .filter((movie) => movie.new === 1) // chỉ lấy phim có new = 1
      .map((movie) => (
        <div
          key={movie.id}
          className="relative bg-gray-900 rounded-xl shadow-2xl overflow-hidden group transform hover:scale-105 transition duration-300"
        >
          <img
            src={movie.image || muado}
            alt={movie.title}
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="p-4 relative z-10">
            <h2 className="text-xl font-bold text-yellow-400">{movie.title}</h2>
            <p className="text-sm text-gray-300">🎬 {movie.genre}</p>
            <p className="text-lg font-semibold text-green-400 mt-1">
           {Number(movie.price).toLocaleString()} VND
        </p>

            <div className="flex flex-col gap-2 mt-4">
              <Link to="/booking">
                <button className="bg-red-600 w-full py-2 rounded-lg font-semibold hover:bg-red-500 transition transform hover:scale-105">
                  Đặt vé
                </button>
              </Link>
              <Link to={`/detail/${movie.id}`}>
                <button className="bg-yellow-500 w-full py-2 rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105">
                  Xem chi tiết
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
  </div>
</section>


      {/* Footer */}
      <footer className="text-white text-center py-6 mt-auto">
        <div className="bg-[#fdfaf4] text-gray-800">
          <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

            <div>
              <h3 className="font-bold mb-3">CGV Việt Nam</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-red-500">Giới Thiệu</a></li>
                <li><a href="#" className="hover:text-red-500">Tiện Ích Online</a></li>
                <li><a href="#" className="hover:text-red-500">Thẻ Quà Tặng</a></li>
                <li><a href="#" className="hover:text-red-500">Tuyển Dụng</a></li>
                <li><a href="#" className="hover:text-red-500">Liên Hệ Quảng Cáo CGV</a></li>
                <li><a href="#" className="hover:text-red-500">Dành cho đối tác</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Điều khoản sử dụng</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-red-500">Điều Khoản Chung</a></li>
                <li><a href="#" className="hover:text-red-500">Điều Khoản Giao Dịch</a></li>
                <li><a href="#" className="hover:text-red-500">Chính Sách Thanh Toán</a></li>
                <li><a href="#" className="hover:text-red-500">Chính Sách Bảo Mật</a></li>
                <li><a href="#" className="hover:text-red-500">Câu Hỏi Thường Gặp</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Kết nối với chúng tôi</h3>
              <div className="flex gap-3">
                <a href="#"><img src="https://img.icons8.com/color/48/facebook.png" alt="Facebook" className="w-8" /></a>
                <a href="#"><img src="https://img.icons8.com/color/48/youtube-play.png" alt="Youtube" className="w-8" /></a>
                <a href="#"><img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram" className="w-8" /></a>
                <a href="#"><img src="https://img.icons8.com/color/48/zalo.png" alt="Zalo" className="w-8" /></a>
              </div>
              <div className="mt-4">
                <img src="https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/registered.png" alt="Đã thông báo" className="w-40" />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Chăm sóc khách hàng</h3>
              <p>Hotline: <b>1900 6017</b></p>
              <p>Giờ làm việc: 8:00 - 22:00 <br />(Tất cả các ngày bao gồm cả Lễ Tết)</p>
              <p>Email hỗ trợ: <a href="mailto:hoidap@cgv.vn" className="text-red-500">hoidap@cgv.vn</a></p>
            </div>
          </div>

          <div className="border-t border-gray-300 py-6 text-center text-xs">
            <p className="font-bold">CÔNG TY TNHH CJ CGV VIỆT NAM</p>
            <p>Giấy Chứng nhận đăng ký doanh nghiệp: 0303675393 đăng ký lần đầu ngày 31/7/2008,
              được cấp bởi Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh</p>
            <p>Địa chỉ: Lầu 2, số 7/28, Đường Thành Thái, Phường 14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam</p>
            <p>Đường dây nóng (Hotline): 1900 6017</p>
            <p>COPYRIGHT 2017 CJ CGV VIETNAM CO., LTD. ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

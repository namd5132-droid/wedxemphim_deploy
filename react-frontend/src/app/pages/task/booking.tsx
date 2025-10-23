import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../constants/api";

interface Movie {
  id: number;
  title: string;
  genre: string;
  image: string;
  price: number;
}

interface Showtime {
  id: number;
  time: string;
  room: string;
}


export default function Booking() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | "">("");
  const [selectedShowtime, setSelectedShowtime] = useState<number | "">("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh sách phim
    apiClient
      .get("movies")
      .then((res: { data: Movie[] }) => setMovies(res.data))
      .catch((err: unknown) => console.error("Lỗi tải phim:", err));

    // ✅ Lấy danh sách suất chiếu từ SQL
    apiClient
      .get("showtimes")
      .then((res: { data: Showtime[] }) => setShowtimes(res.data))
      .catch((err: unknown) => console.error("Lỗi tải suất chiếu:", err));
  }, []);

  useEffect(() => {
    if (selectedMovie && selectedShowtime) {
      apiClient
        .get(`bookings?movie_id=${selectedMovie}&showtime_id=${selectedShowtime}`)
        .then((res: { data: any[] }) => {
          const seats = res.data.flatMap(b => JSON.parse(b.seats || "[]"));
          setBookedSeats(seats);
        })
        .catch((err) => console.error("Lỗi tải ghế đã đặt:", err));
    }
  }, [selectedMovie, selectedShowtime]);


  const combos = [
    { id: 1, name: "Combo 1 - Bắp nhỏ + Nước nhỏ", price: 45000 },
    { id: 2, name: "Combo 2 - Bắp lớn + Nước lớn", price: 65000 },
    { id: 3, name: "Combo Couple - 2 Bắp + 2 Nước", price: 120000 },
    { id: 4, name: "Combo Family - 3 Bắp + 3 Nước", price: 180000 },
  ];
  const [selectedCombo] = useState<number | null>(null);
  // ✅ Tạo danh sách ghế tự động
  const generateSeats = () => {
    const seats: string[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
    const cols = 10;




    rows.forEach((row) => {
      for (let i = 1; i <= cols; i++) {
        // Hàng M là ghế đôi (Couple): chỉ 5 cặp (C1 → C5)
        if (["J", "K", "L"].includes(row)) {
          seats.push(`V${row}${i}`); // Ví dụ: VJ3, VK7
        }
        // Còn lại là ghế thường
        else {
          seats.push(`${row}${i}`);
        }
      }
    });

    return seats;
  };


  const currentMovie = movies.find((m) => m.id === selectedMovie);

  const allSeats = generateSeats();




  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) => {
      // Nếu ghế đang được chọn, bỏ chọn bình thường
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);

      // Nếu chưa chọn ghế nào => chọn thoải mái
      if (prev.length === 0) return [seat];

      // Kiểm tra cùng hàng (ví dụ A1, A2, A3...)
      const currentRow = seat.match(/[A-Z]+/g)?.[0];
      const currentNumber = parseInt(seat.match(/\d+/g)?.[0] || "0");

      // Lọc tất cả ghế cùng hàng hiện đang chọn
      const sameRowSeats = prev.filter((s) => s.startsWith(currentRow!));
      if (sameRowSeats.length > 0) {
        // Kiểm tra ghế liền kề (ví dụ A3 thì phải gần A2 hoặc A4)
        const seatNumbers = sameRowSeats.map((s) => parseInt(s.match(/\d+/g)![0])).sort((a, b) => a - b);
        const min = seatNumbers[0];
        const max = seatNumbers[seatNumbers.length - 1];

        // Ghế mới phải nằm sát bên trái hoặc bên phải chuỗi ghế hiện có
        if (currentNumber === min - 1 || currentNumber === max + 1) {
          return [...prev, seat].sort((a, b) => {
            const numA = parseInt(a.match(/\d+/g)![0]);
            const numB = parseInt(b.match(/\d+/g)![0]);
            return numA - numB;
          });
        } else {
          alert("⚠️ Vui lòng chọn ghế liền nhau trong cùng hàng!");
          return prev;
        }
      } else {
        // Nếu ghế khác hàng, không cho chọn thêm nếu đã chọn hàng khác
        const prevRow = prev[0].match(/[A-Z]+/g)?.[0];
        if (prevRow !== currentRow) {
          alert("⚠️ Vui lòng chọn ghế trong cùng một hàng!");
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie || !selectedShowtime || !customerName || !customerEmail) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const currentMovie = movies.find((m) => m.id === selectedMovie);
    const comboItem = combos.find((c) => c.id === selectedCombo);

    const ticketPrice = (currentMovie?.price || 0) * selectedSeats.length;
    const comboPrice = comboItem ? comboItem.price : 0;
    const totalPrice = ticketPrice + comboPrice;

    const bookingData = {
      movie_id: selectedMovie,
      showtime_id: selectedShowtime,
      seats: selectedSeats,
      combo_id: selectedCombo,
      total_price: totalPrice,
      customer: {
        name: customerName,
        email: customerEmail,
      },
    };

    try {
      await apiClient.post("bookings", bookingData);

      // ✅ Cập nhật giỏ hàng
      const cartItem = {
        id: Date.now(),
        movie: currentMovie?.title || "Phim",
        showtime: showtimes.find((s) => s.id === selectedShowtime)?.time,
        seats: selectedSeats,
        combo: comboItem ? comboItem.name : "Không chọn",
        combo_price: comboPrice,
        ticket_price: ticketPrice,
        total_price: totalPrice,
        customer: { name: customerName, email: customerEmail },
      };

      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));

      setBookedSeats((prev) => [...prev, ...selectedSeats]);
      setSelectedSeats([]);

      alert(`🎉 Đặt vé thành công!`);
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi đặt vé:", error);
      alert("❌ Đặt vé thất bại, vui lòng thử lại!");
    }
  };


  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 py-10 min-h-screen flex items-center justify-center">
      <div className="container max-w-4xl bg-gray-950/90 shadow-2xl rounded-2xl p-8 border border-yellow-500/30">
        <h1 className="text-3xl font-extrabold mb-6 pb-2 text-center text-yellow-400 animate-pulse">
          🎬 Trang Đặt Vé Xem Phim
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          {/* chọn phim */}
          <div>
            <label className="block font-semibold mb-2 text-yellow-300">🎥 Chọn phim</label>
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(Number(e.target.value))}
              className="w-full border rounded-lg p-2 bg-gray-800 text-white"
            >
              <option value="">-- Chọn phim --</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>

            {currentMovie && (
              <div className="flex items-center gap-4 mt-4 bg-gray-800/70 p-3 rounded-lg shadow-lg">
                <img
                  src={currentMovie.image}
                  alt={currentMovie.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-xl"
                />
                <div>
                  <h3 className="font-bold text-xl text-yellow-400">{currentMovie.title}</h3>
                  <p className="text-gray-400 text-sm">🎬 {currentMovie.genre}</p>
                  <p className="mt-2 font-semibold text-green-400">
                    💰 Giá vé: {Number(currentMovie.price).toLocaleString()} VND
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* chọn suất chiếu */}
          <div>
            <label className="block font-semibold mb-2 text-yellow-300">🕒 Chọn suất chiếu</label>
            <select
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(Number(e.target.value))}
              className="w-full border rounded-lg p-2 bg-gray-800 text-white"
            >
              <option value="">-- Chọn suất chiếu --</option>
              {showtimes.map((s) => (
                <option key={s.id} value={s.id}>
                  🏠 {s.room} — ⏰ {s.time.slice(0, 5)}
                </option>

              ))}
            </select>
          </div>

          {/* chọn ghế */}
          <div className="text-center">
            {/* Màn hình */}
            <div className="mb-6">
              <div className="relative mx-auto w-3/4 h-5 bg-yellow-400 rounded-t-full shadow-[0_0_20px_rgba(255,255,0,0.7)]"></div>
              <p className="text-base text-gray-200 mt-2 font-semibold tracking-wide">🖥️ MÀN HÌNH</p>
            </div>

            <label className="block font-semibold mb-3 text-yellow-300 text-lg">💺 Chọn ghế</label>

            <div className="relative inline-block">
              {/* Khu vực ghế */}
              <div className="grid grid-cols-10 gap-2 bg-gray-900/80 p-4 rounded-lg border border-yellow-500/30">
                {allSeats.map((seat) => {
                  const isSelected = selectedSeats.includes(seat);
                  const isBooked = bookedSeats.includes(seat);

                  // Phân loại ghế
                  const isVip = seat.startsWith("V");     // Ví dụ: V1, V2...
                  const isCouple = seat.startsWith("C");  // Ví dụ: C1, C2...

                  let seatClass = "";
                  if (isBooked) seatClass = "bg-red-600 text-gray-200 cursor-not-allowed";
                  else if (isSelected) seatClass = "bg-yellow-400 text-black scale-110";
                  else if (isVip) seatClass = "bg-purple-500 text-white hover:bg-yellow-300 hover:text-black";
                  else if (isCouple) seatClass = "bg-pink-500 text-white hover:bg-yellow-300 hover:text-black";
                  else seatClass = "bg-gray-700 text-white hover:bg-yellow-200 hover:text-black";

                  return (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => toggleSeat(seat)}
                      disabled={isBooked}
                      className={`px-3 py-2 rounded text-sm font-bold transition-all transform ${seatClass} ${isCouple ? "col-span-2" : ""
                        }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>

              {/* Lối ra bên phải */}
              <div className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 text-gray-300">
                🚪 Lối ra
              </div>
            </div>

            {/* Chú thích màu (Legend) */}
            <div className="flex justify-center gap-6 mt-5 text-sm text-gray-300 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded"></div>
                <span>Thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded"></div>
                <span>VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-pink-500 rounded"></div>
                <span>Couple</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-600 rounded"></div>
                <span>Đã đặt</span>
              </div>
            </div>

            {/* Ghế đã chọn */}
            <p className="mt-5 text-sm text-gray-300">
              ✅ Ghế đã chọn:{" "}
              <span className="text-yellow-400">
                {selectedSeats.join(", ") || "Chưa chọn"}
              </span>
            </p>

            {/* Ghế đã đặt */}
            <p className="mt-1 text-sm text-gray-400">
              ❌ Ghế đã đặt:{" "}
              <span className="text-red-400">
                {bookedSeats.length > 0 ? bookedSeats.join(", ") : "Không có"}
              </span>
            </p>
          </div>






          {/* thông tin khách hàng */}
          <div>
            <label className="block font-semibold mb-2 text-yellow-300">👤 Tên khách hàng</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded-lg p-2 bg-gray-800 text-white"
              placeholder="Nhập tên của bạn"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-yellow-300">📧 Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border rounded-lg p-2 bg-gray-800 text-white"
              placeholder="Nhập email"
            />
          </div>

          {/* submit */}
          <div className="text-center flex justify-center gap-4 pt-4">
            <Link to="/tasks">
              <button
                type="button"
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition"
              >
                🔙 Trở về
              </button>
            </Link>
            <button
              type="submit"
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
            >
              ✅ Xác nhận đặt vé
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

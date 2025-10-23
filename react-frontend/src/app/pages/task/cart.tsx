import { useEffect, useState } from "react";
import apiClient from "../../../constants/api";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  movie_id: number;
  showtime_id: number;
  seats: string[];
  customer_name: string;
  customer_email: string;
  created_at: string;
}

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
}

interface Combo {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [combos, setCombos] = useState<Combo[]>([
    { id: 1, name: "Combo 1 - Bắp + Nước", price: 50000, quantity: 0 },
    { id: 2, name: "Combo 2 - 2 Bắp + 2 Nước", price: 90000, quantity: 0 },
    { id: 3, name: "Combo 3 - Bắp Phô Mai + Nước Ngọt", price: 60000, quantity: 0 },
  ]);

  useEffect(() => {
    apiClient.get("/bookings").then((res) => {
      setCartItems(
        res.data.map((item: any) => ({
          ...item,
          seats: Array.isArray(item.seats)
            ? item.seats
            : JSON.parse(item.seats || "[]"),
        }))
      );
    });

    apiClient.get("/movies").then((res) => setMovies(res.data));

    setShowtimes([
      { id: 1, time: "10:00 AM" },
      { id: 2, time: "1:30 PM" },
      { id: 3, time: "6:00 PM" },
      { id: 4, time: "9:00 PM" },
    ]);
  }, []);

  const removeItem = async (id: number) => {
    try {
      await apiClient.delete(`/bookings/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      alert("🗑️ Xóa vé khỏi giỏ hàng thành công!");
    } catch (err) {
      console.error("❌ Lỗi xoá vé:", err);
      alert("Không thể xoá vé, vui lòng thử lại!");
    }
  };

  const getMovie = (id: number) => movies.find((m) => m.id === id);
  const getShowtime = (id: number) =>
    showtimes.find((s) => s.id === id)?.time || `Suất #${id}`;

  const formatVND = (amount: number) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // 👉 Thay đổi số lượng combo
  const updateComboQuantity = (id: number, delta: number) => {
    setCombos((prev) =>
      prev.map((combo) =>
        combo.id === id
          ? { ...combo, quantity: Math.max(0, combo.quantity + delta) }
          : combo
      )
    );
  };

  // 👉 Tính tổng combo
  const comboTotal = combos.reduce(
    (sum, c) => sum + c.price * c.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await apiClient.post("/checkout", {
        customer_name: cartItems[0]?.customer_name || "Guest",
        customer_email: cartItems[0]?.customer_email || "guest@example.com",
        items: cartItems.map((item) => ({
          id: item.id,
          movie_id: item.movie_id,
          showtime_id: item.showtime_id,
          seats: item.seats,
        })),
        combos: combos.filter((c) => c.quantity > 0), // 👈 thêm combo vào payload
        total:
          cartItems.reduce((sum, item) => {
            const movie = movies.find((m) => m.id === item.movie_id);
            return sum + (movie?.price || 75000) * item.seats.length;
          }, 0) + comboTotal,
      });

      alert(res.data.message);
      setCartItems([]);
      setCombos((prev) => prev.map((c) => ({ ...c, quantity: 0 })));
    } catch (error: any) {
      if (error.response) {
        alert("❌ Thanh toán thất bại: " + error.response.data.message);
      } else {
        alert("❌ Lỗi không xác định khi thanh toán!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative">
      {/* Nút quay lại */}
      <Link
        to="/tasks"
        className="fixed top-6 left-6 bg-gray-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition shadow-lg"
      >
        🔙 Trở về
      </Link>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-10 text-yellow-400">
          🛒 Giỏ hàng của bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vé phim */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-400">Giỏ hàng trống</p>
            ) : (
              cartItems.map((item) => {
                const movie = getMovie(item.movie_id);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <img
                      src={movie?.image}
                      alt={movie?.title}
                      className="w-28 h-40 object-cover"
                    />
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-300">
                          {movie?.title || `Phim #${item.movie_id}`}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Suất chiếu: {getShowtime(item.showtime_id)}
                        </p>
                        <p className="text-gray-300 mt-2">
                          Ghế:{" "}
                          <span className="font-semibold text-white">
                            {item.seats.join(", ")}
                          </span>
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Người đặt: {item.customer_name} ({item.customer_email})
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tổng kết + Combo */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl h-fit sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-yellow-300">Tổng kết</h2>

            <ul className="space-y-3 text-gray-300">
              {cartItems.map((item) => {
                const movie = getMovie(item.movie_id);
                return (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {movie?.title} ({item.seats.length} ghế)
                    </span>
                    <span>
                      {formatVND((movie?.price || 75000) * item.seats.length)}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* --- COMBO --- */}
            <div className="mt-6 border-t border-gray-600 pt-4">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">
                🍿 Combo Bắp Nước
              </h3>
              <div className="space-y-3">
                {combos.map((combo) => (
                  <div key={combo.id} className="flex justify-between items-center">
                    <span>
                      {combo.name}{" "}
                      <span className="text-gray-400">
                        ({formatVND(combo.price)})
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateComboQuantity(combo.id, -1)}
                        className="bg-gray-700 px-2 rounded hover:bg-gray-600"
                      >
                        -
                      </button>
                      <span>{combo.quantity}</span>
                      <button
                        onClick={() => updateComboQuantity(combo.id, 1)}
                        className="bg-yellow-500 text-black px-2 rounded hover:bg-yellow-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4 border-gray-600" />
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span>
                {formatVND(
                  cartItems.reduce((sum, item) => {
                    const movie = getMovie(item.movie_id);
                    return sum + (movie?.price || 75000) * item.seats.length;
                  }, 0) + comboTotal
                )}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-yellow-500 py-3 rounded-lg font-bold text-black hover:bg-yellow-400 transition"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

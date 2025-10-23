

import { useState, useEffect } from "react";
import apiClient from "../../../constants/api"; // axios instance

type ActiveTab = "home" | "manage" | "tickets";
type ManageTab = "add" | "edit" | "delete" | "showtime";

interface Movie {
  id: number;
  title: string;
  genre: string;
  price: number;
  new: boolean;
  image: string;
  description: string;
}

interface MovieForm {
  title: string;
  genre: string;
  price: number;
  new: boolean;
  image: string | File;
  description: string;
}

interface Order { id: number; customer_name: string; customer_email: string; total: number; status: string; created_at: string; }

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [manageTab, setManageTab] = useState<ManageTab>("add");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // Thêm ở đầu component
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);


  const [formData, setFormData] = useState<MovieForm>({
    title: "",
    genre: "",
    price: 75000,
    new: false,
    image: "",
    description: "",
  });

  const [editForm, setEditForm] = useState<MovieForm & { id: number | "" }>({
    id: "",
    title: "",
    genre: "",
    price: 75000,
    new: false,
    image: "",
    description: "",
  });

  interface Showtime {
    id: number;
    movie_id: number;
    time: string; // lưu datetime ISO
    room?: string;
    movie_title?: string;
  }

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showtimeForm, setShowtimeForm] = useState({
    room: "",
    time: "",
  });

  interface Showtime {
    id: number;
    time: string;
    room?: string;
  }

  const fetchShowtimes = async () => {
    try {
      const res = await apiClient.get("/showtimes");
      setShowtimes(res.data);
    } catch (err) {
      console.error("Lỗi load suất chiếu:", err);
    }
  };

  const [deleteId, setDeleteId] = useState<string>("");

  useEffect(() => {
    fetchMovies();
    fetchOrders();
    fetchShowtimes();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await apiClient.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Lỗi load phim:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/orders"); // API trả về danh sách vé
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi load vé:", err);
    }
  };

  // ================== ADD / EDIT / DELETE MOVIE ==================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    let value: string | number | boolean | File;

    if (target.type === "checkbox") value = target.checked;
    else if (target.type === "number") value = Number(target.value);
    else if (target.type === "file") value = target.files?.[0] || "";
    else value = target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("new", formData.new ? "1" : "0");
      formDataToSend.append("description", formData.description);
      if (formData.image instanceof File) formDataToSend.append("image", formData.image);

      await apiClient.post("/movies", formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Thêm phim thành công");
      fetchMovies();
    } catch {
      alert("❌ Lỗi khi thêm phim!");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    let value: string | number | boolean | File;

    if (target.type === "checkbox") value = target.checked;
    else if (target.type === "number") value = Number(target.value);
    else if (target.type === "file") value = target.files?.[0] || "";
    else value = target.value;

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) {
      alert("Vui lòng nhập/chọn ID phim cần sửa!");
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", editForm.title);
      formDataToSend.append("genre", editForm.genre);
      formDataToSend.append("price", String(editForm.price));
      formDataToSend.append("new", editForm.new ? "1" : "0");
      formDataToSend.append("description", editForm.description);
      if (editForm.image instanceof File) formDataToSend.append("image", editForm.image);

      await apiClient.post(`/movies/${editForm.id}?_method=PUT`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Cập nhật thành công");
      fetchMovies();
    } catch {
      alert("❌ Lỗi khi cập nhật phim!");
    }
  };

  const handleDeleteMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteId) {
      alert("Vui lòng nhập ID phim cần xóa!");
      return;
    }
    try {
      await apiClient.delete(`/movies/${deleteId}`);
      alert("🗑️ Xóa phim thành công");
      setDeleteId("");
      fetchMovies();
    } catch {
      alert("❌ Lỗi khi xóa phim!");
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setManageTab("edit");
    setEditForm({
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      price: movie.price,
      new: movie.new,
      image: movie.image,
      description: movie.description,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-700 via-purple-800 to-black p-4 flex justify-between items-center shadow-lg backdrop-blur-md bg-opacity-90">
        <h1 className="text-3xl font-extrabold tracking-wide text-red-500">
          🎬 CGV Admin
        </h1>
        <ul className="flex gap-6 font-medium text-lg">
          {["home", "manage", "tickets"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab as ActiveTab)}
              className={`cursor-pointer px-4 py-2 rounded-full transition ${activeTab === tab
                ? "bg-red-500 text-white font-bold"
                : "hover:bg-red-700"
                }`}
            >
              {tab === "home"
                ? "Trang chủ"
                : tab === "manage"
                  ? "Quản lý"
                  : "Danh sách khách hàng"}
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Trang chủ */}
        {activeTab === "home" && (
          <div className="space-y-10">
            <h2 className="text-4xl font-extrabold text-center text-red-500 tracking-wide">
              🎬 Bảng điều khiển CGV Admin
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl shadow-xl hover:scale-105 transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Số lượng phim</h3>
                  <span className="text-3xl">🎥</span>
                </div>
                <p className="mt-4 text-5xl font-extrabold text-white">{movies.length}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Vé đã đặt</h3>
                  <span className="text-3xl">🎟️</span>
                </div>
                <p className="mt-4 text-5xl font-extrabold text-black">{orders.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Doanh thu</h3>
                  <span className="text-3xl">💰</span>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-white">
                  {new Intl.NumberFormat("vi-VN").format(
                    orders.reduce((sum, o) => sum + Number(o.total || 0), 0)
                  )}đ
                </p>
              </div>
            </div>

            {/* Box Thông báo */}
            <div className="bg-gray-900/80 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto backdrop-blur-md">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">
                ⚡ Thông tin nhanh
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-red-400 text-xl">➕</span>
                  Thêm, sửa, xóa phim trong mục <b>Quản lý</b>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400 text-xl">📑</span>
                  Xem danh sách vé chi tiết trong mục <b>Danh sách vé</b>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">📈</span>
                  Doanh thu được cập nhật theo thời gian thực
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400 text-xl">💡</span>
                  Trang chủ hiển thị số liệu tổng quan nhanh chóng
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Quản lý phim */}
        {activeTab === "manage" && (
          <div>
            <h2 className="text-3xl font-bold text-center text-red-500 mb-8">🎥 Quản lý phim</h2>

            {/* Submenu */}
            <div className="flex justify-center gap-6 mb-8">
              <button
                onClick={() => setManageTab("add")}
                className={`px-6 py-2 rounded-full font-semibold ${manageTab === "add" ? "bg-green-600 text-white" : "bg-gray-700 hover:bg-green-500"
                  }`}
              >
                ➕ Thêm
              </button>
              <button
                onClick={() => setManageTab("edit")}
                className={`px-6 py-2 rounded-full font-semibold ${manageTab === "edit" ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-yellow-400"
                  }`}
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => setManageTab("delete")}
                className={`px-6 py-2 rounded-full font-semibold ${manageTab === "delete" ? "bg-red-600 text-white" : "bg-gray-700 hover:bg-red-500"
                  }`}
              >
                🗑️ Xóa
              </button>

              <button
                onClick={() => setManageTab("showtime")}
                className={`px-6 py-2 rounded-full font-semibold ${manageTab === "showtime" ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-blue-500"
                  }`}
              >
                🕒 Suất chiếu
              </button>


            </div>



            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Danh sách phim */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-h-[650px] overflow-y-auto">
                <h3 className="text-2xl font-bold text-red-400 mb-4">📋 Danh sách phim</h3>
                {movies.length === 0 ? (
                  <p className="text-gray-400">Chưa có phim nào</p>
                ) : (
                  <div className="grid gap-4">
                    {movies.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        className="flex items-center gap-4 bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition"
                      >
                        <span className="w-10 text-center text-red-500 font-bold">{movie.id}</span>
                        <img src={movie.image} alt={movie.title} className="w-16 h-20 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold">{movie.title}</p>
                          <p className="text-sm text-gray-400">
                            {movie.genre} • {movie.price.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form */}
              <div>
                {manageTab === "add" && (
                  <form onSubmit={handleAddMovie} className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-2xl font-bold text-green-400 mb-4">➕ Thêm phim mới</h3>
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Tên phim" />
                    {/* Thể loại - dropdown */}
                    <select className="w-full p-3 rounded-lg bg-gray-800 text-white"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn thể loại --</option>
                      <option value="Hành Động">Hành Động</option>
                      <option value="Tình Cảm">Tình Cảm</option>
                      <option value="Kinh Dị">Kinh Dị</option>
                      <option value="Gia Đình">Gia Đình</option>
                      <option value="Học Đường">Học Đường</option>
                      <option value="Hài Hước">Hài Hước</option>
                      <option value="Phiêu Lưu">Phiêu Lưu</option>
                      <option value="Khoa Học Viễn Tưởng">Khoa Học Viễn Tưởng</option>
                      <option value="Hoạt Hình">Hoạt Hình</option>
                      <option value="Tâm Lý">Tâm Lý</option>
                      <option value="Cổ Trang">Cổ Trang</option>
                    </select>
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá vé" />
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="file" name="image" onChange={handleChange} accept="image/*" />
                    <textarea className="w-full p-3 rounded-lg bg-gray-800 text-white" name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả phim" />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="new" checked={formData.new} onChange={handleChange} />
                      <span>Phim sắp chiếu</span>
                    </label>
                    <button className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700">Lưu phim</button>
                  </form>
                )}

                {manageTab === "edit" && (
                  <form onSubmit={handleUpdateMovie} className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">✏️ Sửa phim</h3>
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="number" name="id" value={editForm.id} readOnly />
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="text" name="title" value={editForm.title} onChange={handleEditChange} placeholder="Tên phim mới" />
                    {/* Thể loại - dropdown */}
                    <select className="w-full p-3 rounded-lg bg-gray-800 text-white"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn thể loại --</option>
                      <option value="Hành Động">Hành Động</option>
                      <option value="Tình Cảm">Tình Cảm</option>
                      <option value="Kinh Dị">Kinh Dị</option>
                      <option value="Gia Đình">Gia Đình</option>
                      <option value="Học Đường">Học Đường</option>
                      <option value="Hài Hước">Hài Hước</option>
                      <option value="Phiêu Lưu">Phiêu Lưu</option>
                      <option value="Khoa Học Viễn Tưởng">Khoa Học Viễn Tưởng</option>
                      <option value="Hoạt Hình">Hoạt Hình</option>
                      <option value="Tâm Lý">Tâm Lý</option>
                      <option value="Cổ Trang">Cổ Trang</option>
                    </select>                         <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="number" name="price" value={editForm.price} onChange={handleEditChange} placeholder="Giá vé mới" />
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="file" name="image" onChange={handleEditChange} accept="image/*" />
                    <textarea className="w-full p-3 rounded-lg bg-gray-800 text-white" name="description" value={editForm.description} onChange={handleEditChange} placeholder="Mô tả mới" />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="new" checked={editForm.new} onChange={handleEditChange} />
                      <span>Phim sắp chiếu</span>
                    </label>
                    <button className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600">Cập nhật</button>
                  </form>
                )}

                {manageTab === "delete" && (
                  <form onSubmit={handleDeleteMovie} className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-2xl font-bold text-red-400 mb-4">🗑️ Xóa phim</h3>
                    <input className="w-full p-3 rounded-lg bg-gray-800 text-white" type="number" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} placeholder="Nhập ID phim cần xóa" />
                    <button className="w-full bg-red-600 py-2 rounded-lg hover:bg-red-700">Xóa phim</button>
                  </form>
                )}


                {manageTab === "showtime" && (
                  <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
                    <h3 className="text-2xl font-bold text-blue-400">🕒 Quản lý suất chiếu</h3>

                    {/* Form thêm / sửa suất chiếu */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          if (!showtimeForm.room || !showtimeForm.time) {
                            alert("Vui lòng nhập đầy đủ thông tin!");
                            return;
                          }

                          if (editingShowtime) {
                            // Sửa suất chiếu
                            await apiClient.put(`/showtimes/${editingShowtime.id}`, {
                              room: showtimeForm.room,
                              time: showtimeForm.time,
                            });
                            alert("✅ Đã cập nhật suất chiếu");
                            setEditingShowtime(null);
                          } else {
                            // Thêm suất chiếu
                            await apiClient.post("/showtimes", {
                              room: showtimeForm.room,
                              time: showtimeForm.time,
                            });
                            alert("✅ Đã thêm suất chiếu mới");
                          }

                          setShowtimeForm({ room: "", time: "" });
                          fetchShowtimes();
                        } catch (err) {
                          console.error("Lỗi lưu suất chiếu:", err);
                          alert("❌ Không thể lưu suất chiếu");
                        }
                      }}
                      className="space-y-4"
                    >
                      {/* Nhập phòng */}
                      <input
                        type="text"
                        placeholder="🏠 Nhập tên phòng (VD: Phòng 1)"
                        value={showtimeForm.room}
                        onChange={(e) => setShowtimeForm((prev) => ({ ...prev, room: e.target.value }))}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white"
                      />

                      {/* Nhập giờ */}
                      <input
                        type="time"
                        value={showtimeForm.time}
                        onChange={(e) => setShowtimeForm((prev) => ({ ...prev, time: e.target.value }))}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white"
                      />

                      <button className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
                        {editingShowtime ? "💾 Lưu thay đổi" : "➕ Thêm suất chiếu"}
                      </button>
                    </form>

                    {/* Danh sách suất chiếu */}
                    <div>
                      <h4 className="text-xl font-semibold text-blue-300 mt-6 mb-2">
                        📋 Danh sách suất chiếu
                      </h4>
                      {showtimes.length === 0 ? (
                        <p className="text-gray-400">Chưa có suất chiếu</p>
                      ) : (
                        <div className="overflow-y-auto max-h-[400px] space-y-2">
                          {showtimes.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                            >
                              <div>
                                <p className="text-gray-300">🏠 Phòng: {s.room}</p>
                                <p className="text-gray-300">⏰ Giờ chiếu: {s.time.slice(0, 5)}</p>
                              </div>

                              <div className="flex gap-2">
                                {/* Sửa */}
                                <button
                                  onClick={() => {
                                    setEditingShowtime(s);
                                    setShowtimeForm({ room: s.room || "", time: s.time || "" });
                                  }}
                                  className="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-600"
                                >
                                  ✏️ Sửa
                                </button>

                                {/* Xóa */}
                                <button
                                  onClick={async () => {
                                    if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;
                                    try {
                                      await apiClient.delete(`/showtimes/${s.id}`);
                                      fetchShowtimes();
                                    } catch (err) {
                                      console.error("Lỗi xóa suất chiếu:", err);
                                      alert("❌ Không thể xóa suất chiếu");
                                    }
                                  }}
                                  className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}





              </div>
            </div>
          </div>
        )}

        {/* Danh sách vé */}
        {activeTab === "tickets" && (
          <div>
            <h2 className="text-3xl font-bold text-center text-red-500 mb-8">
              🎟️ Danh sách vé đã đặt
            </h2>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center">Chưa có vé nào</p>
            ) : (
              <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800 text-red-400">
                    <tr>
                      <th className="p-3 text-left">Mã vé</th>
                      <th className="p-3 text-left">Khách hàng</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Tổng tiền</th>
                      <th className="p-3 text-left">Trạng thái</th>
                      <th className="p-3 text-left">Ngày đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-700 hover:bg-gray-800"
                      >
                        <td className="p-3">{order.id}</td>
                        <td className="p-3">{order.customer_name}</td>
                        <td className="p-3">{order.customer_email}</td>
                        <td className="p-3 text-green-400">
                          {order.total.toLocaleString()}đ
                        </td>
                        <td className="p-3">{order.status}</td>
                        <td className="p-3">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


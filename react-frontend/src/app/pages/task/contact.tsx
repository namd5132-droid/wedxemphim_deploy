import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await axios.post("http://127.0.0.1:8001/api/contact", form);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Gửi thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-6 text-gray-100">
      {/* Nút quay về */}
      <Link
        to="/tasks"
        className="absolute top-6 left-6 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
      >
        ← Quay về
      </Link>

      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-2xl rounded-2xl w-full max-w-md p-8 transition hover:scale-[1.01] duration-200">
        <h2 className="text-2xl font-semibold mb-2 text-center text-yellow-400">
          📩 Liên hệ CGV Việt Nam
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Hãy gửi phản hồi hoặc thắc mắc, chúng tôi sẽ phản hồi sớm nhất.
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />

            <input
              type="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />

            <textarea
              placeholder="Nội dung liên hệ"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            ></textarea>

            <button
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi thông tin"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xl font-medium text-green-400">✅ Gửi thành công!</p>
            <Link
              to="/tasks"
              className="inline-block bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Quay về trang chính
            </Link>
          </div>
        )}

        {errorMsg && <p className="text-center mt-4 text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
}

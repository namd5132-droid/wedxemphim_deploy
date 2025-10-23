import muado from "../../../assets/img/muado.jpg";
import { AxiosError } from "axios";
import { useState } from "react";
import { AuthSevice } from "../../../services/auth-services";
import { useNavigate, Link } from "react-router-dom";

export default function LoginUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  try {
    const respon = await AuthSevice.login(formData);
    console.log("Login response:", respon.data);

    // Parse user JSON string
    const userObj = JSON.parse(respon.data.user);

    // Lưu vào localStorage
    localStorage.setItem("token", respon.data.token);
    localStorage.setItem("user", JSON.stringify(userObj));

    // Cập nhật state
    setUser({ name: userObj.name });

    window.alert(`✅ Đăng nhập thành công! Xin chào ${userObj.name}`);

    navigate("/tasks");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        const dataErrors = error.response.data.errors;
        setErrors({
          email: dataErrors.email ? dataErrors.email[0] : "",
          password: dataErrors.password ? dataErrors.password[0] : "",
        });
      } else if (error.response?.status === 401) {
        setMessage(error.response.data.message);
      }
    } else {
      console.log(error);
    }
  }
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex max-w-4xl w-full">
                <div className="hidden md:block md:w-1/2">
                    <img src={muado} alt="Login" className="w-full h-full object-cover" />
                </div>

                <div className="w-full lg:w-1/2 p-8 md:p-12">
                    <h2 className="text-2xl font-semibold mb-6">Login</h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Hãy nhập email"
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                                name="email"
                                onChange={handleChange}
                            />
                            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="********"
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                                name="password"
                                onChange={handleChange}
                            />
                            {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
                            {message && (<p className="text-red-500 text-sm mt-1">{message}</p>)}
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-red-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 border-t pt-4 text-sm text-gray-600">
                        <Link to="/users/register" className="text-purple-600 font-medium hover:underline">Create account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

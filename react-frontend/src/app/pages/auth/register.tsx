import muado from "../../../assets/img/muado.jpg";
import { AxiosError } from "axios";
import { useState } from "react";
import { AuthSevice } from "../../../services/auth-services";
import { Link } from "react-router-dom";


export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
        const respon = await AuthSevice.register(formData);
        console.log('User registered successfully:', respon);

        // Thông báo đăng ký thành công
        window.alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");

        // Chuyển về trang login
        window.location.href = "/users/login"; 
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 422) {
            const dataErrors = error.response.data.errors;
            setErrors({
                name: dataErrors.name ? dataErrors.name[0] : '',
                email: dataErrors.email ? dataErrors.email[0] : '',
                password: dataErrors.password ? dataErrors.password[0] : '',
                password_confirmation: dataErrors.password_confirmation ? dataErrors.password_confirmation[0] : '',
            });
        } else {
            console.log(error);
        }
    }
};
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex max-w-4xl w-full">
          {/* Left Image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={muado}
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Create account</h2>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="name" onChange={handlechange}
                />
                {errors.name && (
                  <p className="text-red-500"> {errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="xxx@gmail.com"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="email" onChange={handlechange}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="password" onChange={handlechange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="password_confirmation" onChange={handlechange}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                onClick={handleSubmit}>
                Create account
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              <Link to="/users/login" className="text-red-600 font-medium hover:underline">  Already have an account? Login</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
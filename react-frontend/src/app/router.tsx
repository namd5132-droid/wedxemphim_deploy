import { createBrowserRouter } from "react-router-dom";
import LoginUser from "./pages/auth/login";
import RegisterUser from "./pages/auth/register";
import TaskIndex from "./pages/task/tasks";
import Contact from "./pages/task/contact";
import Booking from "./pages/task/booking";
import Detail from "./pages/task/detail";
import Admin from "./pages/admin/admin";
import Search from "./pages/task/search";
import FillNew from "./pages/fill/new";
import Cart from "./pages/task/cart";
import FillNow from "./pages/fill/now";
import FillImax from "./pages/fill/imax";
const router = createBrowserRouter([
  {
    path: "/users/register",
    element: <RegisterUser />,
  },
  {
    path: "/users/login",
    element: <LoginUser />,
  },
  {
    path: "/tasks",
    element: <TaskIndex />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/booking",
    element: <Booking />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/detail/:id", // ✅ Đã sửa thành đường dẫn tuyệt đối
    element: <Detail />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "movies/fill/new",
    element: <FillNew />,
  },
  {
    path: "movies/fill/now",
    element: <FillNow />,
  },
   {
    path: "movies/fill/imax",
    element: <FillImax />,
  },
  
]);


export default router;

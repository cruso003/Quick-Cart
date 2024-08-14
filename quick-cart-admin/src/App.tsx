import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';
import Navbar from './components/navbar/NavBar';
import Menu from './components/menu/Menu';
import Footer from './components/footer/Footer';
import NotFound from './components/notFound/NotFound';
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Profile from './pages/profile/Profile';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetpassword/ResetPassword';
import NewProduct from './components/New/NewProduct';
import Products from './components/dataTable/productTable';
import Categories from './components/dataTable/categoryTable';
import NewCategory from './components/New/NewCategory';
import NewBanner from './components/New/NewBanner';
import NewSubcategory from './components/New/NewSubCategory';

const Layout = () => {
  return (
    <div className="main">
      <Navbar />
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/products/add-product",
        element: <NewProduct />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/categories",
        element: <Categories />
      },
      {
        path: "/categories/add-category",
        element: <NewCategory />
      },
      {
        path: "/subcategories/add-subcategory",
        element: <NewSubcategory />
      },
      {
        path: "/banners/add-banner",
        element: <NewBanner />
      }
    ],
  },
  
  {
    path: "*",
    element: <NotFound/>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
  },
  {path: "/reset-password",
    element: <ResetPassword/>,
  }
  
]);
function App() {
  return (
    <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </AuthProvider>
  )
  
}

export default App

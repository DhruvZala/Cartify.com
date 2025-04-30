import React from "react";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const isLoggedIn = localStorage.getItem("jwtToken");
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("password");
    localStorage.removeItem("userId");
    navigate("/");
    document.cookie = "jwtToken=;  path=/;";
    window.location.reload();
  };

  return (
    <div className="navBar flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 py-3 sm:py-4 shadow-md sticky top-0 bg-white z-50 border-b border-gray-100 backdrop-blur-sm bg-opacity-90">
      <div className="navLeft flex flex-col justify-center w-full md:w-1/3 mb-3 md:mb-0">
        <Link to="/ProductPage" className="group">
          <h2 className="text-2xl sm:text-3xl font-bold pl-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
            Cartify.com
          </h2>
        </Link>
        <h4 className="text-xs sm:text-sm md:text-base text-gray-500 pl-2 font-medium tracking-wide">
          Discover amazing products at unbeatable prices!
        </h4>
      </div>

      <div className="navRight flex items-center justify-end gap-4 sm:gap-6 w-full md:w-1/3">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5">
            <CircleUserRound
              size={20}
              className="text-gray-600 hidden sm:block"
            />
            <div className="flex gap-1 text-xs sm:text-sm md:text-base">
              {isLoggedIn ? (
                <>
                  <Link to="/userDetail" className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50 cursor-pointer">
                    {userName || userEmail}
                  </Link>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Login"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
                  >
                    LogIn
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/registerPage"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative group">
          {isLoggedIn ? (
            <Link
              to="/Cart"
              className="p-1 sm:p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
            >
              <ShoppingCart
                size={20}
                className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
              />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-sm">
                  {cartCount}
                </div>
              )}
            </Link>
          ) : (
            <div className="p-1 sm:p-2 rounded-full flex items-center justify-center cursor-not-allowed opacity-50 relative">
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </div>
              )}
              <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Please login to access cart
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

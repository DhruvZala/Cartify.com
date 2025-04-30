import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, Package, LogOut } from "lucide-react";


interface User {
  _id: string;
  name: string;
  email: string;
  userId: string;
  createdAt: string;
}

interface Product {
  quantity: number;
  id: number;
  _id: string;
  title: string;
  price: number;
  description: string;
  isActive: boolean;
  category: string;
}

type ActiveTab = "users" | "products";

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}


const API_BASE_URL = "http://localhost:5000/api/admin";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  icon,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{count}</p>
      </div>
      <div className="bg-gray-50 rounded-full p-3">{icon}</div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("name");
  };

  const toggleProductStatus = async (
    productId: string,
    currentStatus: boolean
  ) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.patch(
        `${API_BASE_URL}/products/${productId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !currentStatus }
            : product
        )
      );
    } catch (err) {
      console.error("Error updating product status:", err);
      setError("Failed to update product status");
    }
  };

  const dashboardCards = [
    {
      title: "Total Users",
      count: users.length,
      icon: <Users className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Total Products",
      count: products.length,
      icon: <Package className="w-8 h-8 text-green-500" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, Admin @Dhruv Zala
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              count={card.count}
              icon={card.icon}
            />
          ))}
        </section>

        {/* Main Content */}
        <section className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </div>
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "users" ? (
              <UsersTable users={users} />
            ) : (
              <ProductsTable
                products={products}
                onToggleStatus={toggleProductStatus}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// Extracted Users Table Component
interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>User ID</TableHeader>
          <TableHeader>Created At</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">
              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.userId}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Extracted Products Table Component
interface ProductsTableProps {
  products: Product[];
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onToggleStatus,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>ID</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Quantity</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <TableCell>{product.id}</TableCell>
            <TableCell className="font-medium text-gray-900">
              {product.title}
            </TableCell>
            <TableCell className="text-green-600 font-medium">
              ₹{product.price}
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>
              <StatusBadge
                isActive={product.isActive}
                onClick={() => onToggleStatus(product._id, product.isActive)}
              />
            </TableCell>
            <TableCell>{product.quantity}</TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Reusable Table Components
interface TableHeaderProps {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
    <div>{children}</div>
  </td>
);

interface StatusBadgeProps {
  isActive: boolean;
  onClick: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, onClick }) => (
  <span
    onClick={onClick}
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-75 ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Available" : "Not Available"}
  </span>
);

export default AdminDashboard;

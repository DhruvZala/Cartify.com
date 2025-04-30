import { Copyright } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <nav className="grid grid-cols-1 gap-2">
              <a href="#" className="hover:text-white transition-colors">
                Shipping & Returns
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Store Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Payment Methods
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="mr-2">📞</span> Tel: 123-456-7890
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span> info@mysite.com
              </p>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Pinterest
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">For New Update</h3>
            <p className="text-sm">
              Join our mailing list and never miss an update
            </p>
            <form className="mt-4 space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscribe"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded"
                />
                <label htmlFor="subscribe" className="ml-2 text-sm">
                  Yes, subscribe me to your newsletter
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
            <div className="flex items-center">
              <Copyright size={16} className="mr-1" />
              <span>
                {new Date().getFullYear()} Dhruv Zala. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

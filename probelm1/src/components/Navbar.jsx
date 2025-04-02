import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700" : ""
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold">Social Media Analytics</div>
          <div className="flex space-x-4">
            <Link to="/" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive("/")}`}>
              Feed
            </Link>
            <Link
              to="/top-users"
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive("/top-users")}`}
            >
              Top Users
            </Link>
            <Link
              to="/trending-posts"
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive("/trending-posts")}`}
            >
              Trending Posts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-center py-6 px-8 border-b border-gray-200 mb-12 bg-white/80 backdrop-blur-sm fixed top-0 left-0 z-50">
      <div className="w-4/5 max-w-7xl flex items-center justify-between">
        <Link to="/" className="font-mono text-3xl font-bold hover:scale-103 transition">Jack Douglass</Link>
        <div className="flex space-x-8">
          <Link to="/writings" className="font-mono text-xl hover:scale-105 transition">Writings</Link>
          <Link to="/doings" className="font-mono text-xl hover:scale-105 transition">Doings</Link>
          <Link to="/cv" className="font-mono text-xl hover:scale-108 transition">CV</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

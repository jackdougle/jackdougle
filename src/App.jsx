import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import ScrollToTop from "./ScrollToTop.jsx"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Blog from "./pages/Blog.jsx"
import NucleazeIntro from "./pages/blog/NucleazeIntro.jsx"

function App() {
    const location = useLocation()

    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <div className="w-full pt-32 flex-1 flex flex-col">
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/nucleaze-intro" element={<NucleazeIntro />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App
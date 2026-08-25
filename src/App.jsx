import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import ScrollToTop from "./ScrollToTop.jsx"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Thoughts from "./pages/Thoughts.jsx"
import Blog from "./pages/Blog.jsx"
import BlogPost from "./pages/BlogPost.jsx"

function App() {
    const location = useLocation()

    return (
        <div className="relative min-h-dvh flex flex-col overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <main className="flex w-full flex-col pt-26 pb-8 sm:pt-28 sm:pb-10">
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/thoughts" element={<Thoughts />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App
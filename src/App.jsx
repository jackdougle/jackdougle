import { useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import ScrollToTop from "./ScrollToTop.jsx"
import { useLayoutViewport } from "./hooks/useLayoutViewport.js"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Thoughts from "./pages/Thoughts.jsx"
import Blog from "./pages/Blog.jsx"
import BlogPost from "./pages/BlogPost.jsx"

function App() {
    const location = useLocation()
    const { isLg } = useLayoutViewport()
    const [navHeight, setNavHeight] = useState(0)

    return (
        <div className="relative min-h-dvh flex flex-col overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar onHeightChange={setNavHeight} />
            <div style={{ paddingTop: navHeight }}>
                <main className={`flex w-full flex-col pt-8 pb-8 sm:pt-10 sm:pb-10${isLg ? " desktop-scale" : ""}`}>
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
        </div>
    );
}

export default App

import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Analytics } from "@vercel/analytics/react"
import ScrollToTop from "./ScrollToTop.jsx"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"
import Thoughts from "./pages/Thoughts.jsx"

function App() {
    const location = useLocation()

    return (
        <div className="relative min-h-[calc(100dvh)] flex flex-col overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col pt-26 sm:pt-28">
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/thoughts" element={<Thoughts />} />
                    </Routes>
                </AnimatePresence>
            </div>
            <Analytics />
        </div>
    );
}

export default App
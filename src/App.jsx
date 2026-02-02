import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import ScrollToTop from "./ScrollToTop.jsx"

import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home.jsx"

function App() {
    const location = useLocation()

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Navbar />
            <div className="w-full max-w-3xl mx-auto px-4 pt-32 pb-10">
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route index element={<Home />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App
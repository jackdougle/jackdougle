import { motion } from 'framer-motion';

function AnimWrapper({ children, slide = true }) {
    return(
        <motion.div
            className="flex min-h-0 min-w-0 w-full flex-col"
            initial={{ opacity: 0, ...(slide ? { y: 10 } : {}) }}
            animate={{ opacity: 1, ...(slide ? { y: 0 } : {}) }}
            exit={{ opacity: 0, ...(slide ? { y: 10 } : {}) }}
        >
            {children}
        </motion.div>
    )
}

export default AnimWrapper;
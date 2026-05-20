import { motion } from 'framer-motion';

function AnimWrapper({children}) {
    return(
        <motion.div
            className="flex min-h-0 min-w-0 flex-1 flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
        >
            {children}
        </motion.div>
    )
}

export default AnimWrapper;
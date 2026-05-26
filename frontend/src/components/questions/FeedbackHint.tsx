import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  hint: string;
}

export default function FeedbackHint({ hint }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3"
      >
        <span className="text-yellow-500 text-lg flex-shrink-0">💡</span>
        <p className="text-yellow-800 text-sm font-medium">{hint}</p>
      </motion.div>
    </AnimatePresence>
  );
}

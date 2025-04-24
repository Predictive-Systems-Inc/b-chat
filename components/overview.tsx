import { motion } from 'framer-motion';
import { MessageIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <div className="flex justify-center">
          <MessageIcon size={48} />
        </div>
        <p className="text-4xl font-bold">How can I help you today?</p>
        <p className="text-2xl">
          Find answers fast, and keep data secure — all in one AI platform
          designed specifically for enterprise needs.
        </p>
      </div>
    </motion.div>
  );
};

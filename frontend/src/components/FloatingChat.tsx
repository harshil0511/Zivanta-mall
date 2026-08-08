'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import useStore from '@/store/useStore'

export default function FloatingChat() {
  const { chatOpen, setChatOpen } = useStore()

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(201,168,76,0.15)', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite', transform: 'scale(1.4)' }} />
      <AnimatePresence mode="wait">
        {!chatOpen ? (
          <motion.button key="open"
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)' }}
            aria-label="Open chat"
            onClick={() => setChatOpen(true)}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle size={22} color="white" />
          </motion.button>
        ) : (
          <motion.button key="close"
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.3)' }}
            aria-label="Close chat"
            onClick={() => setChatOpen(false)}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <X size={22} style={{ color: 'var(--gold)' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

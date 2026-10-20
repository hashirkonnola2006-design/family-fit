import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { subscribeServerWaking, dismissServerWaking } from '../../api/client'

export default function ServerWakingBanner() {
  const [isWaking, setIsWaking] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeServerWaking((waking) => {
      setIsWaking(waking)
    })
    return unsubscribe
  }, [])

  // Safety auto-dismiss after 15 seconds so it never gets permanently stuck
  useEffect(() => {
    if (!isWaking) return
    const timer = setTimeout(() => {
      setIsWaking(false)
      dismissServerWaking()
    }, 15000)
    return () => clearTimeout(timer)
  }, [isWaking])

  const handleDismiss = () => {
    setIsWaking(false)
    dismissServerWaking()
  }

  return (
    <AnimatePresence>
      {isWaking && (
        <motion.aside
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[430px] pointer-events-auto select-none"
          role="status"
          aria-live="polite"
        >
          <div className="bg-[#1A2E22]/95 backdrop-blur-md text-white border border-[#2D4A37] rounded-full pl-3.5 pr-2 py-2 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#274633] text-[#78D39E] flex items-center justify-center shrink-0">
                <Loader2 size={13} className="animate-spin text-[#78D39E]" />
              </div>
              <p className="text-xs font-medium text-[#E4EDE7] leading-tight truncate">
                Waking up the server, this can take up to a minute...
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-[#A1B8A9] hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X size={14} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

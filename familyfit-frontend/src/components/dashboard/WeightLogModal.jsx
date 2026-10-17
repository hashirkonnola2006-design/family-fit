import { useState } from 'react'
import { X, Check, Activity } from 'lucide-react'

export default function WeightLogModal({
  isOpen,
  selectedMember,
  onClose,
  onSaveWeight,
}) {
  const [weight, setWeight] = useState(selectedMember?.weightKg || 68.0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (onSaveWeight) onSaveWeight(parseFloat(weight))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm border border-[#E2DBD0] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-5 border-b border-[#EDE8DE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] text-[#EA580C] flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F5A3A]">
                Health Tracking
              </span>
              <h3 className="text-base font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
                Log Weight ({selectedMember?.name || 'Member'})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#EDE8DE] flex items-center justify-center text-[#6B7A70] hover:text-[#1F2A24] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2A24] mb-1.5">
              Current Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="20"
              max="250"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#DCD5C8] text-sm font-bold text-[#1F2A24] outline-none focus:border-[#3F5A3A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2A24] mb-1.5">
              Measurement Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#DCD5C8] text-xs font-semibold text-[#1F2A24] outline-none focus:border-[#3F5A3A]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#DCD5C8] text-xs font-bold text-[#6B7A70] hover:bg-[#FAF7F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white text-xs font-bold shadow-xs"
            >
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

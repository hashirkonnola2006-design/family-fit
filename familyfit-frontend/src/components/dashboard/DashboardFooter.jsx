import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

export default function DashboardFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full py-6 mt-12 border-t-2 border-[#E5E5E5] text-xs text-[#AFAFAF] flex flex-col sm:flex-row items-center justify-between gap-4 font-bold">
      <div className="flex items-center gap-1.5">
        <span>© {new Date().getFullYear()} FamilyFit. Wholesome Kerala Family Nutrition.</span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/privacy"
          className="text-[#AFAFAF] hover:text-[#58CC02] hover:underline font-bold transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-[#E5E5E5]">•</span>
        <Link
          to="/terms"
          className="text-[#AFAFAF] hover:text-[#58CC02] hover:underline font-bold transition-colors"
        >
          Terms &amp; Conditions
        </Link>
        <span className="text-[#E5E5E5]">•</span>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1 text-[#AFAFAF] hover:text-[#58CC02] font-black cursor-pointer transition-colors"
        >
          <span>Back to top</span>
          <ArrowUp size={14} strokeWidth={3} />
        </button>
      </div>
    </footer>
  )
}

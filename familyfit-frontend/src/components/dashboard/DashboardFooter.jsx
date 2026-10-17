import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

export default function DashboardFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full py-6 mt-12 border-t border-[#E2DBD0] text-xs text-[#6B7A70] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 font-medium">
        <span>© {new Date().getFullYear()} FamilyFit. Wholesome Kerala Family Nutrition.</span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/privacy"
          className="text-[#6B7A70] hover:text-[#3F5A3A] hover:underline font-semibold transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-[#DCD5C8]">•</span>
        <Link
          to="/terms"
          className="text-[#6B7A70] hover:text-[#3F5A3A] hover:underline font-semibold transition-colors"
        >
          Terms &amp; Conditions
        </Link>
        <span className="text-[#DCD5C8]">•</span>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1 text-[#6B7A70] hover:text-[#3F5A3A] font-semibold cursor-pointer transition-colors"
        >
          <span>Back to top</span>
          <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  )
}

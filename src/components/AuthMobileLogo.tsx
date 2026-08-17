import { PawPrint } from "lucide-react"

export default function AuthMobileLogo() {
  return (
    <div className="flex items-center gap-2 mb-10 lg:hidden">
      <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center">
        <PawPrint size={18} className="text-white" />
      </div>
      <span className="font-bold text-lg text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Patinhas Pet Shop
      </span>
    </div>
  )
}

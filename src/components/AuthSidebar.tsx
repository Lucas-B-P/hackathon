import { PawPrint } from "lucide-react"

import dogHero from "../img/dog-hero.jpg"

type AuthSidebarProps = {
  title: string

  description: string

  featuresLabel?: string

  features?: string[]
}

export default function AuthSidebar({
  title,
  description,
  featuresLabel,
  features,
}: AuthSidebarProps) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between lg:w-[440px] xl:w-[480px] bg-[#15803d] flex-shrink-0 relative overflow-hidden"
      style={{ padding: "48px", margin: "-2px -1px -2px -1px" }}
    >
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <PawPrint size={22} className="text-white" />
          </div>
          <div>
            <span
              className="text-white font-bold text-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Patinhas
            </span>
            <span className="text-green-300 font-medium ml-1.5">Pet Shop</span>
          </div>
        </div>

        <div className="pt-10">
          <h2
            className="text-white text-3xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h2>
          <p
            className={`text-green-200 text-base leading-relaxed ${
              features?.length ? "mb-10" : ""
            }`}
          >
            {description}
          </p>

          {features && features.length > 0 && (
            <div className="space-y-3">
              {featuresLabel && (
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                  {featuresLabel}
                </p>
              )}
              <div className="space-y-2">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-green-100 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto -mx-14 -mb-12 overflow-hidden rounded-t-[65px]">
        <img
          src={dogHero}
          alt="Golden Retriever — tudo para o amor do seu pet"
          className="w-full h-[350px] object-cover object-top scale-105"
        />
      </div>
    </div>
  )
}

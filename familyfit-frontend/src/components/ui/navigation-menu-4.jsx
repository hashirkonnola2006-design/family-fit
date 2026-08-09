import React from "react"
import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

const navigationLinks = [
  { href: "/", label: "Home" },
  {
    label: "Features",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/recipes",
        label: "Kerala Recipes",
        description: "Browse 500+ authentic South Indian & Malabar meal plans.",
      },
      {
        href: "/grocery",
        label: "Grocery List",
        description: "Auto-generated shopping lists tailored for your family.",
      },
      {
        href: "/tips",
        label: "Health & Tips",
        description: "Personalized nutrition advice and allergy warnings.",
      },
    ],
  },
  {
    label: "Explore",
    submenu: true,
    type: "simple",
    items: [
      { href: "/recipes", label: "Kerala Specials" },
      { href: "/recipes", label: "Quick 20-Min Meals" },
      { href: "/recipes", label: "High-Protein Meals" },
      { href: "/recipes", label: "Vegetarian Delights" },
    ],
  },
  {
    label: "About",
    submenu: true,
    type: "icon",
    items: [
      { href: "/tips", label: "Getting Started", icon: "BookOpenIcon" },
      { href: "/tips", label: "Health Guidance", icon: "LifeBuoyIcon" },
      { href: "/profile", label: "Family Profile", icon: "InfoIcon" },
    ],
  },
]

export default function NavigationMenu4({ isDark, isHomePage }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex items-center gap-6">
      {/* Mobile menu trigger */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="group size-8"
              variant="ghost"
              size="icon"
            >
              <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M4 12L20 12"
                  className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            <NavigationMenu className="max-w-none w-full">
              <NavigationMenuList className="flex-col items-start gap-1 w-full">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index} className="w-full">
                    {link.submenu ? (
                      <>
                        <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold uppercase tracking-wider">
                          {link.label}
                        </div>
                        <ul className="pl-2">
                          {link.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <button
                                onClick={() => navigate(item.href)}
                                className="w-full text-left py-1.5 px-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md transition-colors"
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(link.href)}
                        className="w-full text-left py-1.5 px-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop Navigation menu */}
      <div className="max-md:hidden">
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navigationLinks.map((link, index) => {
              const active = pathname === link.href
              return (
                <NavigationMenuItem key={index}>
                  {link.submenu ? (
                    <>
                      <NavigationMenuTrigger className={cn(
                        "bg-transparent px-3 py-2 font-semibold text-sm transition-colors cursor-pointer",
                        isHomePage
                          ? "text-white/90 hover:text-white hover:bg-white/10"
                          : isDark
                          ? "text-slate-200 hover:text-emerald-400 hover:bg-slate-800/50"
                          : "text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/60"
                      )}>
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className={cn(
                          "grid w-[360px] gap-2 p-3 md:w-[450px] md:grid-cols-2 lg:w-[520px] bg-white border border-slate-100 rounded-xl shadow-xl",
                          link.type === "description" && "md:grid-cols-1"
                        )}>
                          {link.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <NavigationMenuLink asChild>
                                <button
                                  onClick={() => navigate(item.href)}
                                  className="w-full text-left block select-none space-y-1 rounded-lg p-2.5 leading-none no-underline outline-none transition-colors hover:bg-emerald-50 hover:text-emerald-950 focus:bg-emerald-50 cursor-pointer"
                                >
                                  {/* Display icon if present */}
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2.5">
                                      {item.icon === "BookOpenIcon" && (
                                        <BookOpenIcon
                                          size={16}
                                          className="text-emerald-600 shrink-0"
                                        />
                                      )}
                                      {item.icon === "LifeBuoyIcon" && (
                                        <LifeBuoyIcon
                                          size={16}
                                          className="text-emerald-600 shrink-0"
                                        />
                                      )}
                                      {item.icon === "InfoIcon" && (
                                        <InfoIcon
                                          size={16}
                                          className="text-emerald-600 shrink-0"
                                        />
                                      )}
                                      <div className="text-sm font-semibold text-slate-800">
                                        {item.label}
                                      </div>
                                    </div>
                                  )}

                                  {/* Display label with description if present */}
                                  {link.type === "description" && "description" in item && (
                                    <>
                                      <div className="text-sm font-semibold text-slate-900 mb-0.5">
                                        {item.label}
                                      </div>
                                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 font-normal">
                                        {item.description}
                                      </p>
                                    </>
                                  )}

                                  {/* Display simple label if simple type */}
                                  {link.type === "simple" && (
                                    <div className="text-sm font-medium text-slate-800">
                                      {item.label}
                                    </div>
                                  )}
                                </button>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => navigate(link.href)}
                        className={cn(
                          "py-2 px-3 font-semibold text-sm rounded-lg transition-colors cursor-pointer border-0 bg-transparent",
                          active
                            ? isHomePage
                              ? "bg-white/20 text-white"
                              : isDark
                              ? "bg-emerald-950/60 text-emerald-400"
                              : "bg-emerald-50 text-emerald-900"
                            : isHomePage
                            ? "text-white/90 hover:text-white hover:bg-white/10"
                            : isDark
                            ? "text-slate-200 hover:text-emerald-400 hover:bg-slate-800/50"
                            : "text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/60"
                        )}
                      >
                        {link.label}
                      </button>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

import Link from "next/link"
import { RiUnsplashFill } from "react-icons/ri"

const footerSections = [
  {
    title: "Unsplash",
    items: ["About", "Blog", "Community", "Join the team"],
  },
  {
    title: "Developers/API",
    items: ["Developers/API", "Press", "Help Center"],
  },
  {
    title: "Product",
    items: ["Unsplash for Education", "Unsplash for iOS", "Official Apps"],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-sm text-[#4a5568]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-black">Unsplash</h3>
            <p className="mt-2 text-xs text-gray-500">Make something awesome.</p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-black">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-[#f7fafc] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
           
            <RiUnsplashFill size={32} className="text-black" />
            <span>Make something awesome.</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-black">Privacy Policy</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
            <Link href="#" className="hover:text-black">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

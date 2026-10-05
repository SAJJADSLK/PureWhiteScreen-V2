import { Link } from 'wouter'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-700 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-3">Pure White Screen</h3>
            <p className="text-sm text-gray-400">Free screen utilities for creators and professionals.</p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/tools/white-screen" className="hover:text-white">White Screen</Link></li>
              <li><Link href="/tools/ring-light" className="hover:text-white">Ring Light</Link></li>
              <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><button onClick={() => window.dispatchEvent(new Event('pws:cookie-settings'))} className="hover:text-white">Cookie settings</button></li>
            </ul>
          </div>
          </div>
        <div className="border-t border-slate-700 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pure White Screen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

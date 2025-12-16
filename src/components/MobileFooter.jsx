import React from 'react'

export default function MobileFooter() {
  return (
    <footer className="md:hidden bg-[#0a0a0a] border-t border-[#3f3f3f] py-8 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <img src="https://i.imgur.com/t8UWYN3.png" className="w-8 h-8 rounded-lg" alt="SignSense" />
          <span className="text-2xl">SignSense</span>
        </div>

        <p className="text-sm text-[#bdbdbd] mb-6">
          For informational use only. Not legal advice.
        </p>

        <div className="flex gap-4 mb-8">
          <a href="https://x.com" className="w-10 h-10 border border-[#2a2a2a] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.73l-4.7-6.35L5.6 22H3l7.07-8.07L1.5 2h6.8l4.22 5.8L18.244 2Zm-1.18 18h1.77L8.05 4h-1.8l10.82 16Z"/></svg>
          </a>
          {/* Add more social icons if needed */}
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="text-white mb-2">Help</h4>
            <a href="/contact.html" className="block text-[#d0d0d0]">Contact us</a>
            <a href="https://youtube.com" className="block text-[#d0d0d0]">How it Works</a>
          </div>
          <div>
            <h4 className="text-white mb-2">Product</h4>
            <a href="https://tally.so/r/3EGJpA" className="block text-[#d0d0d0]">Leave Review</a>
          </div>
          <div>
            <h4 className="text-white mb-2">Legal</h4>
            <a href="/terms.html" className="block text-[#d0d0d0]">Terms of Service</a>
            <a href="/privacy.html" className="block text-[#d0d0d0]">Privacy Policy</a>
            <a href="/cookies.html" className="block text-[#d0d0d0]">Cookie Policy</a>
          </div>
        </div>

        <p className="text-center text-[#fff] mt-8 text-sm">© 2025 SignSense. All rights reserved.</p>
      </div>
    </footer>
  )
}
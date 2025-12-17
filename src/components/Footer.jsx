import React from 'react'

export default function Footer() {
  return (
    <footer className="hidden md:block max-w-6xl mx-auto py-10 px-5">
      <div className="grid grid-cols-4 gap-20">
        <div className="flex items-start gap-4">
          <img src="https://i.imgur.com/BcUqgKZ.png" className="w-8 h-8" alt="SignSense" />
          <div>
            <a href="/" className="text-3xl text-[#e1e1e1]">SignSense</a>
            <div className="text-[#c5c5c5] mt-4 text-lg">
              <div>No confusion, no legal jargon.</div>
              <div>For informational use only. Not legal advice.</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-2xl text-white mb-4">Quick Menu</h4>
          <div className="space-y-2 text-lg text-[#c5c5c5]">
            <a href="https://youtube.com">How it Works</a><br />
            <a href="https://tally.so/r/3EGJpA">Leave Review</a>
          </div>
        </div>

        <div>
          <h4 className="text-2xl text-white mb-4">Information</h4>
          <div className="space-y-2 text-lg text-[#c5c5c5]">
            <a href="/contact.html">Contact</a><br />
            <a href="/">Home</a>
          </div>
        </div>

        <div>
          <h4 className="text-2xl text-white mb-4">Socials</h4>
          <div className="space-y-2 text-lg text-[#c5c5c5]">
            <a href="https://instagram.com">Instagram</a><br />
            <a href="https://youtube.com">YouTube</a><br />
            <a href="https://x.com">X</a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[#c5c5c5]/30 pt-6 flex justify-between text-[#c5c5c5] text-base">
        <div className="flex gap-8">
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
          <a href="/cookies.html">Cookie Policy</a>
        </div>
        <span>© 2025 SignSense. All rights reserved.</span>
      </div>
    </footer>
  )
}
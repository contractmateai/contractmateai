import React from 'react'

export default function Hero({ onReviewClick, showRolePicker }) {
  return (
    <section className="pt-32 pb-20 text-center px-5">
      <div className="inline-flex items-center gap-3 bg-[#090823] text-[#a7fd3c] px-4 py-2 rounded-full text-base shadow-[0_0_20px_rgba(191,255,60,0.55)] mb-4">
        <span className="bg-[#adff00] text-black px-3 py-1.5 rounded-full font-bold text-sm">AI</span>
        Legal DocReview Tool <span className="text-2xl">↗</span>
      </div>

      <h1 className="hidden md:block text-7xl font-shoika leading-tight">
        Make Sense Of What<br /><span>You’re Signing</span>
      </h1>

      <h1 className="md:hidden text-5xl font-shoika leading-snug">
        <span>Make <span className="text-[#aafe2a]">Sense</span> Of What</span><br />
        <span>You’re <span className="text-[#aafe2a]">Signing</span></span>
      </h1>

      <p className="hidden md:block text-xl text-[#d8cccc] mt-5 max-w-3xl mx-auto">
        Free contract reviewing and no need at all for any account creation or sign up.
      </p>

      <p className="md:hidden text-lg text-[#d8cccc] mt-4">
        Free contract reviewing and no need for<br />an account creation or sign up.
      </p>

      <div className="mt-12">
        <button onClick={onReviewClick} className="bg-white text-black px-8 py-4 rounded-2xl text-lg font-medium shadow-lg hover:shadow-2xl transition">
          Review A Contract <span className="text-2xl ml-2">↗</span>
        </button>
      </div>

      {showRolePicker && (
        <div className="mt-8 inline-flex flex-col md:flex-row items-center gap-4">
          <span className="text-2xl">You are:</span>
          <div className="flex gap-4">
            <button className="bg-[#2c2b33] text-white px-6 py-3 rounded-xl border-2 border-transparent hover:border-white">The Signer</button>
            <button className="bg-[#2c2b33] text-white px-6 py-3 rounded-xl border-2 border-transparent hover:border-white">The Writer</button>
          </div>
        </div>
      )}

      <div className="mt-8 md:hidden max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" className="w-full aspect-video" allowFullScreen />
      </div>
    </section>
  )
}
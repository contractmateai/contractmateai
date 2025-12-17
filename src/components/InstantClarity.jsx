import React from 'react'

export default function InstantClarity() {
  return (
    <div className="text-center my-20 px-5">
      <div className="inline-flex items-center gap-2 bg-[#090823] text-[#a7fd3c] px-6 py-3 rounded-full text-lg shadow-[0_0_20px_rgba(191,255,60,0.55)]">
        Instant Clarity Engine <span className="text-2xl">↗</span>
      </div>

      <h2 className="hidden md:block text-5xl mt-4 font-shoika">Smarter Reviews,<br />Faster Decisions</h2>
      <p className="hidden md:block text-2xl text-[#d8cccc] mt-4">AI highlights key clauses, risks, and red flags<br />so you can sign smarter and with confidence.</p>

      <h2 className="md:hidden text-4xl font-shoika mt-4">Way Smarter Reviews<br /><span className="text-[#aafe2a]">Faster Decisions</span></h2>
      <p className="md:hidden text-xl text-[#d8cccc] mt-4">AI highlights key clauses, risks red flags so you can sign smarter</p>
    </div>
  )
}
import React from 'react'

export default function LogoStrip() {
  return (
    <div className="max-w-6xl mx-auto my-16 overflow-hidden relative">
      <div className="flex animate-marquee">
        {[...Array(12)].map((_, i) => (
          <img key={i} src="https://i.imgur.com/2SUo8mv.png" className="h-24 flex-shrink-0" alt="partner" />
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#01040b] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#01040b] pointer-events-none" />
    </div>
  )
}
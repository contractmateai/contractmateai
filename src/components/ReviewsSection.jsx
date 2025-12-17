import React, { useState, useEffect } from 'react'

const reviews = [
  "https://i.imgur.com/jX2IqjQ.png",
  "https://i.imgur.com/k42nv4C.png",
  "https://i.imgur.com/6M6XO2l.png",
  "https://i.imgur.com/YMDEKZm.png",
  "https://i.imgur.com/I9iQu88.png",
]

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto text-center">
      <h2 className="text-5xl font-shoika">
        What <span className="text-[#bff611]">Our Clients</span> Say
      </h2>
      <p className="text-xl text-[#a8a8a8] mt-4">Hear Directly From Our Satisfied Users</p>

      <div className="overflow-hidden mt-12 rounded-3xl">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {reviews.concat(reviews).map((src, i) => (
            <div key={i} className="w-full flex-shrink-0 px-4">
              <img src={src} alt={`Review ${i + 1}`} className="w-full rounded-3xl border border-[#262626]" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-4 h-4 rounded-full transition ${i === current ? 'bg-[#b9f03d]' : 'bg-[#777]'}`}
          />
        ))}
      </div>

      <div className="mt-10">
        <a href="https://tally.so/r/3EGJpA" className="bg-[#adff00] text-black px-8 py-4 rounded-xl text-xl font-medium hover:shadow-[0_0_14px_#adff00] transition">
          Leave A Review <span className="text-2xl ml-2">↗</span>
        </a>
      </div>
    </section>
  )
}
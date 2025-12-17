import React from 'react'

export default function InsightSection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="yellow-line" />
          <img src="https://i.imgur.com/a6QxhzQ.png" className="w-full rounded-2xl" alt="Insights" />
        </div>

        <div className="hidden md:block">
          <div className="flex gap-4 mb-10">
            <img src="https://i.imgur.com/VVGvghi.png" className="w-20 h-20 rounded-full border-4 border-[#93e533]" />
            <img src="https://i.imgur.com/woCjWUt.png" className="w-20 h-20 rounded-full border-4 border-[#93e533]" />
            <img src="https://i.imgur.com/0IzXvgs.png" className="w-20 h-20 rounded-full border-4 border-[#93e533]" />
          </div>
          <h2 className="text-4xl font-shoika mb-6">Understand Your Contract <br /><span>Instantly with AI</span></h2>
          <p className="text-2xl text-[#d8cccc] mb-8">Reveal hidden risks and key terms so you can review contracts clearly, quickly, and without confusion.</p>
          <a href="https://youtube.com" className="bg-[#adff00] text-black px-6 py-4 rounded-xl text-xl font-medium hover:shadow-[0_0_16px_#adff00]">
            Learn More <span className="text-2xl ml-2">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
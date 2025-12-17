import React from 'react'

const top = [
  { icon: "https://imgur.com/dKG0KXh.png", label: "No Signup" },
  { icon: "https://imgur.com/Cbflaz5.png", label: "Secure Processing" },
  { icon: "https://imgur.com/RozMHbN.png", label: "PDF Export" },
  { icon: "https://imgur.com/hDBmbBP.png", label: "Risk Indicator" },
  { icon: "https://imgur.com/SaW85D2.png", label: "Your Data Stays Yours" },
  { icon: "https://imgur.com/dPCWJg7.png", label: "Smart Summary" },
  { icon: "https://imgur.com/Xv2u5Mz.png", label: "Language Detection" },
  { icon: "https://imgur.com/cv1DrX1.png", label: "Key Clauses" },
]

const bottom = [
  { icon: "https://imgur.com/0TgzL8P.png", label: "Legal Insights" },
  { icon: "https://imgur.com/JMV0gKS.png", label: "Suggestions Engine" },
  { icon: "https://imgur.com/MAZkZHs.png", label: "Clause Warnings" },
  { icon: "https://imgur.com/o8K46Sk.png", label: "AI Review" },
  { icon: "https://imgur.com/3PU7xU0.png", label: "No legal jargon" },
  { icon: "https://imgur.com/rlaNjHT.png", label: "Deadline Pressure" },
  { icon: "https://imgur.com/Ie8CwXO.png", label: "Modern Design" },
  { icon: "https://imgur.com/5DGepME.png", label: "Confidence to Sign" },
]

export default function ScrollingFeatures() {
  return (
    <section className="py-10 bg-gradient-to-b from-[#0e0c13] to-[#040304] border border-zinc-800 rounded-2xl my-10 max-w-6xl mx-auto px-5">
      <h3 className="text-center text-3xl mb-12">Everything you need for clarity & security in one seamless experience.</h3>
      <div className="overflow-hidden">
        <div className="flex animate-marquee-reverse gap-8">
          {[...top, ...top].map((item, i) => (
            <div key={i} className="bg-[#1a1822]/60 border border-zinc-700 rounded-full px-8 py-4 flex items-center gap-6 flex-shrink-0">
              <img src={item.icon} className="w-12 h-12 rounded-full" alt="" />
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee gap-8 mt-8">
          {[...bottom, ...bottom].map((item, i) => (
            <div key={i} className="bg-[#1a1822]/60 border border-zinc-700 rounded-full px-8 py-4 flex items-center gap-6 flex-shrink-0">
              <img src={item.icon} className="w-12 h-12 rounded-full" alt="" />
              <span className="text-lg">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
import React, { useState } from 'react'

const faqs = [
  {
    q: "What languages do you support?",
    a: "We support English, Spanish, German, French, Italian, Portuguese, Dutch, Romanian, Albanian, Chinese, Japanese, and Turkish. More coming soon!"
  },
  {
    q: "Is SignSense legally binding or a replacement for a lawyer?",
    a: "No. SignSense explains your contract using AI, but it isn’t legally binding and doesn’t replace professional legal advice."
  },
  {
    q: "What types of contracts can I upload?",
    a: "Most standard agreements—leases, NDAs, freelance/service contracts, employment offers, and more."
  },
  {
    q: "Is my data secure when I upload a contract?",
    a: "Yes. Uploads are processed securely; we don’t sell your data or share your files with third parties."
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-20 px-5 max-w-4xl mx-auto text-center">
      <h2 className="text-6xl font-shoika mb-12">Frequently Asked Questions</h2>

      <div className="space-y-5">
        {faqs.map((faq, i) => (
          <div key={i} className={`rounded-3xl overflow-hidden transition-all ${openIndex === i ? 'bg-[#191624]' : ''}`}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center px-8 py-8 text-left text-2xl font-medium"
            >
              <span>{faq.q}</span>
              <span className={`text-3xl transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>↓</span>
            </button>
            {openIndex === i && (
              <div className="px-8 pb-8 text-xl text-[#cfcbd6] text-left">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
import React, { useEffect } from 'react'

export default function AppPreview() {
  useEffect(() => {
    const wrapper = document.getElementById('appWrapper')
    const onScroll = () => {
      wrapper.style.transform = window.scrollY > 50 ? 'rotateX(0deg)' : 'rotateX(12deg)'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-8 perspective-1000">
      <div id="appWrapper" className="transition-transform duration-800">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="animate-glint" />
          <img src="https://i.imgur.com/slsiM6i.png" alt="App" className="w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
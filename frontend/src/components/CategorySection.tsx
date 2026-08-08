'use client'

import { useRef, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'
import type { Category } from '@/types'

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'fashion', name: 'Fashion', icon: '👕', count: 45 },
  { id: 'jewellery', name: 'Jewellery', icon: '💎', count: 22 },
  { id: 'watches', name: 'Watches', icon: '⌚', count: 18 },
  { id: 'dining', name: 'Dining', icon: '🍽️', count: 34 },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', count: 12 },
]

interface CategorySectionProps {
  categories?: Category[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const setBrandFilter = useStore((s) => s.setBrandFilter)
  const displayCategories =
    categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES

  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const isMouseDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftStartRef = useRef(0)
  const startPageXRef = useRef(0)

  // Triple the list to enable infinite smooth scrolling
  const listItems = [
    ...displayCategories,
    ...displayCategories,
    ...displayCategories,
  ]

  useEffect(() => {
    const container = containerRef.current
    if (!container || displayCategories.length === 0) return

    let animationFrameId: number

    const scroll = () => {
      // Only auto-scroll when not hovered and not being dragged by the user
      if (!isHovered && !isMouseDownRef.current) {
        container.scrollLeft += 0.5 // Slow auto-scroll speed (adjust for speed of marquee)

        // Reset scroll position seamlessly once we go past the first set of items
        const firstChildOfSecondSet = container.children[displayCategories.length] as HTMLElement
        if (firstChildOfSecondSet) {
          const oneSetWidth = firstChildOfSecondSet.offsetLeft
          if (container.scrollLeft >= oneSetWidth) {
            container.scrollLeft -= oneSetWidth
          }
        }
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered, displayCategories.length])

  // Mouse wheel horizontal scrolling redirect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY * 0.8
      }
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Mouse drag events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    isMouseDownRef.current = true
    startPageXRef.current = e.pageX
    startXRef.current = e.pageX - container.offsetLeft
    scrollLeftStartRef.current = container.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const x = e.pageX - container.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    container.scrollLeft = scrollLeftStartRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false
  }

  function handleCategoryClick(e: React.MouseEvent, name: string) {
    // If the mouse moved more than 5px horizontally, treat it as a drag and ignore click
    if (Math.abs(e.pageX - startPageXRef.current) > 5) {
      return
    }
    setBrandFilter(name)
    document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' })
    toast.success(`Browsing ${name}`)
  }

  return (
    <section className="py-20 px-6 bg-bg-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-eyebrow">Explore</p>
          <h2 className="section-heading">
            Shop by{' '}
            <span className="gold-text">Category</span>
          </h2>
          <p className="text-[#B8B4D0] text-sm mt-3 max-w-md mx-auto">
            Navigate the finest curated selections across every luxury category under one roof.
          </p>
        </div>

        {/* Scrollable row */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            handleMouseUpOrLeave()
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex gap-4 overflow-x-auto pb-4 custom-scrollbar select-none cursor-grab active:cursor-grabbing w-full ${
            isHovered ? 'snap-x snap-mandatory' : 'snap-none'
          }`}
          style={{ scrollBehavior: isHovered ? 'smooth' : 'auto' }}
        >
          {listItems.map((cat, idx) => (
            <div
              key={`${cat.id}-${idx}`}
              onClick={(e) => handleCategoryClick(e, cat.name)}
              className="cursor-pointer w-44 h-60 flex flex-col rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.12)] bg-bg-card hover:border-[#C9A84C] hover:scale-105 transition-all duration-300 flex-shrink-0 snap-start"
            >
              {/* Icon area */}
              <div className="h-32 flex items-center justify-center bg-bg-accent relative flex-shrink-0">
                <span className="text-5xl select-none">{cat.icon}</span>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="font-serif text-lg text-[#F0EEF8] leading-tight">
                  {cat.name}
                </h3>
                <span className="text-xs text-[#7A7890]">{cat.count}+ Stores</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

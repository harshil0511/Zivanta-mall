'use client'

import toast from 'react-hot-toast'

const festivals = [
  {
    id: 1,
    title: 'Grand Diwali Celebration',
    date: 'Oct 28 – Nov 3',
    description:
      'Experience the magic of lights, culture, and luxury with exclusive Diwali collections and live performances across the mall.',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd754cb?w=800&q=80',
    tag: 'Trending',
  },
  {
    id: 2,
    title: 'Spring Fashion Week',
    date: 'March 15 – March 22',
    description:
      'Discover the latest Spring/Summer collections from top designers with runway shows, pop-ups, and exclusive member previews.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    tag: 'Upcoming',
  },
]

export default function FestivalBanner() {
  function handleNotify(title: string) {
    toast.success(`You'll be notified about "${title}".`)
  }

  return (
    <section
      id="events"
      className="py-20 px-6 bg-bg-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow">Happening Now</p>
          <h2 className="section-heading">
            Events &amp;{' '}
            <span className="gold-text">Celebrations</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {festivals.map((festival) => (
            <div
              key={festival.id}
              className="relative overflow-hidden rounded-2xl min-h-[320px]"
            >
              {/* Background image */}
              <img
                src={festival.image}
                alt={festival.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                {/* Tag badge */}
                <span className="inline-block border border-[rgba(201,168,76,0.6)] text-[#C9A84C] rounded-full text-xs px-3 py-1">
                  {festival.tag}
                </span>

                {/* Date */}
                <p className="text-xs text-[#C9A84C] tracking-widest uppercase mt-2">
                  {festival.date}
                </p>

                {/* Title */}
                <h3 className="font-serif text-2xl text-[#F0EEF8] mt-1 leading-tight">
                  {festival.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#B8B4D0] mt-2 line-clamp-2">
                  {festival.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => handleNotify(festival.title)}
                  className="btn-gold text-sm mt-4"
                >
                  Notify Me →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

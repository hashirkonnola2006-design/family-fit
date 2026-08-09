import React from 'react'
import { Card, CardContent } from './card'

export const REVIEWS = [
  {
    name: "Anitha Nair",
    username: "@anithanair",
    body: "“FamilyFit has made our daily Kerala meals healthier and weekly planning so effortless!”",
    profile: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Rohit Menon",
    username: "@rohitmenon",
    body: "“The recipes are delicious and my kids actually enjoy eating healthy veggies now.”",
    profile: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Priya Suresh",
    username: "@priyasureesh",
    body: "“Personalized meal plans and smart grocery lists have saved our family hours every week.”",
    profile: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Dr. Lakshmi Pillai",
    username: "@dr_lakshmi",
    body: "“Authentic Kerala recipes tuned for optimal nutrition and heart health. Highly recommended!”",
    profile: "https://images.unsplash.com/photo-1594824813571-24a69c100c3f?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Vishnu Kumar",
    username: "@vishnukumar",
    body: "“The calorie & macro tracking tailored for traditional Kerala dishes is absolute perfection.”",
    profile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Kavitha Raj",
    username: "@kavitha_raj",
    body: "“Green Moong Smoothie is our family’s morning staple! Simple, fresh, and nutritious.”",
    profile: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Suresh Babu",
    username: "@sureshbabu",
    body: "“We lost 6kg combined as a family following the weight balance and immunity plans.”",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    name: "Meera Krishnan",
    username: "@meera_k",
    body: "“Grocery lists auto-generate based on our meal choices. Cooking is a joy again!”",
    profile: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
]

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2)
const secondRow = REVIEWS.slice(REVIEWS.length / 2)

export const ReviewCard = ({ profile, name, username, body }) => {
  return (
    <Card
      className="marquee-card-item"
      style={{
        width: '320px',
        flexShrink: 0,
        marginRight: '20px',
        padding: '16px 18px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EAEFE5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        whiteSpace: 'normal',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <CardContent style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', whiteSpace: 'normal' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={profile}
            alt=""
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#E8F0E3' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {name}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', whiteSpace: 'nowrap' }}>
              {username}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: '12px', display: 'flex', gap: '2px', flexShrink: 0 }}>
            {'★'.repeat(5)}
          </div>
        </div>
        <p
          style={{
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.45',
            margin: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {body}
        </p>
      </CardContent>
    </Card>
  )
}

export function Marquee({ children, reverse = false, pauseOnHover = true, className = "" }) {
  return (
    <div
      className={`marquee-row-wrapper ${reverse ? 'reverse' : ''} ${pauseOnHover ? 'pause-hover' : ''} ${className}`}
      style={{
        display: 'flex',
        overflow: 'hidden',
        width: '100%',
        userSelect: 'none',
        position: 'relative',
        padding: '8px 0',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          animation: `${reverse ? 'marqueeScrollReverse' : 'marqueeScroll'} 35s linear infinite`,
        }}
      >
        {children}
      </div>
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          animation: `${reverse ? 'marqueeScrollReverse' : 'marqueeScroll'} 35s linear infinite`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function TestimonialMarquee() {
  return (
    <div
      className="marquee-container-relative"
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        gap: '12px',
      }}
    >
      <Marquee pauseOnHover>
        {firstRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover>
        {secondRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>

      {/* Left and Right edge fade gradient overlays */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '12%',
          pointerEvents: 'none',
          background: 'linear-gradient(to right, #F5F3EE 0%, rgba(245, 243, 238, 0) 100%)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '12%',
          pointerEvents: 'none',
          background: 'linear-gradient(to left, #F5F3EE 0%, rgba(245, 243, 238, 0) 100%)',
          zIndex: 2,
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marqueeScrollReverse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .marquee-row-wrapper.pause-hover:hover .marquee-track {
          animation-play-state: paused !important;
        }
        .marquee-card-item * {
          white-space: normal;
        }
      `}} />
    </div>
  )
}

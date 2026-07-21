import type { CSSProperties } from 'react'
import { CONFIG } from '../config'

type MotionStyle = CSSProperties & Record<`--${string}`, string | number>

const FLOATERS = ['♥', '✦', '★', '♥', '✧', '★', '♥', '✦']

export function BackgroundDecor() {
  return (
    <div className="background-decor" aria-hidden="true">
      <div className="glow glow-one" />
      <div className="glow glow-two" />
      {FLOATERS.map((symbol, index) => (
        <span
          className={`floater floater-${index + 1}`}
          key={`${symbol}-${index}`}
        >
          {symbol}
        </span>
      ))}
    </div>
  )
}

export function CaptionTicker() {
  const phrases = [...CONFIG.tickerPhrases, ...CONFIG.tickerPhrases]
  return (
    <div className="ticker-wrap" aria-label="Very important internet commentary">
      <div className="ticker-track">
        {phrases.map((phrase, index) => (
          <span className="ticker-item" key={`${phrase}-${index}`} aria-hidden={index >= CONFIG.tickerPhrases.length}>
            <span aria-hidden="true">✦</span> {phrase}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ReactionOrb({ emoji }: { emoji: string }) {
  return (
    <div className="reaction-orb" aria-hidden="true">
      <svg viewBox="0 0 140 124" role="img">
        <path
          d="M23 26C39 5 96 1 117 24c22 24 15 70-12 88-25 16-70 12-89-13C-1 76 5 49 23 26Z"
          fill="#ffe566"
          stroke="#231b2d"
          strokeWidth="5"
        />
        <path d="M31 93c25 17 52 18 77-2" fill="none" stroke="#231b2d" strokeLinecap="round" strokeWidth="5" />
        <path d="M23 45c9-12 18-12 27 0-10 17-17 17-27 0Z" fill="#ff4f87" stroke="#231b2d" strokeWidth="4" />
        <path d="M86 43c9-12 18-12 27 0-10 17-17 17-27 0Z" fill="#ff4f87" stroke="#231b2d" strokeWidth="4" />
      </svg>
      <span className="reaction-emoji">{emoji}</span>
    </div>
  )
}

export function ConfidenceMeter({ accepted }: { accepted: boolean }) {
  return (
    <div className="confidence" aria-label={`Confidence level: ${accepted ? 100 : 2}%`}>
      <div className="confidence-copy">
        <span>CONFIDENCE METER</span>
        <strong>{accepted ? '100%' : '2%'}</strong>
      </div>
      <div className="meter-track" aria-hidden="true">
        <span className={accepted ? 'is-full' : ''} />
      </div>
    </div>
  )
}

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="confetti-field" aria-hidden="true">
      {Array.from({ length: 34 }, (_, index) => {
        const style: MotionStyle = {
          '--x': `${(index * 37) % 100}vw`,
          '--delay': `${(index % 9) * 0.08}s`,
          '--duration': `${2.1 + (index % 5) * 0.25}s`,
          '--rotation': `${(index * 71) % 360}deg`,
          '--color': ['#ff4f87', '#ffe566', '#9a6bff', '#ff7357', '#ffffff'][index % 5],
        }
        return <i key={index} style={style} />
      })}
    </div>
  )
}


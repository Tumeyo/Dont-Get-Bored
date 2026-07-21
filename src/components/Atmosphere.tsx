import type { CSSProperties } from 'react'
import { CONFIG } from '../config'

type MotionStyle = CSSProperties & Record<`--${string}`, string | number>

const FLOATERS = ['♥', '·', '🐾', '♥', '·', '🐾', '♥', '·']

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
    <div className="ticker-wrap" aria-label="A few quiet notes">
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
      <span className="cat-character">🐈</span>
      <span className="reaction-emoji">{emoji}</span>
    </div>
  )
}

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="confetti-field" aria-hidden="true">
      {Array.from({ length: 22 }, (_, index) => {
        const style: MotionStyle = {
          '--x': `${(index * 37) % 100}vw`,
          '--delay': `${(index % 9) * 0.08}s`,
          '--duration': `${2.1 + (index % 5) * 0.25}s`,
          '--rotation': `${(index * 71) % 360}deg`,
          '--color': ['#c9657d', '#ead8b6', '#87718f', '#d8a5b2', '#ffffff'][index % 5],
        }
        return <i key={index} style={style} />
      })}
    </div>
  )
}

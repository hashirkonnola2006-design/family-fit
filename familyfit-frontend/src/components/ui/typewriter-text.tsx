import React, { useState, useEffect } from 'react'

export interface TypewriterProps {
  texts?: string[]
  text?: string
  typingSpeed?: number
  deletingSpeed?: number
  delayBetween?: number
  className?: string
  cursorClassName?: string
}

export function Typewriter({
  texts,
  text,
  typingSpeed = 45,
  deletingSpeed = 25,
  delayBetween = 3000,
  className = '',
  cursorClassName = '',
}: TypewriterProps) {
  const list = texts && texts.length > 0 ? texts : [text || '']
  const serializedList = list.join('|||')

  const [textIndex, setTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  // When texts array content changes (e.g. login <-> signup mode), reset state cleanly
  useEffect(() => {
    setTextIndex(0)
    setDisplayText('')
    setPhase('typing')
  }, [serializedList])

  useEffect(() => {
    const currentTarget = list[textIndex % list.length] || ''
    let timeoutId: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayText.length < currentTarget.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        // Complete current text, hold for ~3 seconds before deleting
        setPhase('holding')
      }
    } else if (phase === 'holding') {
      if (list.length > 1) {
        timeoutId = setTimeout(() => {
          setPhase('deleting')
        }, delayBetween)
      }
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length - 1))
        }, deletingSpeed)
      } else {
        // Completed deletion, switch to next quote and resume typing
        setTextIndex((prev) => (prev + 1) % list.length)
        setPhase('typing')
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [displayText, phase, textIndex, serializedList, typingSpeed, deletingSpeed, delayBetween])

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      <span
        className={`inline-block w-[2px] h-[1.15em] ml-1 bg-current animate-pulse align-middle ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  )
}

export default Typewriter

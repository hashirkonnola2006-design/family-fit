import React, { useState, useEffect } from 'react'

interface TypewriterProps {
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
  typingSpeed = 70,
  deletingSpeed = 40,
  delayBetween = 2000,
  className = '',
  cursorClassName = '',
}: TypewriterProps) {
  const textArray = texts && texts.length > 0 ? texts : [text || '']
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fullText = textArray[currentTextIndex] || ''

    if (!isDeleting && currentText === fullText) {
      if (textArray.length === 1) return
      const timeout = setTimeout(() => setIsDeleting(true), delayBetween)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false)
      setCurrentTextIndex((prev) => (prev + 1) % textArray.length)
      return
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timeout = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting ? fullText.slice(0, prev.length - 1) : fullText.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, textArray, typingSpeed, deletingSpeed, delayBetween])

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText}</span>
      <span
        className={`inline-block w-[2px] h-[1.1em] ml-1 bg-current animate-pulse ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  )
}

export default Typewriter

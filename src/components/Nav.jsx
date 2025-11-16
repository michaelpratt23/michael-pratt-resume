import React, { useEffect, useState } from 'react'
import './Nav.css'

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleResumeClick = (e) => {
    e.preventDefault()
    // Try to download the resume PDF
    const link = document.createElement('a')
    link.href = '/michael-pratt-resume.pdf'
    link.download = 'michael-pratt-resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80 // Account for fixed nav height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-links">
          <button 
            className="nav-link" 
            onClick={(e) => handleNavClick(e, 'about-me')}
          >
            ABOUT ME
          </button>
          <button 
            className="nav-link" 
            onClick={handleResumeClick}
          >
            RESUME
          </button>
        </div>
        <div className="nav-social">
          <a 
            href="https://www.linkedin.com/in/michael–pratt/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-icon"
            aria-label="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a 
            href="https://x.com/michaelpratt23" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-icon"
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </a>
          <button 
            className="nav-icon" 
            onClick={(e) => handleNavClick(e, 'thoughts')}
            aria-label="Thoughts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav


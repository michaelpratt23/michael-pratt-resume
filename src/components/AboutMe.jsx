import React, { useEffect, useRef } from 'react'
import './AboutMe.css'

const AboutMe = () => {
  const sectionRef = useRef(null)
  const waveEmojiRef = useRef(null)
  const heroSectionRef = useRef(null)
  const lastWaveTimeRef = useRef(0)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, index * 100)
        }
      })
    }, observerOptions)

    // Progressive line animation for connected sections
    const connectedSection = sectionRef.current?.querySelector('.connected-section')
    const connectedElements = sectionRef.current?.querySelectorAll('.connected-subsection')
    const connectionLineFirst = connectedSection?.querySelector('.connection-line-first')
    const connectionLineSecond = connectedSection?.querySelector('.connection-line-second')
    
    let scrollHandler = null
    
    if (connectedSection && connectedElements && connectionLineFirst && connectionLineSecond) {
      // Initialize lines as hidden
      connectionLineFirst.style.height = '0px'
      connectionLineFirst.style.opacity = '0'
      connectionLineFirst.style.visibility = 'hidden'
      connectionLineSecond.style.height = '0px'
      connectionLineSecond.style.opacity = '0'
      connectionLineSecond.style.visibility = 'hidden'
      
      let visibleSections = new Set()
      let completedSections = new Set() // Track sections that have been fully revealed
      
      // Store fixed positions once calculated to prevent lines from moving on scroll
      let firstLineStartPos = null
      let firstLineEndPos = null
      let secondLineStartPos = null
      let secondLineEndPos = null
      
      // Calculate icon positions relative to connected section (only once when section becomes visible)
      // First line starts from Head of Product icon (most recent visible icon when Product Lead appears)
      const calculateFirstLinePositions = () => {
        if (firstLineStartPos !== null && firstLineEndPos !== null) return // Already calculated
        
        const firstSection = connectedElements[0]
        const secondSection = connectedElements[1]
        if (firstSection && secondSection) {
          // Ensure first section is visible (most recent icon displayed)
          const firstIcon = firstSection.querySelector('.subsection-icon')
          const secondIcon = secondSection.querySelector('.subsection-icon')
          if (firstIcon && secondIcon && firstSection.classList.contains('visible')) {
            const firstIconRect = firstIcon.getBoundingClientRect()
            const secondIconRect = secondIcon.getBoundingClientRect()
            const connectedRect = connectedSection.getBoundingClientRect()
            
            // Calculate positions relative to connected section container
            // Start from center of Head of Product icon (most recent visible icon)
            firstLineStartPos = (firstIconRect.top - connectedRect.top) + (firstIconRect.height / 2)
            firstLineEndPos = secondIconRect.top - connectedRect.top
          }
        }
      }
      
      // Second line starts from Product Lead icon (most recent visible icon when Founding PM appears)
      const calculateSecondLinePositions = () => {
        if (secondLineStartPos !== null && secondLineEndPos !== null) return // Already calculated
        
        const secondSection = connectedElements[1]
        const thirdSection = connectedElements[2]
        if (secondSection && thirdSection) {
          // Ensure second section is visible (most recent icon displayed)
          const secondIcon = secondSection.querySelector('.subsection-icon')
          const thirdIcon = thirdSection.querySelector('.subsection-icon')
          if (secondIcon && thirdIcon && secondSection.classList.contains('visible')) {
            const secondIconRect = secondIcon.getBoundingClientRect()
            const thirdIconRect = thirdIcon.getBoundingClientRect()
            const connectedRect = connectedSection.getBoundingClientRect()
            
            // Calculate positions relative to connected section container
            // Start from center of Product Lead icon (most recent visible icon)
            secondLineStartPos = (secondIconRect.top - connectedRect.top) + (secondIconRect.height / 2)
            secondLineEndPos = thirdIconRect.top - connectedRect.top
          }
        }
      }
      
      const updateLineHeight = () => {
        // First line: Head of Product center → Product Lead top (stops at top of Product Lead icon)
        // Once drawn, this line persists to connect the two experiences
        if (completedSections.has(2) || visibleSections.has(2)) {
          if (firstLineStartPos === null || firstLineEndPos === null) {
            calculateFirstLinePositions()
          }
          
          if (firstLineStartPos !== null && firstLineEndPos !== null) {
            const height = firstLineEndPos - firstLineStartPos
            connectionLineFirst.style.top = `${firstLineStartPos}px`
            connectionLineFirst.style.height = `${Math.max(0, height)}px`
            connectionLineFirst.style.visibility = 'visible'
            connectionLineFirst.style.opacity = '1'
          }
        }
        
        // Second line: Product Lead center → Founding PM top (stops at top of Founding PM icon)
        // Once drawn, this line persists to connect the experiences
        if (completedSections.has(3) || visibleSections.has(3)) {
          if (secondLineStartPos === null || secondLineEndPos === null) {
            calculateSecondLinePositions()
          }
          
          if (secondLineStartPos !== null && secondLineEndPos !== null) {
            const height = secondLineEndPos - secondLineStartPos
            connectionLineSecond.style.top = `${secondLineStartPos}px`
            connectionLineSecond.style.height = `${Math.max(0, height)}px`
            connectionLineSecond.style.visibility = 'visible'
            connectionLineSecond.style.opacity = '1'
          }
        }
      }

      // Observe each connected subsection individually
      connectedElements.forEach((el, index) => {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              visibleSections.add(index + 1)
              
              // First section (Head of Product) appears immediately, no line
              if (index === 0) {
                setTimeout(() => {
                  entry.target.classList.add('visible')
                }, 200)
              } 
              // Second section (Product Lead) - first line extends from Head of Product icon (most recent visible)
              else if (index === 1 && !completedSections.has(2)) {
                // Ensure first section is visible before calculating line positions
                // First line extends from first icon center (most recent visible icon) to second icon top
                if (connectedElements[0].classList.contains('visible')) {
                  calculateFirstLinePositions()
                  updateLineHeight()
                  // Wait for line animation to complete (0.6s) before showing section
                  setTimeout(() => {
                    entry.target.classList.add('visible')
                    completedSections.add(2) // Mark as completed - line will persist
                    updateLineHeight() // Ensure first line stays visible
                  }, 700) // Delay to let line animation fully complete
                } else {
                  // Fallback: if previous section isn't visible yet, show this one anyway after a short delay
                  setTimeout(() => {
                    entry.target.classList.add('visible')
                    completedSections.add(2)
                  }, 300)
                }
              }
              // Third section (Founding PM) - second line extends from Product Lead icon (most recent visible)
              else if (index === 2 && !completedSections.has(3)) {
                // Ensure second section is visible before calculating line positions
                // Second line extends from second icon center (most recent visible icon) to third icon top
                if (connectedElements[1].classList.contains('visible')) {
                  calculateSecondLinePositions()
                  updateLineHeight()
                  // Wait for line animation to complete before showing section
                  setTimeout(() => {
                    entry.target.classList.add('visible')
                    completedSections.add(3) // Mark as completed
                    updateLineHeight() // Ensure both lines stay visible
                  }, 700) // Delay to let line animation fully complete
                } else {
                  // Fallback: if previous section isn't visible yet, show this one anyway after a short delay
                  setTimeout(() => {
                    entry.target.classList.add('visible')
                    completedSections.add(3)
                  }, 300)
                }
              } else if (completedSections.has(index + 1)) {
                // Section already completed, just ensure it's visible
                entry.target.classList.add('visible')
                updateLineHeight() // Update line positions
              }
            } else {
              // When section leaves view, remove from visible set but keep completed
              visibleSections.delete(index + 1)
              // Update lines to maintain their state
              updateLineHeight()
            }
          })
        }, { root: null, rootMargin: '-5% 0px -5% 0px', threshold: 0.1 })
        
        sectionObserver.observe(el)
      })

      // Update lines on scroll only to maintain visibility, positions are fixed once calculated
      scrollHandler = () => {
        // Only update if we need to maintain line visibility, positions are already fixed
        if (completedSections.size > 0 || visibleSections.size >= 2) {
          updateLineHeight()
        }
      }
      
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }

    const elements = sectionRef.current?.querySelectorAll('.about-subsection:not(.hero-section):not(.connected-subsection)')
    elements?.forEach(el => observer.observe(el))

    return () => {
      elements?.forEach(el => observer.unobserve(el))
      // Cleanup scroll listener if it was added
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [])

  // Wave animation logic
  useEffect(() => {
    const waveEmoji = waveEmojiRef.current
    const heroSection = heroSectionRef.current
    
    if (!waveEmoji || !heroSection) return

    const triggerWave = () => {
      const now = Date.now()
      // Check if 1 second has passed since last wave
      if (now - lastWaveTimeRef.current < 1000) return
      
      lastWaveTimeRef.current = now
      waveEmoji.classList.remove('wave-animate')
      // Force reflow
      void waveEmoji.offsetWidth
      waveEmoji.classList.add('wave-animate')
    }

    // Wave once on initial load (wait 1 second after page loads)
    const initialTimeout = setTimeout(() => {
      triggerWave()
    }, 1000)

    // Track if section was previously visible to detect scroll-back-into-view
    let wasVisible = false
    let isInitialLoad = true
    
    // Wave when scrolling back into view (wait 1 second after coming into view)
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !wasVisible) {
          // Section just came into view
          wasVisible = true
          
          // Skip the initial load (handled by initialTimeout)
          if (isInitialLoad) {
            isInitialLoad = false
            return
          }
          
          // Wait 1 second then wave
          setTimeout(() => {
            triggerWave()
          }, 1000)
        } else if (!entry.isIntersecting) {
          // Section left view, reset flag
          wasVisible = false
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    })
    
    heroObserver.observe(heroSection)

    return () => {
      clearTimeout(initialTimeout)
      heroObserver.disconnect()
    }
  }, [])

  return (
    <section id="about-me" className="about-me" ref={sectionRef}>
      <div className="about-container">
        
        {/* Hero Section */}
        <div className="about-subsection hero-section" ref={heroSectionRef}>
          <p className="hero-intro"><span className="wave-emoji" ref={waveEmojiRef}>👋</span> Hey there, my name is:</p>
          <h1 className="hero-title">
            <span className="hero-name">MICHAEL PRATT</span>
          </h1>
          <div className="hero-content">
            <p className="hero-line">
              I am a <span className="underline">passionate product leader</span> building products that scale from zero to millions.
            </p>
            <p className="hero-line">
              I am always <span className="underline">looking for new opportunities</span> to create something meaningful.
            </p>
            <p className="hero-line">
              I am <span className="underline">building and shipping</span> products that people love.
            </p>
            <p className="hero-line">
              Let's make something <span className="underline">astounding</span> together.
            </p>
          </div>
        </div>

        {/* Connected Apple/Platoon Section */}
        <div className="connected-section">
          <div className="connection-line connection-line-first"></div>
          <div className="connection-line connection-line-second"></div>
          
          {/* Head of Product @ Apple */}
          <div className="about-subsection connected-subsection">
            <div className="subsection-header">
              <div className="subsection-icon subsection-icon-image">
                <img src="/images/Apple.png" alt="Apple" />
              </div>
              <div className="subsection-title-wrapper">
                <h2 className="subsection-title">Head of Product @ Apple</h2>
                <p className="subsection-subtitle">Platoon for Artists, Platoon for DJs, Platoon.ai, Bis.se</p>
                <span className="subsection-date">Aug. 2025 — Present</span>
              </div>
            </div>
            <div className="subsection-content">
              <ul className="achievement-list">
                <li>Scaled product from mid 6-figures to high 9-figures ($XXXM ARR) in under 4 years</li>
                <li>IC + Management Experience — I love to build and help others grow :)</li>
              </ul>
            </div>
          </div>

          {/* Product Lead @ Apple */}
          <div className="about-subsection connected-subsection">
            <div className="subsection-header">
              <div className="subsection-icon subsection-icon-image">
                <img src="/images/Apple.png" alt="Apple" />
              </div>
              <div className="subsection-title-wrapper">
                <h2 className="subsection-title">Product Lead @ Apple</h2>
                <p className="subsection-subtitle">Platoon Ecosystem</p>
                <span className="subsection-date">Nov. 2022 — Sep. 2025</span>
              </div>
            </div>
            <div className="subsection-content">
              <ul className="achievement-list">
                <li>Led zero-to-one effort on Platoon for DJs, enabling first-ever DJ mix monetization and impacting Apple Music subs</li>
                <li>Shipped and optimized features across iOS (Control Center, Photos, Fitness+), driving $XXM in yearly cost savings and revenue</li>
              </ul>
            </div>
          </div>

          {/* Founding Product Manager @ Platoon */}
          <div className="about-subsection connected-subsection">
            <div className="subsection-header">
              <div className="subsection-icon subsection-icon-image">
                <img src="/images/Platoon.png" alt="Platoon" />
              </div>
              <div className="subsection-title-wrapper">
                <h2 className="subsection-title">Founding Product Manager @ Platoon</h2>
                <p className="subsection-subtitle">Acquired by Apple</p>
                <span className="subsection-date">Jan. 2020 — Nov. 2022</span>
              </div>
            </div>
            <div className="subsection-content">
              <ul className="achievement-list">
                <li>Led zero-to-one development of Platoon's first distribution platform</li>
                <li>Achieved 3× more users in 2 months than in the prior 4 years combined</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Founder @ First Scratch Entertainment */}
        <div className="about-subsection">
          <div className="subsection-header">
            <div className="subsection-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div className="subsection-title-wrapper">
              <h2 className="subsection-title">Founder @ First Scratch Entertainment</h2>
              <span className="subsection-date">May 2016 — Dec. 2019</span>
            </div>
          </div>
          <div className="subsection-content">
            <ul className="achievement-list">
              <li>Built and launched a marketplace for producers to sell their IP</li>
              <li>Grew it to 6-figure ARR</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Founder, Investor & Product Advisor*/}
        <div className="about-subsection">
          <div className="subsection-header">
            <div className="subsection-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="subsection-title-wrapper">
              <h2 className="subsection-title">Founder, Investor & Product Advisor</h2>
              <span className="subsection-date">Apr. 2022 — Present</span>
            </div>
          </div>
          <div className="subsection-content">
            <ul className="achievement-list">
              <li>Scaled one client from zero to 7-figure ARR, stepping in as a founder-level advisor to guide growth and product direction</li>
              <li>Advisor for early-stage startups accepted into Y Combinator and a16z, supporting product strategy and ops for a small equity stake</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Hacking / Side Projects */}
        <div className="about-subsection hacking-section">
          <div className="subsection-header">
            <div className="subsection-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div className="subsection-title-wrapper">
              <h2 className="subsection-title">Hacking / Side Projects</h2>
              <span className="subsection-date">Aug. 2024 — Present</span>
            </div>
          </div>
          <div className="subsection-content">
            <ul className="achievement-list">
              <li><a href="https://75align.com" target="_blank" rel="noopener noreferrer" className="project-link">75align.com</a> – customizable daily habit tracker that helps users set measurable goals and stay consistent</li>
              <li><a href="https://unium.ai" target="_blank" rel="noopener noreferrer" className="project-link">Unium.ai</a> – vectorizes uploaded research so users can ask questions and get answers grounded in their papers</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutMe

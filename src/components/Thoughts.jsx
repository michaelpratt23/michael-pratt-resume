import React, { useEffect, useState, useRef } from 'react'
import './Thoughts.css'

const Thoughts = () => {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const titleRef = useRef(null)

  useEffect(() => {
    // Animate title on scroll
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    }

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 1s ease-out forwards'
        }
      })
    }, observerOptions)

    if (titleRef.current) {
      titleObserver.observe(titleRef.current)
    }

    return () => {
      if (titleRef.current) {
        titleObserver.unobserve(titleRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // TODO: Integrate with Twitter/X API to fetch real tweets
    // For now, using placeholder tweets
    // To implement: Use Twitter API v2 or X API to fetch @michaelpratt23's latest tweets
    
    const placeholderTweets = [
      {
        id: '1',
        text: 'This is a placeholder tweet. In production, this will fetch real tweets from @michaelpratt23 using the Twitter/X API.',
        createdAt: new Date().toISOString(),
        author: 'michaelpratt23'
      },
      {
        id: '2',
        text: 'To implement: Add Twitter API credentials and fetch latest tweets. Consider using Twitter API v2 or X API endpoints.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        author: 'michaelpratt23'
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setTweets(placeholderTweets)
      setLoading(false)
      
      // Set up intersection observer for tweet cards
      setTimeout(() => {
        const cards = document.querySelectorAll('.tweet-card')
        const cardObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('visible')
              }, index * 100)
              cardObserver.unobserve(entry.target)
            }
          })
        }, {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.1
        })
        
        cards.forEach(card => cardObserver.observe(card))
      }, 100)
    }, 500)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <section id="thoughts" className="thoughts">
      <div className="thoughts-container">
        <h2 className="thoughts-title" ref={titleRef}>Thoughts</h2>
        
        {loading ? (
          <div className="thoughts-loading">Loading thoughts...</div>
        ) : (
          <div className="tweets-feed">
            {tweets.length === 0 ? (
              <div className="no-tweets">No thoughts yet.</div>
            ) : (
              tweets.map(tweet => (
                <article key={tweet.id} className="tweet-card">
                  <div className="tweet-header">
                    <span className="tweet-author">@{tweet.author}</span>
                    <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
                  </div>
                  <p className="tweet-text">{tweet.text}</p>
                </article>
              ))
            )}
          </div>
        )}

        <div className="thoughts-note">
          <p>This section will also host long-form writing in the future.</p>
        </div>
      </div>
    </section>
  )
}

export default Thoughts


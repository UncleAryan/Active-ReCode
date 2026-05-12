import React, { useState, useEffect } from 'react'
import { storage } from '../logic/db'
import { scheduler } from '../logic/scheduler'
import ThemeToggle from './ThemeToggle'

function ReviewQueue({ userId, problems, onSelectProblem, onBack, theme, toggleTheme }) {
  const [dueItems, setDueItems] = useState([])
  const [newItems, setNewItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function buildQueue() {
      const now = new Date()
      const challenges = await storage.getAllChallenges()
      const dueCards = await scheduler.getDueCards(userId, now)
      const allCards = await storage.getCardsByUser(userId)

      const dueMap = new Map(dueCards.map(c => [c.challengeId, c]))
      const cardMap = new Map(allCards.map(c => [c.challengeId, c]))

      // Use first-entry-wins so the ID matches getChallenge().first() in ProblemPage
      const titleToChallenge = new Map()
      for (const c of challenges) {
        if (!titleToChallenge.has(c.title)) titleToChallenge.set(c.title, c)
      }

      const due = []
      const fresh = []

      for (const problem of problems) {
        const challenge = titleToChallenge.get(problem.title)
        if (!challenge) continue

        if (dueMap.has(challenge.id)) {
          due.push(problem)
        } else {
          // Treat problems without a real FSRS card (reps field) as new
          const card = cardMap.get(challenge.id)
          const hasRealCard = card?.fsrsCard?.reps !== undefined
          if (!card || !hasRealCard) {
            fresh.push(problem)
          }
          // Problems with a future due date are skipped (scheduled, not yet due)
        }
      }

      setDueItems(due)
      setNewItems(fresh)
      setLoading(false)
    }

    if (userId) buildQueue()
  }, [userId])

  if (loading) {
    return <div className="loading">Loading queue...</div>
  }

  const isEmpty = dueItems.length === 0 && newItems.length === 0

  return (
    <div className="review-queue">
      <div className="queue-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h1>Review Queue</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{dueItems.length}</div>
          <div className="stat-label">Due for Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{newItems.length}</div>
          <div className="stat-label">New Problems</div>
        </div>
      </div>

      {isEmpty ? (
        <div className="queue-empty">
          You're all caught up! No problems due right now.
        </div>
      ) : (
        <>
          {dueItems.length > 0 && (
            <div className="queue-section due">
              <div className="queue-section-title">Due for Review</div>
              {dueItems.map(problem => (
                <div
                  key={problem.title}
                  className="queue-item"
                  onClick={() => onSelectProblem(problem)}
                >
                  <div className="queue-item-left">
                    <span className="queue-item-title">{problem.title}</span>
                    <span className={`difficulty-chip ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                  </div>
                  <div className="queue-item-right">
                    <span className="badge-due">DUE</span>
                    <span className="queue-chevron">›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {newItems.length > 0 && (
            <div className="queue-section new">
              <div className="queue-section-title">New Problems</div>
              {newItems.map(problem => (
                <div
                  key={problem.title}
                  className="queue-item"
                  onClick={() => onSelectProblem(problem)}
                >
                  <div className="queue-item-left">
                    <span className="queue-item-title">{problem.title}</span>
                    <span className={`difficulty-chip ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                  </div>
                  <div className="queue-item-right">
                    <span className="badge-new">NEW</span>
                    <span className="queue-chevron">›</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewQueue

import React, { useState, useEffect } from 'react'
import { storage } from '../logic/db'
import ThemeToggle from './ThemeToggle'

function Dashboard({ userId, problems, onSelectProblem, onOpenQueue, theme, toggleTheme }) {
  // keeps track of titles of solved problems
  const [solvedTitles, setSolvedTitles] = useState(new Set())

  // load problems for the local user as attempted or solved, as well as all other problems
  useEffect(() => {
    async function loadProgress() {
      const challenges = await storage.getAllChallenges()
      const cards = await storage.getCardsByUser(userId)

      // Any card (old { completed } format or real FSRS card) counts as solved
      const completedIds = new Set(cards.map(c => c.challengeId))

      // map the IDs for completed problems to problem titles
      const solved = new Set()
      for (const ch of challenges) {
        if (completedIds.has(ch.id)) {
          solved.add(ch.title)
        }
      }

      setSolvedTitles(solved)
    }
    loadProgress()
  }, [userId])

  const total = problems.length
  const solvedCount = solvedTitles.size
  const successRate = total > 0 ? Math.round((solvedCount / total) * 100) : 0

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="app-brand">
          <span className="app-brand-dot"></span>
          <h1>Active ReCode</h1>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button className="queue-btn" onClick={onOpenQueue}>Review Queue</button>
          <button className="begin-btn" onClick={() => onSelectProblem(problems[0])}>Begin Studying</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{solvedCount} / {total}</div>
          <div className="stat-label">Problems Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{successRate}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      <div className="problem-list">
        <div className="problem-list-header">
          <h2>Problems</h2>
          <span className="problem-count">{total} total</span>
        </div>
        <div className="problem-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Date Added</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => {
                const solved = solvedTitles.has(p.title)
                return (
                  <tr
                    key={p.title}
                    className="problem-row"
                    onClick={() => onSelectProblem(p)}
                  >
                    <td>{p.title}</td>
                    <td>
                      <span className={`difficulty-chip ${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td>{p.dateAdded}</td>
                    <td>
                      <span className={solved ? 'status-solved' : 'status-unsolved'}>
                        {solved ? 'Solved' : 'Not Solved'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

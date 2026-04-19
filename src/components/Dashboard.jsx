import React, { useState, useEffect } from 'react'
import { storage } from '../logic/db'

function Dashboard({ userId, problems, onSelectProblem }) {
  // keeps track of titles of solved problems
  const [solvedTitles, setSolvedTitles] = useState(new Set())

  // load problems for the local user as attempted or solved, as well as all other problems
  useEffect(() => {
    async function loadProgress() {
      const challenges = await storage.getAllChallenges()
      const cards = await storage.getCardsByUser(userId)

      // set of IDs for completed problems for that local user
      const completedIds = new Set(
        cards.filter(c => c.fsrsCard?.completed).map(c => c.challengeId)
      )

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
        <h1>Code Trainer</h1>
        <button
          className="begin-btn"
          onClick={() => onSelectProblem(problems[0])}
        >
          Begin Studying
        </button>
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
        <h2>Problems</h2>
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
                    <span className={p.difficulty.toLowerCase()}>
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
  )
}

export default Dashboard

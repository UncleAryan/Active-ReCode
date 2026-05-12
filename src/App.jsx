import { useState, useEffect } from 'react'
import { storage } from './logic/db'
import Dashboard from './components/Dashboard'
import ProblemPage from './components/ProblemPage'
import ReviewQueue from './components/ReviewQueue'
import problems from './problems'
import './App.css'

function App() {
  const [page, setPage] = useState('dashboard')
  const [selectedProblem, setSelectedProblem] = useState(null)

  // user id for our guest session
  const [guestUserId, setGuestUserId] = useState(null)
  const [dbReady, setDbReady] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  // seed once on first load
  useEffect(() => {
    async function seed() {
      // user if its the first time
      // made it this way so that when we close out and come back we fetch from db.js
      let user = await storage.getUser("guest")
      if (!user) {
        await storage.addUser("guest", "")
        user = await storage.getUser("guest")
      }
      setGuestUserId(user.id)

      // put all problems in db.js if they aren't already there
      for (const p of problems) {
        const existing = await storage.getChallenge(p.title)
        if (!existing) {
          await storage.addChallenge(p.title, p.description, p.testCases, "", p.functionName)
        }
      }

      setDbReady(true)
    }
    seed()
  }, [])

  function goToProblem(p, fromReview = false) {
    setSelectedProblem(p)
    setReviewMode(fromReview)
    setPage('problem')
  }

  if (page === 'problem' && selectedProblem) {
    return (
      <ProblemPage
        problem={selectedProblem}
        userId={guestUserId}
        reviewMode={reviewMode}
        onBack={() => setPage('dashboard')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )
  }

  if (page === 'queue') {
    return (
      <ReviewQueue
        userId={guestUserId}
        problems={problems}
        onSelectProblem={(p) => goToProblem(p, true)}
        onBack={() => setPage('dashboard')}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    )
  }

  return (
    <Dashboard
      userId={guestUserId}
      problems={problems}
      onSelectProblem={goToProblem}
      onOpenQueue={() => setPage('queue')}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  )
}

export default App

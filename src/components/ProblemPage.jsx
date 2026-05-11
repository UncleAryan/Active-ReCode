import React, { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { runUserCode } from '../logic/codeRunner'
import { storage } from '../logic/db'
import { scheduler } from '../logic/scheduler'

function ProblemPage({ problem, userId, onBack, reviewMode = false }) {
  const [code, setCode] = useState(problem.starterCode)
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [rated, setRated] = useState(false)
  const [ratingError, setRatingError] = useState(false)

  useEffect(() => {
    if (reviewMode) return
    storage.getDraft(userId, problem.title).then(draft => {
      if (draft) setCode(draft.code)
    })
  }, [])

  async function handleBack() {
    if (!reviewMode) await storage.saveDraft(userId, problem.title, code)
    onBack()
  }

  async function executeTests(testCases) {
    const output = []
    for (const testCase of testCases) {
      const result = await runUserCode({
        userCode: code,
        functionName: problem.functionName,
        testInput: testCase.input,
        expectedOutput: testCase.expected,
      })
      output.push(result)
    }
    return output
  }

  // only executes the first 2 cases
  async function handleRun() {
    setRunning(true)
    setResults(null)

    const cases = await executeTests(problem.testCases.slice(0, 2))
    setResults({ type: 'run', cases })
    setRunning(false)
  }

  // runs all cases
  async function handleSubmit() {
    setRunning(true)
    setResults(null)
    setRated(false)
    setRatingError(false)

    const cases = await executeTests(problem.testCases)
    const allPassed = cases.every(r => r.passed)

    setResults({ type: 'submit', cases, allPassed })
    setRunning(false)
  }

  // Called when user picks a rating after a successful submission
  async function handleRate(rating) {
    setRatingError(false)
    try {
      const challenge = await storage.getChallenge(problem.title)
      if (challenge) {
        const result = await scheduler.review(userId, challenge.id, rating)
        console.log('[rate] reps:', result?.card?.reps, '| due:', result?.card?.due, '| challengeId:', challenge.id)
      }
      setRated(true)
    } catch (err) {
      console.error('[rate] failed:', err)
      setRatingError(true)
    }
  }

  return (
    <div className="problem-page">

      <div className="problem-header">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <h2>{problem.title}</h2>
        <span className={problem.difficulty.toLowerCase()}>{problem.difficulty}</span>
      </div>

      <div className="problem-layout">

        <div className="problem-description">
          <h3>{problem.title}</h3>
          <div className="problem-meta">
            <span className={`difficulty-chip ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          </div>
          <pre>{problem.description}</pre>
        </div>

        <div className="code-panel">
          <div className="editor-toolbar">
            <span className="lang-badge">
              <span className="lang-dot"></span>
              JavaScript
            </span>
            <div className="btn-group">
              <button
                className="run-btn"
                onClick={handleRun}
                disabled={running}
              >
                {running ? 'Running...' : 'Run'}
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={running}
              >
                {running ? 'Running...' : 'Submit'}
              </button>
            </div>
          </div>

          <CodeMirror
            className="code-editor"
            value={code}
            onChange={(val) => setCode(val)}
            extensions={[javascript()]}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              indentOnInput: true,
            }}
          />

          {results && (
            <div className="results-panel">
              <h4>
                {results.type === 'submit' ? 'Submission Results' : 'Test Run'}
              </h4>

              {results.type === 'submit' && (
                <div className={`verdict ${results.allPassed ? 'pass' : 'fail'}`}>
                  {results.allPassed
                    ? 'Accepted — all tests passed!'
                    : 'Wrong Answer — some tests failed.'}
                </div>
              )}

              {/* Rating prompt shown after a successful submit */}
              {results.type === 'submit' && results.allPassed && (
                <div className="rating-section">
                  {rated ? (
                    <div className="rating-done">Rated! See you next time.</div>
                  ) : ratingError ? (
                    <div className="rating-done" style={{ color: '#ef4444' }}>Rating failed — check the browser console for details.</div>
                  ) : (
                    <>
                      <div className="rating-label">How well did you know this?</div>
                      <div className="rating-buttons">
                        <button className="rating-btn rating-btn-again" onClick={() => handleRate(scheduler.Rating.Again)}>Again</button>
                        <button className="rating-btn rating-btn-hard"  onClick={() => handleRate(scheduler.Rating.Hard)}>Hard</button>
                        <button className="rating-btn rating-btn-good"  onClick={() => handleRate(scheduler.Rating.Good)}>Good</button>
                        <button className="rating-btn rating-btn-easy"  onClick={() => handleRate(scheduler.Rating.Easy)}>Easy</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* shows each test case in each row */}
              {results.cases.map((r, i) => (
                <div
                  key={i}
                  className={`test-case-result ${r.passed ? 'passed' : 'failed'}`}
                >
                  <div className="tc-header">
                    {r.passed ? 'Passed' : 'Failed'} — Test case {i + 1}
                  </div>

                  {r.error ? (
                    <div className="tc-error">Error: {r.error}</div>
                  ) : (
                    <>
                      <div className="tc-detail">
                        Expected: {JSON.stringify(r.expected)}
                      </div>
                      <div className="tc-detail">
                        Got:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{JSON.stringify(r.actual)}
                      </div>
                      <div className="tc-detail">Time: {r.timeTaken}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemPage

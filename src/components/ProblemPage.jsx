import React, { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { runUserCode as runJS } from '../logic/codeRunner'
import { runUserCode as runPython } from '../logic/pyRunner'
import { storage } from '../logic/db'
import { scheduler } from '../logic/scheduler'
import ThemeToggle from './ThemeToggle'

function ProblemPage({ problem, userId, onBack, reviewMode = false, theme, toggleTheme }) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(problem.starterCode)
  const [pyReady, setPyReady] = useState(false)
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [rated, setRated] = useState(false)
  const [ratingError, setRatingError] = useState(false)

  useEffect(() => {
    if (reviewMode) return
    storage.getLastDraft(userId, problem.title).then(draft => {
      if (draft) {
        setLanguage(draft.language)
        setCode(draft.code)
      }
    })
  }, [])

  async function switchLanguage(lang) {
    if (lang === language) return
    if (!reviewMode) await storage.saveDraft(userId, problem.title, language, code)
    const draft = await storage.getDraft(userId, problem.title, lang)
    setLanguage(lang)
    setResults(null)
    setPyReady(false)
    setCode(draft ? draft.code : (lang === 'python' ? problem.pythonStarterCode : problem.starterCode))
  }

  async function handleBack() {
    if (!reviewMode) await storage.saveDraft(userId, problem.title, language, code)
    onBack()
  }

  async function executeTests(testCases) {
    const runner = language === 'python' ? runPython : runJS
    const fnName = language === 'python' ? problem.pythonFunctionName : problem.functionName
    const output = []
    for (const testCase of testCases) {
      const result = await runner({
        userCode: code,
        functionName: fnName,
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
    setPyReady(false)

    const cases = await executeTests(problem.testCases.slice(0, 2))
    setPyReady(true)
    setResults({ type: 'run', cases })
    setRunning(false)
  }

  // runs all cases
  async function handleSubmit() {
    setRunning(true)
    setResults(null)
    setRated(false)
    setRatingError(false)
    setPyReady(false)

    const cases = await executeTests(problem.testCases)
    const allPassed = cases.every(r => r.passed)

    setPyReady(true)
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
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
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
            <div className="lang-toggle">
              <button
                className={`lang-toggle-btn${language === 'javascript' ? ' active' : ''}`}
                onClick={() => switchLanguage('javascript')}
              >
                <span className="lang-dot js-dot"></span>
                JavaScript
              </button>
              <button
                className={`lang-toggle-btn${language === 'python' ? ' active' : ''}`}
                onClick={() => switchLanguage('python')}
              >
                <span className="lang-dot py-dot"></span>
                Python
              </button>
            </div>
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

          {language === 'python' && running && !pyReady && (
            <div className="py-init-notice">
              Initializing Pyodide
            </div>
          )}

          <CodeMirror
            className="code-editor"
            value={code}
            onChange={(val) => setCode(val)}
            extensions={language === 'python' ? [python()] : [javascript()]}
            theme={theme}
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
                    {r.passed ? 'PASSED' : 'FAILED'} — Test case {i + 1}
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

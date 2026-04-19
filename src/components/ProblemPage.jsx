import React, { useState } from 'react'
import { runUserCode } from '../logic/codeRunner'
import { storage } from '../logic/db'

function ProblemPage({ problem, userId, onBack }) {
  const [code, setCode] = useState(problem.starterCode)
  const [results, setResults] = useState(null)   
  const [running, setRunning] = useState(false)

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

    const cases = await executeTests(problem.testCases)
    const allPassed = cases.every(r => r.passed)

    if (allPassed) {
      const challenge = await storage.getChallenge(problem.title)
      if (challenge) {
        const alreadySaved = await storage.getCard(userId, challenge.id)
        if (!alreadySaved) {
          // using fsrsCard to store { completed } for progress tracking
          await storage.addCard(userId, challenge.id, {
            completed: true,
            submittedAt: Date.now(),
          })
        }
      }
    }

    setResults({ type: 'submit', cases, allPassed })
    setRunning(false)
  }

  // tab key inserts 2 spaces instead of jumping focus when in code editor
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: end } = e.target
      const next = code.slice(0, s) + '  ' + code.slice(end)
      setCode(next)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = s + 2
      })
    }
  }

  return (
    <div className="problem-page">
      
      <div className="problem-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <h2>{problem.title}</h2>
        <span className={problem.difficulty.toLowerCase()}>{problem.difficulty}</span>
      </div>

      <div className="problem-layout">

        <div className="problem-description">
          <h3>{problem.title}</h3>
          <div className="problem-meta">
            <span className={problem.difficulty.toLowerCase()}>{problem.difficulty}</span>
          </div>
          <pre>{problem.description}</pre>
        </div>

        <div className="code-panel">
          <div className="editor-toolbar">
            <span>JavaScript</span>
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

          <textarea
            className="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />

          {results && (
            <div className="results-panel">
              <h4>
                {results.type === 'submit' ? 'Submission Results' : 'Test Run'}
              </h4>

              {results.type === 'submit' && (
                <div className={`verdict ${results.allPassed ? 'pass' : 'fail'}`}>
                  {results.allPassed
                    ? 'Accepted! all tests passed!'
                    : 'Wrong Answer. Some tests failed.'}
                </div>
              )}

              {/* shows each test case in each row (AI assisted) */}
              {results.cases.map((r, i) => (
                <div
                  key={i}
                  className={`test-case-result ${r.passed ? 'passed' : 'failed'}`}
                >
                  <div className="tc-header">
                    {r.passed ? 'PASSED' : 'FAILED'} Test case {i + 1}
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

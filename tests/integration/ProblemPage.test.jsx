import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ProblemPage from '../../src/components/ProblemPage'
import { runUserCode } from '../../src/logic/codeRunner'

// mocking db and coderunner this time
// allows us to check pass/fail results 
vi.mock('../../src/logic/db', () => ({
  storage: {
    getChallenge: vi.fn().mockResolvedValue({ id: 1, title: 'Two Sum' }),
    getCard: vi.fn().mockResolvedValue(null),
    addCard: vi.fn().mockResolvedValue(),
    getDraft: vi.fn().mockResolvedValue(null),
    saveDraft: vi.fn().mockResolvedValue(),
  },
}))

vi.mock('../../src/logic/codeRunner', () => ({
  runUserCode: vi.fn(),
}))

const mockProblem = {
  title:        'Two Sum',
  difficulty:   'Easy',
  description:  'Given an array of integers, return indices of two numbers that add up to target.',
  functionName: 'twoSum',
  // "Run" only uses first 2 test cases
  testCases: [
    { input: '[2,7,11,15], 9', expected: [0, 1] },
    { input: '[3,2,4], 6',     expected: [1, 2] },
  ],
  starterCode: 'function twoSum(nums, target) {\n  \n}',
}

// fake passing result 
const passingResult = {
  passed:    true,
  actual:    [0, 1],
  expected:  [0, 1],
  timeTaken: '1 ms',
  error:     null,
}

// fake failing result
const failingResult = {
  passed:    false,
  actual:    null,
  expected:  [0, 1],
  timeTaken: '1 ms',
  error:     null,
}


test('clicking Back calls onBack', async () => {
  const onBack = vi.fn() // to be inspected to verify behaviour at end

  render(<ProblemPage problem={mockProblem} userId={1} onBack={onBack} />)

  await userEvent.click(screen.getByText('Back'))

  expect(onBack).toHaveBeenCalled()
})

test('clicking Run shows the test results panel', async () => {
  runUserCode.mockResolvedValue(passingResult)

  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  await userEvent.click(screen.getByText('Run'))

  await waitFor(() => {
    expect(screen.getByText('Test Run')).toBeInTheDocument()
  })
})

test('Run shows PASSED for each test case that passes', async () => {
  runUserCode.mockResolvedValue(passingResult)

  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  await userEvent.click(screen.getByText('Run'))

  await waitFor(() => {
    // we expect 2 labels because "Run" checks 2 cases
    expect(screen.getAllByText(/PASSED/).length).toBe(2)
  })
})

test('clicking Submit shows Accepted when all test cases pass', async () => {
  runUserCode.mockResolvedValue(passingResult)

  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  await userEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(screen.getByText(/Accepted/)).toBeInTheDocument()
  })
})

test('clicking Submit shows Wrong Answer when a test case fails', async () => {
  runUserCode.mockResolvedValue(failingResult)

  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  await userEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(screen.getByText(/Wrong Answer/)).toBeInTheDocument()
  })
})

test('Run and Submit buttons are disabled while running', async () => {
  runUserCode.mockImplementation(() => new Promise(() => {}))

  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  await userEvent.click(screen.getByText('Run'))

  // when we click "Run" both buttons are disabled and show "Running..."
  // this is why we need to getAllByText()
  const runningButtons = screen.getAllByText('Running...')
  runningButtons.forEach(button => expect(button).toBeDisabled())
})

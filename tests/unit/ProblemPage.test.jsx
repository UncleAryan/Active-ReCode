import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ProblemPage from '../../src/components/ProblemPage'

vi.mock('../../src/logic/db', () => ({
  storage: {
    getChallenge: vi.fn().mockResolvedValue({ id: 1, title: 'Two Sum' }),
    getCard:      vi.fn().mockResolvedValue(null),
    addCard:      vi.fn().mockResolvedValue(),
  },
}))

vi.mock('../../src/logic/codeRunner', () => ({
  runUserCode: vi.fn(), // we don't call it in unit tests, so no return value needed
}))

// fake prop 
const mockProblem = {
  title:        'Two Sum',
  difficulty:   'Easy',
  description:  'Given an array of integers, return indices of two numbers that add up to target.',
  functionName: 'twoSum',
  testCases:    [{ input: '[2,7,11,15], 9', expected: [0, 1] }],
  starterCode:  'function twoSum(nums, target) {\n  \n}',
}

test('renders the problem title', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  // The title appears in header and description
  // getAllByText returns all matches and we just confirm at least one exists
  expect(screen.getAllByText('Two Sum').length).toBeGreaterThan(0)
})

test('renders the difficulty label', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
})

test('renders the problem description', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByText(mockProblem.description)).toBeInTheDocument()
})

test('renders the Back button', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByText('← Back')).toBeInTheDocument()
})

test('renders the Run button', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByText('Run')).toBeInTheDocument()
})

test('renders the Submit button', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByText('Submit')).toBeInTheDocument()
})

test('pre-fills the editor with the starter code', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByDisplayValue(/function twoSum/)).toBeInTheDocument()
})

test('shows the JavaScript language label', () => {
  render(<ProblemPage problem={mockProblem} userId={1} onBack={vi.fn()} />)

  expect(screen.getByText('JavaScript')).toBeInTheDocument()
})

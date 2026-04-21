// "render" uses jsdom to render UI
// "screen" searches for what is being rendered
// "waitFor" waits for async calls to finish before checking

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Dashboard from '../../src/components/Dashboard'

// mock db to return fake data so we can test the data rather than using real data
vi.mock('../../src/logic/db', () => ({
  storage: {
    getAllChallenges: vi.fn().mockResolvedValue([{ id: 1, title: 'Two Sum' }]),
    getCardsByUser:  vi.fn().mockResolvedValue([]),  
  },
}))

const mockProblems = [
  { title: 'Two Sum', difficulty: 'Easy', dateAdded: '04/18/2026' },
]

test('renders the page title', () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)
  expect(screen.getByText('Code Trainer')).toBeInTheDocument()
})

test('renders the Begin Studying button', () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)
  expect(screen.getByText('Begin Studying')).toBeInTheDocument()
})

test('renders the problem title in the list', () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)
  expect(screen.getByText('Two Sum')).toBeInTheDocument()
})

test('renders the problem difficulty', () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)
  expect(screen.getByText('Easy')).toBeInTheDocument()
})

test('renders the problem date', () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)
  expect(screen.getByText('04/18/2026')).toBeInTheDocument()
})

test('shows 0 / 1 problems completed when nothing is solved', async () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  // because the stat counts are set after the async call finishes
  await waitFor(() => {
    expect(screen.getByText('0 / 1')).toBeInTheDocument()
  })
})

test('shows 0% success rate when nothing is solved', async () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})

test('shows Not Solved status for unsolved problem', async () => {
  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('Not Solved')).toBeInTheDocument()
  })
})

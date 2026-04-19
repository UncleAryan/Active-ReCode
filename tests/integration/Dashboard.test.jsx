import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Dashboard from '../../src/components/Dashboard'
import { storage } from '../../src/logic/db'

vi.mock('../../src/logic/db', () => ({
  storage: {
    getAllChallenges: vi.fn(),
    getCardsByUser: vi.fn(),
  },
}))

const mockProblems = [
  { title: 'Two Sum', difficulty: 'Easy', dateAdded: '04/18/2026' },
]

// prevents one test's fake data from affecting next test
beforeEach(() => {
  storage.getAllChallenges.mockResolvedValue([{ id: 1, title: 'Two Sum' }])
  storage.getCardsByUser.mockResolvedValue([])  
})

test('clicking Begin Studying opens the first problem', async () => {
  const onSelectProblem = vi.fn() 

  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={onSelectProblem} />)

  await userEvent.click(screen.getByText('Begin Studying'))

  expect(onSelectProblem).toHaveBeenCalledWith(mockProblems[0])
})

test('clicking a problem row opens that problem', async () => {
  const onSelectProblem = vi.fn()

  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={onSelectProblem} />)

  await userEvent.click(screen.getByText('Two Sum'))

  expect(onSelectProblem).toHaveBeenCalledWith(mockProblems[0])
})

test('shows 1 / 1 completed when a problem is solved', async () => {
  // hint: we are testing when 1/1 problems are completed 
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { completed: true } },
  ])

  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('1 / 1')).toBeInTheDocument()
  })
})

test('shows 100% success rate when all problems are solved', async () => {
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { completed: true } },
  ])

  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

test('shows Solved status when a problem is completed', async () => {
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { completed: true } },
  ])

  render(<Dashboard userId={1} problems={mockProblems} onSelectProblem={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('Solved')).toBeInTheDocument()
  })
})

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../hooks/use-request', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../contexts/SessionContext', () => ({
  useSession: jest.fn(),
}))

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CampaignEntry from '../(private)/page'
import useRequest from '../hooks/use-request'
import { useSession } from '../contexts/SessionContext'
import { useRouter } from 'next/navigation'

const mockPush = jest.fn()
const mockDoRequest = jest.fn()
const mockSetCampaignUser = jest.fn()

describe('CampaignEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks()

      ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
      ; (useRequest as jest.Mock).mockReturnValue({ doRequest: mockDoRequest })
      ; (useSession as jest.Mock).mockReturnValue({ setCampaignUser: mockSetCampaignUser })


  })

  it('allows user to create a campaign without act warnings', async () => {
    mockDoRequest
      .mockResolvedValueOnce({ id: 1, name: 'Test User' }) // /api/me
      .mockResolvedValueOnce({ id: 1 })                  // /api/campaigns
      .mockResolvedValueOnce({ id: 1, campaignId: 1, role: 'MASTER' })
      .mockResolvedValueOnce({
        id: '1',
        userId: 1,
        campaignId: 1,
        role: 'MASTER',
        campaign: {
          id: 1,
          name: 'arroio',
          description: 'arroio',
          currencyName: 'gold',
          active: true
        },
        user: {
          id: '1',
          name: 'test',
          type: 'USER'

        }
      })

    render(<CampaignEntry />)

    console.log('FIRST LOG -- ')
    console.log(mockDoRequest.mock.calls)
    // Wait for user info load
    await waitFor(() => {
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/me',
          method: 'get',
        })
      )
    })
    console.log('LOG DO REQUEST /api/me')
    console.log(mockDoRequest.mock.calls)

    // Switch to create view
    fireEvent.click(screen.getByText('Criar Campanha'))

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Nome da campanha'), {
      target: { value: 'My Campaign' },
    })
    fireEvent.change(screen.getByPlaceholderText('Nome da moeda da campanha'), {
      target: { value: 'Gold' },
    })
    fireEvent.change(screen.getByPlaceholderText('Descrição'), {
      target: { value: 'This is a test campaign' },
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByText('Salvar'))
    })

    console.log('LOG DO REQUEST  before /api/campaigns')
    console.log(mockDoRequest.mock.calls)
    await waitFor(() => {
      // Validate campaign creation request
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/campaigns',
          method: 'post',
          body: expect.objectContaining({
            name: 'My Campaign',
            currencyName: 'Gold',
            description: 'This is a test campaign',
            userId: 1,
          }),
        })
      )
    }
    )

    console.log('LOG DO REQUEST after  /api/campaigns')
    console.log(mockDoRequest.mock.calls)

    await waitFor(() => {
      // Validate campaign creation request
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/campaign-user',
          method: 'post',
          body: expect.objectContaining({
            userId: 1,
            campaignId: 1,
            role: 'MASTER'
          }),
        })
      )
    }
    )

    console.log('LOG DO REQUEST/api/campaign-user')
    console.log(mockDoRequest.mock.calls)



    await waitFor(() => {
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `/api/campaign-user/by-id/1`
        })
      )
    })

    console.log('LOG DO REQUEST/api/campaign-user/by-id/1')
    console.log(mockDoRequest.mock.calls)



    // Validate navigation
    expect(mockPush).toHaveBeenCalledWith('/home')

    // No errors
    expect(screen.queryByText(/erro/i)).toBeNull()

  })

  it('blocks user from creating a campaign without required fields', async () => {
    mockDoRequest.mockResolvedValueOnce({ id: 1, name: 'Test User' })

    render(<CampaignEntry />)

    await waitFor(() => {
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/me',
          method: 'get',
        })
      )
    })

    fireEvent.click(screen.getByText('Criar Campanha'))

    fireEvent.change(screen.getByPlaceholderText('Nome da campanha'), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByPlaceholderText('Nome da moeda da campanha'), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByPlaceholderText('Descrição'), {
      target: { value: 'This is a test campaign' },
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Salvar'))
    })

    expect(screen.getByText('Preencha todos os campos obrigatórios.')).toBeInTheDocument()

    await waitFor(() => {
      expect(mockDoRequest).not.toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/campaigns',
          method: 'post',
        })
      )
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('fetches and displays user campaigns when clicking "Entrar em Campanha"', async () => {
    mockDoRequest
      .mockResolvedValueOnce({ id: 1, name: 'Test User' }) // GET /api/me
      .mockResolvedValueOnce([
        {
          id: 'abc',
          userId: 1,
          campaignId: 123,
          role: 'MASTER',
          user: { id: 1, name: 'Test User' },
          campaign: {
            id: '1',
            name: 'My Campaign',
            currencyName: 'Gold',
            description: 'Test Campaign Description',
          },
        },
      ]) // GET /api/campaign-user/by-user/:id

    render(<CampaignEntry />)

    await waitFor(() => {
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/me',
          method: 'get',
        })
      )
    })

    fireEvent.click(screen.getByText('Entrar em Campanha'))

    await waitFor(() => {
      expect(mockDoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/campaign-user/by-user/1'
        })
      )
    })

    const entrarButton = await screen.findByRole('button', { name: /^entrar$/i })
    expect(entrarButton).toBeInTheDocument()

    expect(screen.getByText('My Campaign')).toBeInTheDocument()
    expect(screen.getByText('Criado por: Test User')).toBeInTheDocument()
    expect(screen.getByText('Test Campaign Description')).toBeInTheDocument()

    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })
})

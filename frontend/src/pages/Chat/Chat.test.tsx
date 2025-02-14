import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import { MemoryRouter } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Chat from './Chat'; // Ensure correct import
import { vi } from 'vitest';

describe('Chat Page', () => {
  it('renders the Chat component', () => {
    // Mock Socket.io
    const socket = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn()
    } as unknown as Socket;

    render(
      <MemoryRouter>
        <Chat socket={socket} />
      </MemoryRouter>
    );

    // Check if the text is in the document
    expect(screen.getByText('Invite your friend with this code:')).toBeInTheDocument();
  });
});

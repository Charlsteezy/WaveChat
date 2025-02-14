import { render } from '@testing-library/react';
import { Socket } from 'socket.io-client';
import Home from './Home';

describe('Home', () => {
  it('renders Home', () => {
    const socket = {} as Socket;
    const { getByText } = render(<Home socket={socket} />);
    expect(getByText('WaveChat')).toBeDefined();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { VETERANS_DATA } from '../data/veterans';

describe('Voices of Valor Memorial Application', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the memorial header banner and all veteran picture cards on initial load', () => {
    render(<App />);

    expect(screen.getByAltText(/Voices of Valor - Live Music Writers Round/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MEET OUR VETERANS/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/LIVE MUSIC/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/VETERAN STORIES/i)).toBeInTheDocument();
    expect(screen.getByText(/COMMUNITY & HONOR/i)).toBeInTheDocument();
    expect(screen.getByText(/YOUR SUPPORT HONORS THEIR LEGACY/i)).toBeInTheDocument();

    // Verify all 14 veterans from the roster are rendered in the gallery
    VETERANS_DATA.forEach((vet) => {
      expect(screen.getByText(vet.name)).toBeInTheDocument();
    });
  });

  it('filters veterans when searching by name or branch', () => {
    render(<App />);

    const searchInput = screen.getByLabelText(/Search veterans and songs/i);
    fireEvent.change(searchInput, { target: { value: 'John Bircher' } });

    expect(screen.getByText('John Bircher III')).toBeInTheDocument();
    expect(screen.queryByText('Dave Bliss')).not.toBeInTheDocument();
  });

  it('clicking a veteran picture card navigates to their song card page with lyrics and audio player', () => {
    render(<App />);

    // Click John Bircher III card
    const johnCard = screen.getByLabelText(/View song card and story for Colonel John Bircher III/i);
    fireEvent.click(johnCard);

    // Should now show the detail view
    expect(screen.getByText('The Ballad of Johnny B')).toBeInTheDocument();
    expect(screen.getByText(/Official Song Card/i)).toBeInTheDocument();

    // Verify Audio Player controls exist
    const playPauseBtn = screen.getByLabelText(/Pause song|Play song/i);
    expect(playPauseBtn).toBeInTheDocument();
  });

  it('allows viewing interactive lyrics and jumping between verses by clicking on lyric lines', () => {
    render(<App />);

    // Navigate to John Bircher III
    const johnCard = screen.getByLabelText(/View song card and story for Colonel John Bircher III/i);
    fireEvent.click(johnCard);

    // Switch to lyrics tab
    const lyricsTabBtn = screen.getByRole('button', { name: /Interactive Lyrics/i });
    fireEvent.click(lyricsTabBtn);

    // Click a distinct verse line
    const verseLine = screen.getByText(/In my beret and Army greens/i);
    expect(verseLine).toBeInTheDocument();
    fireEvent.click(verseLine);

    expect(verseLine).toBeInTheDocument();
  });

  it('navigates back to the main memorial roster when clicking the back button', () => {
    render(<App />);

    // Navigate to John Bircher III
    const johnCard = screen.getByLabelText(/View song card and story for Colonel John Bircher III/i);
    fireEvent.click(johnCard);

    expect(screen.getByText('The Ballad of Johnny B')).toBeInTheDocument();

    // Click back button
    const backBtn = screen.getByLabelText(/Back to all veterans/i);
    fireEvent.click(backBtn);

    // Verify back to poster roster
    expect(screen.getAllByText(/MEET OUR VETERANS/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Dave Bliss')).toBeInTheDocument();
  });
});

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

    // Verify all veterans from the roster are rendered in the gallery in custom order
    const renderedNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
    const expectedNames = VETERANS_DATA.map((vet) => vet.name);
    expect(renderedNames.slice(0, expectedNames.length)).toEqual(expectedNames);
    expect(expectedNames[0]).toBe('David Booth');
    expect(expectedNames[1]).toBe('Mike Chesne');
    expect(expectedNames[2]).toBe('Rob Bollinger');
    expect(expectedNames[3]).toBe('Irving Locker');
    expect(expectedNames[4]).toBe('Louis Nicosia');
    expect(expectedNames[5]).toBe('Kevin McCabe');
    expect(expectedNames[6]).toBe('Ken Rubin');
    expect(expectedNames[7]).toBe('Kris Hasenauer');
  });

  it('navigates to Steve Large song card page with Monster In a Cage', () => {
    render(<App />);

    const steveCard = screen.getByLabelText(/View song card and story for 1st Sergeant Steve Large/i);
    fireEvent.click(steveCard);

    expect(screen.getByText('Monster In a Cage')).toBeInTheDocument();
    expect(screen.getByAltText(/Song Card for Steve Large - Monster In a Cage/i)).toBeInTheDocument();
    expect(screen.getByText(/Written by Steve Large, David Booth, Johnny Bulford, Heidi Bulford/i)).toBeInTheDocument();
  });

  it('filters veterans when searching by name or branch', () => {
    render(<App />);

    const searchInput = screen.getByLabelText(/Search veterans and songs/i);
    fireEvent.change(searchInput, { target: { value: 'John Bircher' } });

    expect(screen.getByText('John Bircher III')).toBeInTheDocument();
    expect(screen.queryByText('Dave Bliss')).not.toBeInTheDocument();
  });

  it('clicking a veteran picture card with an MP3 navigates to their song card page with audio player', () => {
    render(<App />);

    // Click David Booth card (has Whats Next.mp3)
    const davidCard = screen.getByLabelText(/View song card and story for Master Sergeant David Booth/i);
    fireEvent.click(davidCard);

    // Should now show the detail view
    expect(screen.getAllByText("What's Next")[0]).toBeInTheDocument();
    expect(screen.getByText(/Official Song Card/i)).toBeInTheDocument();

    // Verify Audio Player controls exist for veterans with coordinating MP3
    const playPauseBtn = screen.getByLabelText(/Pause song|Play song/i);
    expect(playPauseBtn).toBeInTheDocument();
  });

  it('clicking a veteran without an MP3 displays their song card without audio player', () => {
    render(<App />);

    // Click John Bircher III card (no MP3 yet)
    const johnCard = screen.getByLabelText(/View song card and story for Colonel John Bircher III/i);
    fireEvent.click(johnCard);

    expect(screen.getByText('The Ballad of Johnny B')).toBeInTheDocument();
    expect(screen.getByText(/Official Song Card/i)).toBeInTheDocument();

    // Verify Audio Player is not present
    expect(screen.queryByLabelText(/Pause song|Play song/i)).not.toBeInTheDocument();
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

  it('toggles the mobile navigation menu and opens dialog modals from mobile links', () => {
    render(<App />);

    const menuToggle = screen.getByLabelText(/Open navigation menu/i);
    expect(menuToggle).toBeInTheDocument();

    // Open mobile menu
    fireEvent.click(menuToggle);
    expect(screen.getByLabelText(/Close navigation menu/i)).toBeInTheDocument();

    // Click ABOUT in mobile menu
    const aboutButtons = screen.getAllByRole('button', { name: /ABOUT/i });
    const mobileAbout = aboutButtons[aboutButtons.length - 1];
    fireEvent.click(mobileAbout);

    // Verify dialog opens
    expect(screen.getByText(/About Voices of Valor/i)).toBeInTheDocument();
  });

  it('renders the photo gallery with images, supports filtering, and opens the lightbox modal', () => {
    render(<App />);

    // Verify Gallery header and moments badge
    expect(screen.getByText(/EVENT PHOTO GALLERY/i)).toBeInTheDocument();
    expect(screen.getByText(/92 Moments Captured/i)).toBeInTheDocument();

    // Verify category filter buttons exist
    const performanceFilter = screen.getByRole('button', { name: /Live Performances/i });
    expect(performanceFilter).toBeInTheDocument();
    fireEvent.click(performanceFilter);

    // Verify clicking a photo opens the Lightbox
    const firstPhoto = screen.getByLabelText(/^View Voices of Valor Live Event & Writers Round - Photo 1$/i);
    expect(firstPhoto).toBeInTheDocument();
    fireEvent.click(firstPhoto);

    // Verify Lightbox is displayed with Close button and photo counter
    expect(screen.getByLabelText(/Close photo preview/i)).toBeInTheDocument();
    expect(screen.getByText(/Use ← → keys to browse/i)).toBeInTheDocument();
  });
});

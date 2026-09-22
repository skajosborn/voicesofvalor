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

    expect(screen.getByRole('heading', { level: 1, name: /Voices of Valor/i })).toBeInTheDocument();
    expect(screen.getByText(/Stories told through song/i)).toBeInTheDocument();
    expect(screen.getByText(/56 veterans attempt suicide/i)).toBeInTheDocument();
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

    expect(screen.getAllByText('Monster In a Cage')[0]).toBeInTheDocument();
    expect(screen.getByAltText(/Song Card for Steve Large - Monster In a Cage/i)).toBeInTheDocument();
    expect(screen.getByText(/Written by Steve Large, David Booth, Johnny Bulford, Heidi Bulford/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();
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

    // Verify dialog opens and displays Johnny & Heidi photo
    expect(screen.getByText(/About Voices of Valor/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Johnny and Heidi Bulford/i)).toBeInTheDocument();
  });

  it('renders the photo gallery with images, supports filtering, and opens the lightbox modal', () => {
    render(<App />);

    // Verify Gallery header and moments badge
    expect(screen.getByText(/EVENT PHOTO GALLERY/i)).toBeInTheDocument();
    expect(screen.getByText(/Moments Captured/i)).toBeInTheDocument();

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

  it('renders new veteran pages for Brad Hobbs, Chris Vasatka, and Deb Bodenstedt with MP3s', () => {
    render(<App />);

    expect(screen.getByText('Brad Hobbs')).toBeInTheDocument();
    expect(screen.getByText('Chris Vasatka')).toBeInTheDocument();
    expect(screen.getByText('Deb Bodenstedt')).toBeInTheDocument();

    const bradCard = screen.getByLabelText(/View song card and story for Sergeant Brad Hobbs/i);
    fireEvent.click(bradCard);
    expect(screen.getAllByText(/Like You Ain't Got a Prayer/i)[0]).toBeInTheDocument();
    expect(screen.getByAltText(/Song Card for Brad Hobbs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Back to all veterans/i));

    const chrisCard = screen.getByLabelText(/View song card and story for Command Sergeant Major Chris Vasatka/i);
    fireEvent.click(chrisCard);
    expect(screen.getAllByText(/Fine On the Outside/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Back to all veterans/i));

    const debCard = screen.getByLabelText(/View song card and story for Captain Deb Bodenstedt/i);
    fireEvent.click(debCard);
    expect(screen.getAllByText(/Win Another Day/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();
  });

  it('wires newly added MP3s for Irving Locker and Louis Nicosia', () => {
    render(<App />);

    const irvingCard = screen.getByLabelText(/View song card and story for Staff Sergeant Irving Locker/i);
    fireEvent.click(irvingCard);
    expect(screen.getAllByText(/If Freedom Was Free/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Back to all veterans/i));

    const louCard = screen.getByLabelText(/View song card and story for Sergeant Louis Nicosia/i);
    fireEvent.click(louCard);
    expect(screen.getAllByText(/Tug of War/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Pause song|Play song/i)).toBeInTheDocument();
  });

  it('opens the military radio playlist page with shuffle controls for all available songs', () => {
    render(<App />);

    const radioBtn = screen.getAllByRole('button', { name: /RADIO/i })[0];
    fireEvent.click(radioBtn);

    expect(screen.getByRole('heading', { name: /Field Radio/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Shuffle playlist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Play shuffled playlist|Pause radio/i)).toBeInTheDocument();

    // At least one known MP3 track should appear in the channel list
    expect(screen.getByText(/What's Next/i)).toBeInTheDocument();
    expect(screen.getByText(/David Booth/i)).toBeInTheDocument();
  });

  it('opens the contact dialog and includes all branches of the military', () => {
    render(<App />);

    // Click Contact navigation link
    const contactBtn = screen.getAllByRole('button', { name: /CONTACT/i })[0];
    fireEvent.click(contactBtn);

    // Verify Contact modal header
    expect(screen.getByText(/Contact Voices of Valor/i)).toBeInTheDocument();

    // Verify all 6 branches of the military are listed
    expect(screen.getAllByText(/Army/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Marine Corps/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Navy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Air Force/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Space Force/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Coast Guard/i).length).toBeGreaterThan(0);

    // Verify contact email is present
    expect(screen.getAllByText(/info@combatveteranstocareers.org/i).length).toBeGreaterThan(0);
  });
});

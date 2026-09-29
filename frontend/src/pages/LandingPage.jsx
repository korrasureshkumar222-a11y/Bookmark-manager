import { ArrowDownRight, ArrowUpRight, Bookmark, Folder, Link2, Search, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const savedLinks = [
  { name: 'The quiet art of noticing', domain: 'are.na', tint: 'plum', folder: 'Inspiration' },
  { name: 'A field guide to good type', domain: 'typewolf.com', tint: 'citrus', folder: 'Design notes' },
  { name: 'Small spaces, big ideas', domain: 'www.dezeen.com', tint: 'blue', folder: 'Reading list' },
];

function LandingPage() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <Link to="/" className="home-brand" aria-label="Bookmark home">
          <span className="home-brand-mark"><Bookmark size={17} fill="currentColor" /></span>
          <span>bookmark<span className="home-brand-light">/home</span></span>
        </Link>
        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#preview">The workspace</a>
          <a href="#details">Why bookmarks</a>
        </nav>
        <div className="home-nav-actions">
          <Link to="/login" className="home-login">Sign in</Link>
          <Link to="/register" className="home-nav-cta">Create account <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <main>
        <section className="home-artboard" id="preview" aria-labelledby="home-title">
          <div className="home-purple-field" aria-hidden="true" />
          <div className="home-grain" aria-hidden="true" />

          <div className="home-heading-block">
            <p className="home-kicker"><Sparkles size={13} /> Your internet, in its place</p>
            <h1 id="home-title">Bookmark Manager</h1>
            <p className="home-intro">A considered home for everything worth coming back to.</p>
            <div className="home-hero-actions">
              <Link to="/register" className="home-primary-cta">Make it yours <ArrowUpRight size={17} /></Link>
              <Link to="/login" className="home-secondary-cta">Sign in <ArrowDownRight size={16} /></Link>
            </div>
          </div>

          <div className="home-device-stage" aria-label="Preview of your bookmark library">
            <div className="home-callout home-callout-profile"><span /> Personal library</div>
            <div className="home-callout home-callout-folders"><span /> Collections</div>
            <div className="home-callout home-callout-search"><span /> Find it again</div>
            <div className="home-callout home-callout-share"><span /> Save from anywhere</div>

            <div className="home-device-shadow" aria-hidden="true" />
            <div className="home-device">
              <div className="home-device-bezel">
                <div className="home-device-screen">
                  <div className="device-status"><span>9:41</span><span>● ● ●</span></div>
                  <div className="device-topline">
                    <div className="device-avatar">M</div>
                    <div><span className="device-small-label">MONDAY, MAY 18</span><strong>Bookmark Manager</strong></div>
                    <button className="device-add" type="button" aria-label="Add a bookmark">+</button>
                  </div>
                  <div className="device-search"><Search size={13} /><span>Search bookmark</span><kbd>/</kbd></div>
                  <div className="device-section-title"><span>Recently saved</span><span>View all <ArrowUpRight size={10} /></span></div>
                  <div className="device-link-list">
                    {savedLinks.map((item) => (
                      <article className="device-link" key={item.name}>
                        <div className={`device-thumb thumb-${item.tint}`} aria-hidden="true"><span /></div>
                        <div className="device-link-copy"><strong>{item.name}</strong><span>{item.domain}</span></div>
                        <Star size={12} className="device-star" />
                      </article>
                    ))}
                  </div>
                  <div className="device-tabbar">
                    <span className="device-tab active"><Bookmark size={13} />Saved</span>
                    <span className="device-tab"><Folder size={13} />Folders</span>
                    <span className="device-tab"><Link2 size={13} />Shared</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-artboard-caption"><span>01 / YOUR PERSONAL LIBRARY</span><span>Save a little space for what matters.</span></div>
        </section>

        <section className="home-details" id="details" aria-label="Bookmark manager features">
          <p className="home-details-label">Less searching. More finding.</p>
          <div className="home-detail-item"><span className="detail-number">01</span><strong>Save in a second</strong><span>Keep useful links close, without breaking your flow.</span></div>
          <div className="home-detail-item"><span className="detail-number">02</span><strong>Give things a home</strong><span>Use folders and tags that make sense to you.</span></div>
          <div className="home-detail-item"><span className="detail-number">03</span><strong>Find them when it counts</strong><span>Search your personal library and get straight back to it.</span></div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;

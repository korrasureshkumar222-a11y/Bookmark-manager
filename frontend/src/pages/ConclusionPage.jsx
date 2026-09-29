import { ArrowLeft, CheckCircle2, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const points = [
  'Built a practical bookmark management workflow for saving and organizing links efficiently.',
  'Implemented secure authentication and protected routes to keep personal data private and reliable.',
  'Created a responsive UI that works smoothly across desktop and mobile screens.',
  'Used a modern MERN stack to structure the app for scalability and future feature expansion.',
];

function ConclusionPage() {
  return (
    <div className="min-h-screen px-4 py-6 text-[#1f1a18] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="auth-nav mb-8 flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8c63ff] via-[#5d45d7] to-[#4136b0] text-sm font-bold text-white shadow-[0_14px_30px_rgba(108,91,220,0.25)]">
              B
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-[#2a201b]">Bookmark</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#7b6fa5]">Summary</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/about" className="soft-button rounded-full px-4 py-2 text-sm font-medium border border-[#eadfce] bg-[#fffdfb] text-[#43372f]">
              About
            </Link>
            <Link to="/" className="primary-button rounded-full px-4 py-2 text-sm font-medium text-white">
              Home
            </Link>
          </div>
        </header>

        <main className="content-page rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center gap-3 text-[#6d5b5a]">
            <Sparkles size={16} className="text-[#7d67d8]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Project conclusion</p>
          </div>

          <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-[#221d1b] sm:text-5xl">
                A useful project with room to grow.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#5d4d46]">
                The Bookmark Manager project demonstrates a complete full-stack workflow: user authentication, protected dashboard access, folder-based organization, and a clean interface for storing valuable web resources. It combines practical functionality with a polished user experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/dashboard" className="primary-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white">
                  Open dashboard <Rocket size={16} />
                </Link>
                <Link to="/about" className="secondary-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border border-[#e8d8cb] bg-[#fffdfb] text-[#3c2d27]">
                  <ArrowLeft size={14} /> Back to about
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e6dff2] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_22px_60px_rgba(80,60,92,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4ebff] to-[#ddd0ff] text-[#3d2d74]">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#2b2227]">Final takeaways</h2>
              </div>

              <ul className="mt-6 space-y-4">
                {points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-[#564c55]">
                    <span className="mt-1 text-[#6d4fe0]">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-[#eadfe7] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_18px_40px_rgba(80,60,92,0.05)]">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-[#261f24]">Overall outcome</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d4d46]">
              This application proves that a simple idea can become a functional productivity tool when paired with thoughtful design, secure architecture, and a clear user flow. The project is ready as a portfolio-ready solution and can be extended with tagging, bookmarks sharing, collaboration, or AI-based categorization in the future.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ConclusionPage;

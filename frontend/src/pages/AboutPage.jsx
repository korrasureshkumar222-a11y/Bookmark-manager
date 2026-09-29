import { ArrowUpRight, BookOpen, FolderTree, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    icon: BookOpen,
    title: 'Purpose',
    text: 'Bookmark Manager is designed to help users organize personal research, favorite resources, and important references in one structured workspace.',
  },
  {
    icon: FolderTree,
    title: 'Organization',
    text: 'Users can sort bookmarks into folders, keep content easy to find, and maintain a cleaner digital workspace over time.',
  },
  {
    icon: Search,
    title: 'Searchability',
    text: 'A fast, searchable library reduces wasted time and makes recurring information easier to recover when needed.',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    text: 'Authentication, protected routes, and secure API patterns keep personal bookmarks and user data safer in the application flow.',
  },
];

const stack = ['React', 'Vite', 'Express.js', 'MongoDB', 'JWT', 'Mongoose'];

function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-6 text-[#1f1a18] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="auth-nav mb-8 flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8c63ff] via-[#5d45d7] to-[#4136b0] text-sm font-bold text-white shadow-[0_14px_30px_rgba(108,91,220,0.25)]">
              B
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-[#2a201b]">Bookmark</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#7b6fa5]">Project</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#5d4d46] md:flex">
            <Link to="/" className="transition hover:text-[#2d201b]">Home</Link>
            <Link to="/about" className="font-semibold text-[#2d201b]">About</Link>
            <Link to="/conclusion" className="transition hover:text-[#2d201b]">Conclusion</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="soft-button rounded-full px-4 py-2 text-sm font-medium border border-[#eadfce] bg-[#fffdfb] text-[#43372f]">
              Sign in
            </Link>
            <Link to="/register" className="primary-button rounded-full px-4 py-2 text-sm font-medium text-white">
              Join now
            </Link>
          </div>
        </header>

        <main className="content-page rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-[#e5d4f5] bg-[#f5effd] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6847c9]">
                About the project
              </p>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-[#231d1b] sm:text-5xl">
                A cleaner way to keep what matters online.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#5d4d46]">
                This project was built to solve a common problem: valuable links, articles, inspiration, and resources are scattered across tabs, browser history, and personal notes. Bookmark Manager gives users a dedicated place to save, structure, and revisit them with ease.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#e8dfe9] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_22px_60px_rgba(80,60,92,0.08)] backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['01', 'Personal library'],
                  ['02', 'Organized folders'],
                  ['03', 'Fast search'],
                  ['04', 'Private access'],
                ].map(([n, label]) => (
                  <div key={label} className="rounded-2xl border border-[#eee6f2] bg-[#faf8ff] p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d67d8]">{n}</div>
                    <div className="mt-2 text-lg font-semibold text-[#2f2932]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[1.6rem] border border-[#eadfef] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_18px_40px_rgba(55,40,60,0.06)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e4d8ff] to-[#ccf3ff] text-[#3f2d7a]">
                  <Icon size={18} />
                </div>
                <h2 className="text-lg font-bold text-[#271f25]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5d4d46]">{text}</p>
              </article>
            ))}
          </section>

          <section className="mt-12 rounded-[2rem] border border-[#e9dfe6] bg-[rgba(255,255,255,0.7)] p-6 shadow-[0_18px_40px_rgba(80,60,92,0.06)]">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-[#261f24]">Technology used</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-[#e7dced] bg-[#faf7ff] px-3 py-2 text-sm font-medium text-[#574b5d]">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/register" className="primary-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white">
              Start building your library <ArrowUpRight size={16} />
            </Link>
            <Link to="/conclusion" className="secondary-button rounded-full px-5 py-3 text-sm font-semibold border border-[#e8d8cb] bg-[#fffdfb] text-[#3c2d27]">
              Read the conclusion
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AboutPage;

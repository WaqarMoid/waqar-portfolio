import React, { useState, useEffect } from "react";
import { 
  useGetGoodreadsBooks, 
  useGetLetterboxdFilms,
  useGetSpotifyNowPlaying,
  useGetSpotifyRecent
} from "@workspace/api-client-react";
import { SiGithub, SiX, SiInstagram, SiGoodreads, SiLetterboxd, SiSpotify } from "react-icons/si";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode, children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Connect() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-24">
      <section>
        <header className="mb-12 border-b border-[#2a2f3d] pb-6">
          <h1 className="font-display text-5xl md:text-6xl text-[#c9a96e] font-bold uppercase tracking-widest mb-2">Connect</h1>
          <p className="text-[#9a9db0] italic font-serif">Find me on the internet.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SocialCard icon={SiGithub} label="GitHub" handle="@WaqarMoid" url="https://github.com/WaqarMoid" hoverColor="#6e8faf" />
          <SocialCard icon={LinkedInIcon} label="LinkedIn" handle="Waqar Moid" url="https://www.linkedin.com/in/waqar-moid-754a0427b/" hoverColor="#5a8ab0" />
          <SocialCard icon={SiX} label="Twitter/X" handle="@waqarandpeace" url="https://twitter.com/waqarandpeace" hoverColor="#8ab4cc" />
          <SocialCard icon={SiInstagram} label="Instagram" handle="@waqar_moid" url="https://www.instagram.com/waqar_moid/" hoverColor="#c9906e" />
          <SocialCard icon={SiGoodreads} label="Goodreads" handle="waqar-moid" url="https://www.goodreads.com/user/show/170611572-waqar-moid" hoverColor="#c9a96e" />
          <SocialCard icon={SiLetterboxd} label="Letterboxd" handle="fLdzD" url="https://boxd.it/fLdzD" hoverColor="#7da88c" />
          <SocialCard icon={SiSpotify} label="Spotify" handle="Spotify" url="https://open.spotify.com/user/waqarmoid" hoverColor="#5a9e72" />
        </div>
      </section>

      <section>
        <ErrorBoundary fallback={<WidgetError name="Goodreads" url="https://www.goodreads.com/user/show/170611572-waqar-moid" />}>
          <BookshelfWidget />
        </ErrorBoundary>
      </section>

      <section>
        <ErrorBoundary fallback={<WidgetError name="Letterboxd" url="https://boxd.it/fLdzD" />}>
          <LetterboxdWidget />
        </ErrorBoundary>
      </section>

      <section>
        <ErrorBoundary fallback={<WidgetError name="Spotify" url="https://open.spotify.com/user/waqarmoid" />}>
          <SpotifyWidget />
        </ErrorBoundary>
      </section>
    </div>
  );
}

function SocialCard({ icon: Icon, label, handle, url, hoverColor }: any) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-5 bg-[#181c24] border border-[#2a2f3d] rounded-lg transition-all duration-300 group"
      style={{ '--hover-color': hoverColor } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverColor;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#2a2f3d';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Icon className="text-2xl text-[#9a9db0] transition-colors duration-300" style={{ color: 'inherit' }} />
      <div>
        <h3 className="font-display font-bold uppercase tracking-wider text-[#e8e6e1] text-lg">{label}</h3>
        <p className="text-sm text-[#9a9db0] font-mono">{handle}</p>
      </div>
    </a>
  );
}

function WidgetError({ name, url }: { name: string, url: string }) {
  return (
    <div className="p-6 bg-[#181c24] border border-[#2a2f3d] rounded-lg text-center">
      <p className="text-[#9a9db0] mb-2">{name} widget temporarily unavailable.</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#c9a96e] hover:underline font-display tracking-widest uppercase text-sm">
        Visit my {name} profile →
      </a>
    </div>
  );
}

function BookshelfWidget() {
  const { data: reading } = useGetGoodreadsBooks({ shelf: 'currently-reading' });
  const { data: read } = useGetGoodreadsBooks({ shelf: 'read' });

  if (!reading && !read) {
    return <div className="animate-pulse h-32 bg-[#181c24] rounded border border-[#2a2f3d]" />;
  }

  return (
    <div>
      <h2 className="font-display text-xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Library</h2>
      
      {reading && reading.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display text-sm uppercase tracking-widest text-[#c9a96e] mb-4">Currently Reading</h3>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {reading.map((book, i) => (
              <a 
                key={i} 
                href={book.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 relative group transition-transform duration-300 hover:-translate-y-2"
                title={`${book.title} by ${book.author}`}
              >
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="h-[110px] w-[75px] object-cover rounded shadow-md border border-[#2a2f3d]" />
                ) : (
                  <div className="h-[110px] w-[75px] bg-[#232840] rounded border border-[#2a2f3d] flex items-center justify-center p-2 text-center">
                    <span className="text-[10px] text-[#e8e6e1] line-clamp-3">{book.title}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {read && read.length > 0 && (
        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-[#9a9db0] mb-4">Recently Read</h3>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {read.slice(0, 10).map((book, i) => (
              <a 
                key={i} 
                href={book.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 transition-transform duration-300 hover:-translate-y-1 opacity-80 hover:opacity-100"
                title={`${book.title} by ${book.author}`}
              >
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="h-[80px] w-[55px] object-cover rounded shadow-sm border border-[#2a2f3d]" />
                ) : (
                  <div className="h-[80px] w-[55px] bg-[#232840] rounded border border-[#2a2f3d] flex items-center justify-center p-1 text-center">
                    <span className="text-[8px] text-[#e8e6e1] line-clamp-2">{book.title}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LetterboxdWidget() {
  const { data: films } = useGetLetterboxdFilms();

  if (!films) {
    return <div className="animate-pulse h-32 bg-[#181c24] rounded border border-[#2a2f3d]" />;
  }

  return (
    <div>
      <h2 className="font-display text-xl uppercase tracking-widest text-[#7da88c] border-b border-[#2a2f3d] pb-2 mb-6">Recently Watched</h2>
      
      {films.length === 0 ? (
        <p className="text-[#9a9db0] italic">No recent films logged.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {films.map((film, i) => (
            <a 
              key={i} 
              href={film.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 relative group"
              title={`${film.title} ${film.year ? `(${film.year})` : ''} ${film.rating || ''}`}
            >
              {film.poster ? (
                <img src={film.poster} alt={film.title} className="h-[120px] w-[80px] object-cover rounded shadow-md border border-[#2a2f3d]" />
              ) : (
                <div className="h-[120px] w-[80px] bg-[#232840] rounded border border-[#2a2f3d] flex items-center justify-center p-2 text-center">
                  <span className="text-xs text-[#e8e6e1]">{film.title}</span>
                </div>
              )}
              {film.rating && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#111318] text-[#c9a96e] text-[10px] px-1.5 py-0.5 rounded border border-[#2a2f3d] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {film.rating}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function SpotifyWidget() {
  const { data: nowPlaying, refetch } = useGetSpotifyNowPlaying();
  const { data: recent } = useGetSpotifyRecent();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (!nowPlaying && !recent) {
    return <div className="animate-pulse h-32 bg-[#181c24] rounded border border-[#2a2f3d]" />;
  }

  return (
    <div>
      <h2 className="font-display text-xl uppercase tracking-widest text-[#5a9e72] border-b border-[#2a2f3d] pb-2 mb-6">Listening</h2>
      
      {nowPlaying?.isPlaying ? (
        <a 
          href={nowPlaying.link || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-[#181c24] border border-[#5a9e72]/30 rounded-lg mb-6 group hover:border-[#5a9e72] transition-colors max-w-md"
        >
          {nowPlaying.albumArt ? (
            <img src={nowPlaying.albumArt} alt={nowPlaying.album || "Album Art"} className="w-[60px] h-[60px] rounded object-cover" />
          ) : (
            <div className="w-[60px] h-[60px] rounded bg-[#232840] flex items-center justify-center">
              <SiSpotify size={24} className="text-[#5a9e72]" />
            </div>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-[#5a9e72] font-display">Now Playing</span>
              <div className="flex gap-[2px] h-3 items-end">
                <div className="w-[3px] bg-[#5a9e72] rounded-t animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '0s', height: '60%' }} />
                <div className="w-[3px] bg-[#5a9e72] rounded-t animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s', height: '100%' }} />
                <div className="w-[3px] bg-[#5a9e72] rounded-t animate-[bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.4s', height: '40%' }} />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold truncate text-[#e8e6e1] leading-none">{nowPlaying.title}</h3>
            <p className="text-sm text-[#9a9db0] truncate">{nowPlaying.artist}</p>
          </div>
        </a>
      ) : recent && recent.length > 0 ? (
        <div className="flex items-center gap-4 p-4 bg-[#181c24] border border-[#2a2f3d] rounded-lg mb-6 max-w-md opacity-80">
          {recent[0].albumArt ? (
            <img src={recent[0].albumArt} alt="Album Art" className="w-[50px] h-[50px] rounded object-cover grayscale" />
          ) : (
            <div className="w-[50px] h-[50px] rounded bg-[#232840] flex items-center justify-center">
              <SiSpotify size={20} className="text-[#9a9db0]" />
            </div>
          )}
          <div className="flex-grow min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-[#9a9db0] font-display block mb-1">Last Played</span>
            <h3 className="font-display text-lg font-bold truncate text-[#e8e6e1] leading-none">{recent[0].title}</h3>
            <p className="text-sm text-[#9a9db0] truncate">{recent[0].artist}</p>
          </div>
        </div>
      ) : null}

      {recent && recent.length > 1 && (
        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-[#9a9db0] mb-4">Recent Tracks</h3>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {recent.slice(isPlayingCheck(nowPlaying) ? 0 : 1, 6).map((track, i) => (
              <a 
                key={i} 
                href={track.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 transition-transform duration-300 hover:-translate-y-1 opacity-70 hover:opacity-100"
                title={`${track.title} by ${track.artist}`}
              >
                {track.albumArt ? (
                  <img src={track.albumArt} alt={track.title} className="h-[50px] w-[50px] object-cover rounded shadow-sm border border-[#2a2f3d]" />
                ) : (
                  <div className="h-[50px] w-[50px] bg-[#232840] rounded border border-[#2a2f3d] flex items-center justify-center">
                    <SiSpotify size={16} className="text-[#9a9db0]" />
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function isPlayingCheck(nowPlaying: any) {
  return nowPlaying?.isPlaying;
}
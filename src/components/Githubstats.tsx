import React, { useEffect, useState } from 'react';
import { Github, Star, GitFork, Users, BookMarked } from 'lucide-react';

interface GithubStatsProps {
  username: string;
  profileUrl: string;
}

interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
}

interface Summary {
  publicRepos: number;
  followers: number;
  stars: number;
  languages: { name: string; count: number }[];
  recent: Repo[];
}

const CACHE_KEY = 'portfolio-gh-cache-v1';
const CACHE_MS = 60 * 60 * 1000; // 1 hour, keeps us well under GitHub's unauthenticated rate limit

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function GithubStats({ username, profileUrl }: GithubStatsProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [graphFailed, setGraphFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}:${username}`);
      if (cached) {
        const parsed = JSON.parse(cached) as { at: number; data: Summary };
        if (Date.now() - parsed.at < CACHE_MS) {
          setSummary(parsed.data);
          setStatus('ready');
          return;
        }
      }
    } catch {
      /* ignore cache problems */
    }

    (async () => {
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
        ]);
        if (!userRes.ok || !repoRes.ok) throw new Error('GitHub request failed');
        const user = await userRes.json();
        const repos = (await repoRes.json()) as Repo[];

        const own = repos.filter((r) => !r.fork);
        const langCounts = new Map<string, number>();
        own.forEach((r) => r.language && langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1));

        const data: Summary = {
          publicRepos: user.public_repos ?? own.length,
          followers: user.followers ?? 0,
          stars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
          languages: Array.from(langCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
          recent: own.slice(0, 3),
        };

        if (cancelled) return;
        setSummary(data);
        setStatus('ready');
        try {
          sessionStorage.setItem(`${CACHE_KEY}:${username}`, JSON.stringify({ at: Date.now(), data }));
        } catch {
          /* ignore */
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const statTiles = summary
    ? [
        { icon: BookMarked, label: 'Public repos', value: summary.publicRepos },
        { icon: Star, label: 'Stars earned', value: summary.stars },
        { icon: Users, label: 'Followers', value: summary.followers },
      ]
    : [];

  return (
    <div className="space-y-8">
      {status === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-busy="true" aria-label="Loading GitHub stats">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800/90 p-6 text-sm text-dark/70 dark:text-slate-300">
          GitHub stats could not be loaded right now (the API may be rate-limited). You can still{' '}
          <a href={profileUrl} target="_blank" rel="noreferrer" className="text-primary font-semibold underline">
            view my profile on GitHub
          </a>
          .
        </div>
      )}

      {status === 'ready' && summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statTiles.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 p-5 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-black text-dark dark:text-white">{value}</div>
                  <div className="text-xs text-dark/60 dark:text-slate-400">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-dark dark:text-white">Recently updated</h3>
              {summary.recent.length === 0 && (
                <p className="text-sm text-dark/60 dark:text-slate-400">No public repositories yet.</p>
              )}
              {summary.recent.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 p-5 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-dark dark:text-white flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-primary" aria-hidden="true" />
                      {repo.name}
                    </span>
                    <span className="text-[11px] text-dark/50 dark:text-slate-400">
                      Updated {formatDate(repo.pushed_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dark/70 dark:text-slate-300">
                    {repo.description ?? 'No description yet.'}
                  </p>
                  {repo.language && (
                    <span className="inline-block mt-3 text-[11px] px-2 py-0.5 rounded-full bg-primary/5 dark:bg-primary/20 text-primary">
                      {repo.language}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-dark dark:text-white">Top languages</h3>
              <ul className="rounded-2xl bg-white dark:bg-slate-800/90 border border-black/5 dark:border-white/10 p-5 space-y-3 shadow-sm">
                {summary.languages.length === 0 && (
                  <li className="text-sm text-dark/60 dark:text-slate-400">Not enough data yet.</li>
                )}
                {summary.languages.map((lang) => {
                  const max = summary.languages[0].count;
                  return (
                    <li key={lang.name}>
                      <div className="flex justify-between text-xs text-dark/70 dark:text-slate-300 mb-1">
                        <span>{lang.name}</span>
                        <span>
                          {lang.count} {lang.count === 1 ? 'repo' : 'repos'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(lang.count / max) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {!graphFailed && (
            <div className="rounded-2xl bg-white border border-black/5 dark:border-white/10 p-4 overflow-x-auto">
              <img
                src={`https://ghchart.rshah.org/6C63FF/${username}`}
                alt={`${username}'s GitHub contribution graph`}
                loading="lazy"
                onError={() => setGraphFailed(true)}
                className="min-w-[640px] w-full"
              />
            </div>
          )}

          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            See everything on GitHub
          </a>
        </>
      )}
    </div>
  );
}
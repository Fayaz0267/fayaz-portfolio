import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export interface PaletteCommand {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}

export default function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`cmd-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  const runAt = (index: number) => {
    const cmd = results[index];
    if (!cmd) return;
    onClose();
    setTimeout(cmd.run, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(active);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-black/10 dark:border-white/10">
          <Search className="w-4 h-4 text-dark/50 dark:text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search sections..."
            aria-label="Search commands"
            aria-controls="cmd-listbox"
            className="flex-1 py-4 bg-transparent outline-none text-sm text-dark dark:text-white placeholder:text-slate-400"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-black/15 dark:border-white/15 text-dark/50 dark:text-slate-400">
            Esc
          </kbd>
        </div>

        <ul id="cmd-listbox" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-center text-dark/60 dark:text-slate-400">
              No commands match "{query}". Try "resume", "theme", or a section name.
            </li>
          )}
          {results.map((cmd, i) => (
            <li
              key={cmd.id}
              id={`cmd-option-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => runAt(i)}
              className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg cursor-pointer text-sm ${
                i === active
                  ? 'bg-primary/10 dark:bg-primary/20 text-dark dark:text-white'
                  : 'text-dark/80 dark:text-slate-300'
              }`}
            >
              <span>{cmd.label}</span>
              <span className="text-[11px] text-dark/40 dark:text-slate-500">{cmd.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';

export interface TerminalData {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
  projects: { title: string; summary: string; url?: string }[];
  sections: { id: string; label: string }[];
}

interface TerminalModalProps {
  open: boolean;
  onClose: () => void;
  data: TerminalData;
  onNavigate: (id: string) => void;
  onToggleTheme: () => void;
}

interface Line {
  kind: 'in' | 'out';
  text: string;
}

const BANNER: Line[] = [
  { kind: 'out', text: 'Welcome. Type "help" to see what you can ask me.' },
];

export default function TerminalModal({ open, onClose, data, onNavigate, onToggleTheme }: TerminalModalProps) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines, open]);

  if (!open) return null;

  const out = (text: string): Line[] => text.split('\n').map((t) => ({ kind: 'out', text: t }));

  const run = (raw: string) => {
    const cmd = raw.trim();
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ').toLowerCase();
    let response: Line[] = [];

    switch (name.toLowerCase()) {
      case '':
        break;
      case 'help':
        response = out(
          [
            'Commands:',
            '  about      who I am',
            '  skills     what I work with',
            '  projects   things I have built',
            '  contact    how to reach me',
            '  goto <id>  jump to a section (e.g. goto work)',
            '  sections   list section ids',
            '  theme      switch light/dark',
            '  clear      clear the screen',
            '  exit       close the terminal',
          ].join('\n')
        );
        break;
      case 'about':
        response = out(`${data.name}\n${data.role}\nBased in ${data.location}.`);
        break;
      case 'skills':
        response = out(data.skills.join(', '));
        break;
      case 'projects':
        response = out(
          data.projects.map((p) => `${p.title}: ${p.summary}${p.url ? `\n  ${p.url}` : ''}`).join('\n\n')
        );
        break;
      case 'contact':
        response = out(`Email:    ${data.email}\nGitHub:   ${data.github}\nLinkedIn: ${data.linkedin}`);
        break;
      case 'sections':
        response = out(data.sections.map((s) => `${s.id}  (${s.label})`).join('\n'));
        break;
      case 'goto': {
        const target = data.sections.find((s) => s.id === arg || s.label.toLowerCase() === arg);
        if (target) {
          response = out(`Going to ${target.label}...`);
          setLines((prev) => [...prev, { kind: 'in', text: cmd }, ...response]);
          setInput('');
          onClose();
          setTimeout(() => onNavigate(target.id), 50);
          return;
        }
        response = out(`No section called "${arg}". Type "sections" to see the list.`);
        break;
      }
      case 'theme':
        onToggleTheme();
        response = out('Theme switched.');
        break;
      case 'clear':
        setLines([]);
        setInput('');
        return;
      case 'exit':
      case 'quit':
        setInput('');
        onClose();
        return;
      default:
        response = out(`Unknown command "${name}". Type "help" for the list.`);
    }

    setLines((prev) => [...prev, { kind: 'in', text: cmd }, ...response]);
    setInput('');
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden bg-[#0d1117] text-slate-200 border border-white/10 shadow-2xl font-mono text-sm"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="w-3 h-3 rounded-full bg-red-400 cursor-pointer"
          />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400">fayaz@portfolio: ~</span>
        </div>

        <div
          className="h-[50vh] overflow-y-auto p-4 space-y-1"
          onClick={() => inputRef.current?.focus()}
          role="log"
          aria-live="polite"
        >
          {lines.map((l, i) => (
            <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === 'in' ? 'text-emerald-300' : ''}`}>
              {l.kind === 'in' ? `$ ${l.text}` : l.text}
            </div>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
            className="flex items-center gap-2"
          >
            <span className="text-emerald-300" aria-hidden="true">
              $
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Terminal command"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent outline-none text-slate-100"
            />
          </form>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
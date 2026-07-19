/**
 * Level 0 — Terminal Emulator
 *
 * Mirrors a WSL/Ubuntu CLI environment with a robust command parser.
 * Handles: pwd | whoami | top | ls | help | clear | sudo rm -rf / | cd 01_The_Spark
 *
 * Transition flow:
 *   `cd 01_The_Spark` → confirmation prompt → Y → CRT flicker + collapse → Level 1
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { usePortfolioStore, type Level } from '../../../store/usePortfolioStore';
import './Level0_Terminal.css';

// ─── Types ──────────────────────────────────────────────────────────────────

type LineVariant =
  | 'system'
  | 'error'
  | 'success'
  | 'info'
  | 'dim'
  | 'prompt'
  | 'echo'
  | 'hint';

interface TerminalLine {
  id: number;
  text: string;
  variant: LineVariant;
  command?: string;
}

type TerminalMode =
  | 'INPUT'      // normal command entry
  | 'TOP'        // live `top` simulation
  | 'MATRIX'     // sudo rm -rf / easter egg
  | 'CONFIRM_CD' // awaiting Y/n for cd <dir> transition
  | 'CRT_EXIT';  // CRT animation before level switch

// ─── Constants ──────────────────────────────────────────────────────────────

const PROMPT = 'hmaru@harsh-portfolio:~$ ';
const BOOT_DELAY_MS = 60; // ms between boot lines appearing

// Characters used in the matrix rain
const MATRIX_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|\\/?!';

// Boot welcome text shown once when the terminal mounts
const BOOT_LINES: Array<{ text: string; variant: LineVariant; command?: string }> = [
  { text: '──────────────────────────────────────────────────────', variant: 'dim' },
  { text: '  hmaru@harsh-portfolio — Ubuntu 22.04 LTS on WSL2', variant: 'dim' },
  { text: '──────────────────────────────────────────────────────', variant: 'dim' },
  { text: '', variant: 'system' },
  { text: "  Type 'help' for available commands.", variant: 'hint', command: 'help' },
  { text: "  Type 'ls' to explore the timeline.", variant: 'hint', command: 'ls' },
  { text: "  Type 'cd 01_The_Spark' to start.", variant: 'hint', command: 'cd 01_The_Spark' },
  { text: "  Type 'cd 04_The_Build' to view projects.", variant: 'hint', command: 'cd 04_The_Build' },
  { text: '', variant: 'system' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

let lineIdCounter = 0;
const mkLine = (text: string, variant: LineVariant = 'system', command?: string): TerminalLine => ({
  id: lineIdCounter++,
  text,
  variant,
  command,
});

/** Generate a snapshot of a simulated `top` output */
function generateTopSnapshot(): string {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 8);
  const upMins = Math.floor(Math.random() * 40) + 10;
  const cpuUser = (Math.random() * 15 + 2).toFixed(1);
  const cpuSys  = (Math.random() * 5  + 0.5).toFixed(1);
  const cpuIdle = (100 - parseFloat(cpuUser) - parseFloat(cpuSys)).toFixed(1);
  const memTotal = 16384;
  const memUsed  = Math.floor(Math.random() * 4000 + 3000);
  const memFree  = memTotal - memUsed;

  return [
    `top - ${timeStr} up ${upMins} min,  1 user,  load average: 0.${Math.floor(Math.random()*9)}, 0.0${Math.floor(Math.random()*9)}, 0.0${Math.floor(Math.random()*9)}`,
    `Tasks:  84 total,   1 running,  83 sleeping,   0 stopped,   0 zombie`,
    `%Cpu(s):  ${cpuUser} us,  ${cpuSys} sy,  0.0 ni, ${cpuIdle} id,  0.0 wa,  0.0 hi,  0.5 si`,
    `MiB Mem : ${memTotal.toFixed(1)} total,  ${memFree.toFixed(1)} free,  ${memUsed.toFixed(1)} used,   941.3 buff/cache`,
    `MiB Swap:  2048.0 total,  2048.0 free,     0.0 used.  ${(memFree * 0.8).toFixed(1)} avail Mem`,
    ``,
    `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND`,
    `  412 hmaru     20   0  978732  89012  42100 S   ${(Math.random()*3).toFixed(1)}   0.5   0:12.34 node`,
    `  891 hmaru     20   0  412288  34000  18900 R   ${(Math.random()*2).toFixed(1)}   0.2   0:03.11 npm`,
    ` 1024 hmaru     20   0  226688  12044   9600 S   0.0   0.1   0:00.44 bash`,
    `    1 root      20   0   98124   9800   6400 S   0.0   0.1   0:00.82 init`,
    ``,
    `[Press q to exit top]`,
  ].join('\n');
}

// ─── Matrix Rain Column ───────────────────────────────────────────────────────

interface MatrixColumnProps {
  x: number;       // CSS left %
  delay: number;   // animation-delay in ms
  duration: number;// animation-duration in ms
  chars: string;
  color: string;
}

const MatrixColumn: React.FC<MatrixColumnProps> = ({ x, delay, duration, chars, color }) => (
  <div
    className="l0__matrix-col"
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: 0,
      color,
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
    }}
  >
    {chars.split('').map((ch, i) => (
      <span key={i}>{ch}</span>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Level0_Terminal: React.FC = () => {
  const setLevel = usePortfolioStore((s) => s.setLevel);

  // ── State ──────────────────────────────────────────────────────────────────
  const [lines, setLines]           = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode]             = useState<TerminalMode>('INPUT');
  const [topContent, setTopContent] = useState('');
  const [matrixCols, setMatrixCols] = useState<MatrixColumnProps[]>([]);
  const [crtPhase, setCrtPhase]     = useState<'FLICKER' | 'COLLAPSE' | 'IDLE'>('IDLE');
  const [confirmInput, setConfirmInput] = useState('');
  const [pendingLevel, setPendingLevel] = useState<Level>(1);
  const [showAutoHint, setShowAutoHint] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const outputRef      = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const confirmRef     = useRef<HTMLInputElement>(null);
  const topIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matrixTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crtTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);

  // ── Auto-scroll to bottom ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, topContent]);

  // ── Boot sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      // 1. Boot Glitch
      setLines([mkLine('BIOS CRC Checksum Error... Recovering...', 'error')]);
      await new Promise<void>((res) => setTimeout(res, 1500));
      if (cancelled) return;
      setLines([]); // clear error

      // 2. Normal Boot
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return;
        await new Promise<void>((res) => setTimeout(res, BOOT_DELAY_MS));
        setLines((prev) => [...prev, mkLine(BOOT_LINES[i].text, BOOT_LINES[i].variant, BOOT_LINES[i].command)]);
      }
    };
    boot();
    return () => { cancelled = true; };
  }, []);

  // ── Focus management ──────────────────────────────────────────────────────
  useEffect(() => {
    if (mode === 'INPUT')      inputRef.current?.focus();
    if (mode === 'CONFIRM_CD') confirmRef.current?.focus();
  }, [mode]);

  // ── Append lines helper ───────────────────────────────────────────────────
  const appendLines = useCallback((newLines: Array<{ text: string; variant: LineVariant; command?: string }>) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l) => mkLine(l.text, l.variant, l.command)),
    ]);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // COMMAND PARSER
  // ─────────────────────────────────────────────────────────────────────────
  const executeCommand = useCallback((raw: string) => {
    const cmd = raw.trim();

    // Echo the prompt + typed command into history
    appendLines([{ text: `${PROMPT}${cmd}`, variant: 'prompt' }]);

    if (!cmd) return; // blank enter — just show prompt

    // ── pwd ──────────────────────────────────────────────────────────────
    if (cmd === 'pwd') {
      appendLines([{ text: '/home/hmaru/portfolio', variant: 'system' }]);
      return;
    }

    // ── whoami ───────────────────────────────────────────────────────────
    if (cmd === 'whoami') {
      appendLines([{ text: 'Harsh Maru - Architecting Intelligence & Design', variant: 'success' }]);
      return;
    }

    // ── ls ───────────────────────────────────────────────────────────────
    if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls -l') {
      appendLines([
        { text: '', variant: 'system' },
        { text: '01_The_Spark  02_The_Origin  03_The_Catalyst  04_The_Build  05_Contact', variant: 'info' },
        { text: '', variant: 'system' },
      ]);
      return;
    }

    // ── help ─────────────────────────────────────────────────────────────
    if (cmd === 'help') {
      appendLines([
        { text: '', variant: 'system' },
        { text: 'Available commands:', variant: 'dim' },
        { text: '  pwd          Print working directory', variant: 'system' },
        { text: '  whoami       Display current user info', variant: 'system' },
        { text: '  ls           List timeline directories', variant: 'system' },
        { text: '  cd <dir>     Navigate into a timeline directory', variant: 'system' },
        { text: '  top          Display live system resource usage', variant: 'system' },
        { text: '  clear        Clear terminal output', variant: 'system' },
        { text: '  rm           Remove files (use with caution)', variant: 'system' },
        { text: '', variant: 'system' },
        { text: "  Hint: try 'cd 01_The_Spark' or 'cd 02_The_Origin' to begin.", variant: 'dim' },
        { text: '', variant: 'system' },
      ]);
      return;
    }

    // ── clear ────────────────────────────────────────────────────────────
    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    // ── top ──────────────────────────────────────────────────────────────
    if (cmd === 'top') {
      setMode('TOP');
      setTopContent(generateTopSnapshot());

      // Refresh every 1.5s for a live feel; exit on 'q' key (handled in keydown)
      topIntervalRef.current = setInterval(() => {
        setTopContent(generateTopSnapshot());
      }, 1500);
      return;
    }

    // ── sudo rm -rf / ────────────────────────────────────────────────────
    if (cmd === 'sudo rm -rf /' || cmd === 'sudo rm -rf /*') {
      appendLines([
        { text: '[sudo] password for hmaru: ', variant: 'dim' },
        { text: 'rm: it is dangerous to operate recursively on \'/'  , variant: 'error' },
        { text: 'rm: use --no-preserve-root to override this failsafe', variant: 'error' },
        { text: '', variant: 'system' },
        { text: '...overriding failsafe. EXECUTING.', variant: 'error' },
        { text: '', variant: 'system' },
      ]);

      // Build matrix columns
      const cols: MatrixColumnProps[] = [];
      const count = Math.floor(window.innerWidth / 14);
      const redChars  = 'RM-RF/0X!@#$DELETE%ERROR&CORRUPT*';
      for (let i = 0; i < count; i++) {
        const length = Math.floor(Math.random() * 20) + 10;
        const charSet = Math.random() > 0.35 ? MATRIX_CHARS : redChars;
        let str = '';
        for (let j = 0; j < length; j++) {
          str += charSet[Math.floor(Math.random() * charSet.length)];
        }
        const isRed = Math.random() > 0.6;
        cols.push({
          x: (i / count) * 100,
          delay: Math.random() * 1000,
          duration: Math.random() * 1500 + 700,
          chars: str,
          color: isRed ? '#CC0000' : '#00CC00',
        });
      }
      setMatrixCols(cols);
      setMode('MATRIX');

      matrixTimerRef.current = setTimeout(() => {
        setMode('INPUT');
        setMatrixCols([]);
        appendLines([
          { text: '', variant: 'system' },
          { text: 'System integrity restored. All operations rolled back.', variant: 'success' },
          { text: "  (Nice try. This portfolio runs on pure willpower.)", variant: 'dim' },
          { text: '', variant: 'system' },
        ]);
        setTimeout(() => inputRef.current?.focus(), 50);
      }, 3000);
      return;
    }

    // ── cd handlers (transition triggers) ───────────────────────────────────
    if (cmd === 'cd 01_The_Spark' || cmd === 'cd 01_the_spark') {
      appendLines([
        { text: '', variant: 'system' },
        { text: 'INITIATING TUI PROTOCOL.', variant: 'success' },
      ]);
      setPendingLevel(1);
      setMode('CONFIRM_CD');
      setTimeout(() => confirmRef.current?.focus(), 30);
      return;
    }

    if (cmd === 'cd 02_The_Origin' || cmd === 'cd 02_the_origin') {
      appendLines([
        { text: '', variant: 'system' },
        { text: 'LOADING RETRO OS ENVIRONMENT...', variant: 'success' },
      ]);
      setPendingLevel(2);
      setMode('CONFIRM_CD');
      setTimeout(() => confirmRef.current?.focus(), 30);
      return;
    }

    if (cmd === 'cd 03_The_Catalyst' || cmd === 'cd 03_the_catalyst') {
      appendLines([
        { text: '', variant: 'system' },
        { text: 'LOADING WIN XP ENVIRONMENT...', variant: 'success' },
      ]);
      setPendingLevel(3);
      setMode('CONFIRM_CD');
      setTimeout(() => confirmRef.current?.focus(), 30);
      return;
    }

    if (cmd === 'cd 04_The_Build' || cmd === 'cd 04_the_build') {
      appendLines([
        { text: '', variant: 'system' },
        { text: 'LOADING MODERN SPATIAL WEB...', variant: 'success' },
      ]);
      setPendingLevel(4);
      setMode('CONFIRM_CD');
      setTimeout(() => confirmRef.current?.focus(), 30);
      return;
    }

    if (cmd === 'cd 05_Contact' || cmd === 'cd 05_contact') {
      appendLines([
        { text: `bash: cd: 05_Contact: Level locked. Complete prior levels first.`, variant: 'error' },
      ]);
      return;
    }

    // ── cd <other dir> ────────────────────────────────────────────────────
    if (cmd.startsWith('cd ')) {
      const dir = cmd.slice(3).trim();
      appendLines([
        { text: `bash: cd: ${dir}: No such file or directory`, variant: 'error' },
        { text: "  Use 'ls' to see available directories.", variant: 'dim' },
      ]);
      return;
    }

    // ── rm (without the full rm -rf / path) ──────────────────────────────
    if (cmd.startsWith('rm')) {
      appendLines([
        { text: 'rm: missing operand', variant: 'error' },
        { text: "  Try 'sudo rm -rf /' if you're feeling adventurous.", variant: 'dim' },
      ]);
      return;
    }

    // ── Unknown command ───────────────────────────────────────────────────
    appendLines([
      { text: `bash: ${cmd.split(' ')[0]}: command not found`, variant: 'error' },
      { text: "  Type 'help' for available commands.", variant: 'hint', command: 'help' },
    ]);
  }, [appendLines]);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-HINT LOGIC (5 seconds of inactivity)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'INPUT') {
      setShowAutoHint(false);
      return;
    }
    
    setShowAutoHint(false);
    if (autoHintTimerRef.current) clearTimeout(autoHintTimerRef.current);
    
    autoHintTimerRef.current = setTimeout(() => {
      setShowAutoHint(true);
    }, 5000);
    
  }, [mode, lines, inputValue, confirmInput]); // reset timer on activity

  // ─────────────────────────────────────────────────────────────────────────
  // CLICKABLE HINT HANDLER
  // ─────────────────────────────────────────────────────────────────────────
  const handleHintClick = useCallback((command: string) => {
    setInputValue(command);
    setTimeout(() => {
      executeCommand(command);
      setInputValue('');
    }, 300);
  }, [executeCommand]);

  // ─────────────────────────────────────────────────────────────────────────
  // CRT TRANSITION SEQUENCE
  // Flicker (0.6s) → Collapse (0.5s) → setLevel(1)
  // ─────────────────────────────────────────────────────────────────────────
  const triggerCrtTransition = useCallback((targetLevel = pendingLevel) => {
    setMode('CRT_EXIT');
    setCrtPhase('FLICKER');

    crtTimerRef.current = setTimeout(() => {
      setCrtPhase('COLLAPSE');

      crtTimerRef.current = setTimeout(() => {
        setLevel(targetLevel);
      }, 500);
    }, 600);
  }, [setLevel, pendingLevel]);

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIRM CD HANDLER (Y/n prompt after cd 01_The_Spark)
  // ─────────────────────────────────────────────────────────────────────────
  const handleConfirmKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const val = confirmInput.trim().toLowerCase();

        // Abort on 'n', 'N', or blank
        if (val === 'n' || val === 'no') {
          setMode('INPUT');
          setConfirmInput('');
          appendLines([
            { text: 'n', variant: 'system' },
            { text: 'Aborted.', variant: 'dim' },
            { text: '', variant: 'system' },
          ]);
          return;
        }

        // Proceed on 'y', 'Y', or blank Enter (default yes)
        if (val === 'y' || val === 'yes' || val === '') {
          setConfirmInput('');
          appendLines([{ text: 'Y', variant: 'success' }]);
          triggerCrtTransition();
        }
      }
    },
    [confirmInput, appendLines, triggerCrtTransition]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // INPUT KEY HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  // ── Document-level top exit (fires even when input is disabled/unfocused) ──
  useEffect(() => {
    if (mode !== 'TOP') return;
    const onTopKey = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        if (topIntervalRef.current) clearInterval(topIntervalRef.current);
        setMode('INPUT');
        setTopContent('');
        appendLines([{ text: '', variant: 'system' }]);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
    };
    document.addEventListener('keydown', onTopKey);
    return () => document.removeEventListener('keydown', onTopKey);
  }, [mode, appendLines]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const val = inputValue;
        setInputValue('');
        executeCommand(val);
      }
      // Prevent Tab from shifting focus out of the terminal
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    },
    [inputValue, executeCommand]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // CLICK-TO-FOCUS — clicking anywhere in terminal re-focuses the input
  // ─────────────────────────────────────────────────────────────────────────
  const handleWrapperClick = useCallback(() => {
    if (mode === 'INPUT')      inputRef.current?.focus();
    if (mode === 'CONFIRM_CD') confirmRef.current?.focus();
  }, [mode]);

  // ─────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (topIntervalRef.current)  clearInterval(topIntervalRef.current);
      if (matrixTimerRef.current)  clearTimeout(matrixTimerRef.current);
      if (crtTimerRef.current)     clearTimeout(crtTimerRef.current);
      if (autoHintTimerRef.current) clearTimeout(autoHintTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // CRT CLASS LOGIC
  // ─────────────────────────────────────────────────────────────────────────
  const crtClass =
    crtPhase === 'FLICKER'  ? 'anim-crt-flicker'  :
    crtPhase === 'COLLAPSE' ? 'anim-crt-collapse'  :
    '';

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={`l0 level-wrapper l0--crt-exit ${crtClass}`}
      onClick={handleWrapperClick}
      role="application"
      aria-label="Terminal emulator — Level 0"
    >
      {/* ── Matrix Rain Easter Egg ─────────────────────────────────────── */}
      {mode === 'MATRIX' && (
        <div className="l0__matrix-overlay" aria-hidden="true">
          {matrixCols.map((col, i) => (
            <MatrixColumn key={i} {...col} />
          ))}
        </div>
      )}

      {/* ── Output History ─────────────────────────────────────────────── */}
      <div ref={outputRef} className="l0__output" aria-live="polite" aria-label="Terminal output">
        {lines.map((line) => {
          if (line.variant === 'hint' && line.command) {
            return (
              <span
                key={line.id}
                className={`l0__line l0__line--${line.variant} l0__clickable`}
                onClick={() => handleHintClick(line.command!)}
              >
                {line.text}
                {'\n'}
              </span>
            );
          }
          return (
            <span
              key={line.id}
              className={`l0__line l0__line--${line.variant}`}
            >
              {line.text || '\u00A0'}
              {'\n'}
            </span>
          );
        })}

        {/* ── `top` live block ─────────────────────────────────────────── */}
        {mode === 'TOP' && (
          <pre className="l0__top-block">{topContent}</pre>
        )}
      </div>

      {/* ── Input Row (normal mode) ────────────────────────────────────── */}
      {(mode === 'INPUT' || mode === 'TOP' || mode === 'CRT_EXIT') && (
        <div className="l0__input-row">
          <span className="l0__prompt-label" aria-hidden="true">
            {PROMPT}
          </span>
          <span className="l0__echo" aria-hidden="true">
            {inputValue}
          </span>
          <span className="l0__caret" aria-hidden="true" />
          <input
            ref={inputRef}
            id="terminal-input"
            className="l0__hidden-input"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal command input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={mode === 'CRT_EXIT'}
          />
        </div>
      )}

      {/* ── Auto Progression Hint ───────────────────────────────────────── */}
      {showAutoHint && mode === 'INPUT' && (
        <div className="l0__auto-hint anim-pulse">
          👆 Click a command above to get started
        </div>
      )}

      {/* ── Confirm Row (cd 01_The_Spark → Y/n prompt) ────────────────── */}
      {mode === 'CONFIRM_CD' && (
        <div className="l0__confirm-row">
          <span className="l0__confirm-label" aria-hidden="true">
            EXECUTE? [Y/n]:&nbsp;
          </span>
          <span className="l0__echo" style={{ color: '#FFFF55' }} aria-hidden="true">
            {confirmInput}
          </span>
          <span className="l0__caret" style={{ background: '#FFFF55' }} aria-hidden="true" />
          <input
            ref={confirmRef}
            id="terminal-confirm-input"
            className="l0__hidden-input"
            type="text"
            maxLength={3}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Confirm protocol execution"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            onKeyDown={handleConfirmKeyDown}
          />
        </div>
      )}
    </div>
  );
};

export default Level0_Terminal;

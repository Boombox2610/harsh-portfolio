import React, { useState, useRef, useEffect } from 'react';
import './WindowDropdown.css';

interface WindowDropdownProps {
  label: string;
  className?: string;
  onCloseWindow?: () => void;
  onMaximizeWindow?: () => void;
}

const WindowDropdown: React.FC<WindowDropdownProps> = ({ label, className = '', onCloseWindow, onMaximizeWindow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    if (action === 'close' && onCloseWindow) onCloseWindow();
    if (action === 'maximize' && onMaximizeWindow) onMaximizeWindow();
    if (action === 'about') alert(`Window: About\nPart of Harsh Maru's Portfolio`);
  };

  return (
    <div className={`window-dropdown-container ${className}`} ref={containerRef}>
      <button 
        className={`window-dropdown-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>

      {isOpen && (
        <div className="window-dropdown-menu">
          {label === 'File' && (
            <div className="window-dropdown-item" onClick={() => handleAction('close')}>Close</div>
          )}
          {label === 'Edit' && (
            <div className="window-dropdown-item disabled">Nothing to edit here 😉</div>
          )}
          {label === 'View' && (
            <>
              <div className="window-dropdown-item" onClick={() => handleAction('maximize')}>Maximize / Restore</div>
            </>
          )}
          {label === 'Help' && (
            <div className="window-dropdown-item" onClick={() => handleAction('about')}>About</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WindowDropdown;

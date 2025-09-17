// components/ui/TerminalWindow.tsx
import React, { useState, useRef, useEffect } from 'react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  statusLine?: string;
  isActive?: boolean;
  isCollapsible?: boolean;
  onClose?: () => void;
  fullScreen?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title,
  children,
  className = '',
  statusLine,
  isActive = true,
  isCollapsible = false,
  onClose,
  fullScreen = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current && isActive) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, title]);

  const generateBorder = (length: number) => '─'.repeat(Math.max(0, length));
  const titleLength = title.length;
  const borderLength = Math.max(50, titleLength + 10);

  return (
    <div className={`terminal-window ${isActive ? 'active' : 'inactive'} ${fullScreen ? 'fullscreen' : ''} ${className}`}>
      {/* Terminal Header */}
      <div className="terminal-header">
        <div
          ref={titleRef}
          className={`terminal-title-bar ${isTyping ? 'terminal-typing' : ''}`}
        >
          ┌─[{title.toUpperCase()}]{generateBorder(borderLength - titleLength - 4)}┐
        </div>

        {statusLine && (
          <div className="terminal-status">
            │ STATUS: {statusLine.toUpperCase()}
            {' '.repeat(Math.max(0, borderLength - statusLine.length - 10))} │
          </div>
        )}

        {/* Control Buttons */}
        <div className="terminal-controls">
          │
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="terminal-control-button"
              aria-label={isCollapsed ? 'Expand window' : 'Collapse window'}
            >
              [{isCollapsed ? '+' : '-'}]
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="terminal-control-button terminal-control-close"
              aria-label="Close window"
            >
              [X]
            </button>
          )}

          {' '.repeat(Math.max(0, borderLength - 15))} │
        </div>

        <div className="terminal-separator">
          ├{generateBorder(borderLength)}┤
        </div>
      </div>

      {/* Terminal Content */}
      {!isCollapsed && (
        <div className="terminal-content">
          {children}
        </div>
      )}

      {/* Terminal Footer */}
      {!isCollapsed && (
        <div className="terminal-footer">
          └{generateBorder(borderLength)}┘
        </div>
      )}
    </div>
  );
};

interface TerminalTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'dim' | 'bright';
  className?: string;
  glow?: boolean;
  typing?: boolean;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  variant = 'primary',
  className = '',
  glow = false,
  typing = false
}) => {
  const classes = [
    'terminal-text',
    variant,
    glow && 'terminal-glow-pulse',
    typing && 'terminal-typing',
    className
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

interface TerminalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const TerminalButton: React.FC<TerminalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const classes = [
    'terminal-button',
    variant,
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'password';
  className?: string;
  disabled?: boolean;
  promptPrefix?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  promptPrefix = '>'
}) => {
  return (
    <div className={`terminal-input-wrapper ${className}`}>
      <span className="terminal-prompt">{promptPrefix} </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="terminal-input"
      />
    </div>
  );
};

interface TerminalSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

export const TerminalSelect: React.FC<TerminalSelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  disabled = false
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`terminal-select ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface TerminalProgressProps {
  value: number;
  max?: number;
  label?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showText?: boolean;
  ascii?: boolean;
  className?: string;
}

export const TerminalProgress: React.FC<TerminalProgressProps> = ({
  value,
  max = 100,
  label,
  variant = 'primary',
  showText = true,
  ascii = false,
  className = ''
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  if (ascii) {
    const barLength = 20;
    const filled = Math.floor((percentage / 100) * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    return (
      <div className={`terminal-ascii-progress ${className}`}>
        {label && <div className="terminal-text">{label}:</div>}
        <div className="terminal-text">
          [{bar}] {percentage.toFixed(1)}%
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-progress ${variant} ${className}`}>
      {label && (
        <div className="terminal-text mb-1">{label}</div>
      )}
      <div className="terminal-progress-container">
        <div
          className={`terminal-progress-bar ${variant}`}
          style={{ width: `${percentage}%` }}
        />
        {showText && (
          <div className="terminal-progress-text">
            {percentage.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

interface TerminalTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
  zebra?: boolean;
}

export const TerminalTable: React.FC<TerminalTableProps> = ({
  headers,
  rows,
  className = '',
  zebra = false
}) => {
  return (
    <table className={`terminal-table ${zebra ? 'zebra' : ''} ${className}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface TerminalListProps {
  items: (string | { label: string; value?: string; onClick?: () => void })[];
  className?: string;
  selectable?: boolean;
  selectedIndex?: number;
  onItemClick?: (index: number) => void;
}

export const TerminalList: React.FC<TerminalListProps> = ({
  items,
  className = '',
  selectable = false,
  selectedIndex,
  onItemClick
}) => {
  return (
    <ul className={`terminal-list ${className}`}>
      {items.map((item, index) => {
        const isString = typeof item === 'string';
        const label = isString ? item : item.label;
        const value = isString ? undefined : item.value;
        const onClick = isString ? undefined : item.onClick;
        const isSelected = selectedIndex === index;

        return (
          <li
            key={index}
            className={`terminal-list-item ${selectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => {
              if (onClick) onClick();
              if (onItemClick) onItemClick(index);
            }}
          >
            <span className="terminal-list-label">{label}</span>
            {value && <span className="terminal-list-value">{value}</span>}
          </li>
        );
      })}
    </ul>
  );
};

// ASCII Art Generator Helper
export const generateASCIIBorder = (width: number = 50, title?: string) => {
  if (title) {
    const titleLength = title.length + 4; // Add brackets and spaces
    const remainingWidth = Math.max(0, width - titleLength);
    const leftPadding = Math.floor(remainingWidth / 2);
    const rightPadding = remainingWidth - leftPadding;

    return {
      top: `┌${'─'.repeat(leftPadding)}[ ${title.toUpperCase()} ]${'─'.repeat(rightPadding)}┐`,
      middle: `├${'─'.repeat(width)}┤`,
      bottom: `└${'─'.repeat(width)}┘`,
      side: '│'
    };
  }

  return {
    top: `┌${'─'.repeat(width)}┐`,
    middle: `├${'─'.repeat(width)}┤`,
    bottom: `└${'─'.repeat(width)}┘`,
    side: '│'
  };
};

// Terminal Screen Boot Sequence Component
interface TerminalBootProps {
  onComplete?: () => void;
  messages?: string[];
}

export const TerminalBoot: React.FC<TerminalBootProps> = ({
  onComplete,
  messages = [
    'STELLAR LEGACY COMMAND INTERFACE',
    'INITIALIZING SHIP SYSTEMS...',
    'LOADING NAVIGATION PROTOCOLS...',
    'ESTABLISHING COMMUNICATION LINKS...',
    'SYSTEM READY'
  ]
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentMessage < messages.length) {
      const timer = setTimeout(() => {
        setCurrentMessage(currentMessage + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    }
  }, [currentMessage, messages.length, isComplete, onComplete]);

  return (
    <div className="terminal-boot">
      <div className="terminal-boot-content">
        {messages.slice(0, currentMessage + 1).map((message, index) => (
          <div
            key={index}
            className={`terminal-text ${index === currentMessage ? 'terminal-typing' : ''}`}
          >
            {message}
          </div>
        ))}

        {isComplete && (
          <div className="terminal-text success terminal-glow-pulse">
            ▶ SYSTEM OPERATIONAL
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import './Folder.css';
import { playFolderOpen, playFolderClose, playClick, playHover } from '../utils/sound';

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  onPaperClick?: (index: number) => void;
}

export const Folder: React.FC<FolderProps> = ({
  color = '#5227FF',
  size = 1,
  items = [],
  className = '',
  onPaperClick,
}) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<Array<{ x: number; y: number }>>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.12);
  const paper1 = darkenColor('#ffffff', 0.08);
  const paper2 = darkenColor('#ffffff', 0.04);
  const paper3 = '#ffffff';

  const handleClick = () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      playFolderOpen();
    } else {
      playFolderClose();
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperClick = (e: React.MouseEvent, index: number) => {
    if (!open) {
      // If folder is closed, clicking any part of the paper should open the folder
      return;
    }
    e.stopPropagation();
    playClick();
    if (onPaperClick) {
      onPaperClick(index);
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.12;
    const offsetY = (e.clientY - centerY) * 0.12;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3,
  } as React.CSSProperties;

  const folderClassName = `folder ${open ? 'open' : ''}`.trim();
  const scaleStyle = { transform: `scale(${size})`, transformOrigin: 'center bottom' };

  return (
    <div style={scaleStyle} className={`inline-block ${className}`}>
      <div
        className={folderClassName}
        style={folderStyle}
        onClick={handleClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? 'Close folder' : 'Open folder'}
      >
        <div className="folder__back">
          {papers.map((item, i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
              onClick={e => handlePaperClick(e, i)}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseEnter={() => { if (open) playHover(); }}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              style={
                open
                  ? ({
                      transform: `translate(${
                        i === 0
                          ? `calc(-105% + ${paperOffsets[i]?.x || 0}px)`
                          : i === 1
                          ? `calc(5% + ${paperOffsets[i]?.x || 0}px)`
                          : `calc(-50% + ${paperOffsets[i]?.x || 0}px)`
                      }, ${
                        i === 0
                          ? `calc(-70% + ${paperOffsets[i]?.y || 0}px)`
                          : i === 1
                          ? `calc(-70% + ${paperOffsets[i]?.y || 0}px)`
                          : `calc(-105% + ${paperOffsets[i]?.y || 0}px)`
                      }) rotateZ(${i === 0 ? '-12deg' : i === 1 ? '12deg' : '2deg'})`,
                    } as React.CSSProperties)
                  : {}
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front"></div>
          <div className="folder__front right"></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;

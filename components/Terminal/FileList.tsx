'use client';

import React from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'dir';
  extension?: string;
  description?: string;
  onClick?: () => void;
}

interface FileListProps {
  files: FileItem[];
  showNumbers?: boolean;
  className?: string;
}

export default function FileList({
  files,
  showNumbers = true,
  className = ''
}: FileListProps) {
  const getIcon = (type: string, extension?: string) => {
    if (type === 'dir') return '\u276f';
    switch (extension) {
      case 'md': return '\u2731';
      case 'js':
      case 'ts':
      case 'tsx': return '\u276f';
      case 'py': return '\u2731';
      case 'json': return '{}';
      case 'log': return '\u2261';
      default: return '\u2731';
    }
  };

  const getColor = (extension?: string) => {
    switch (extension) {
      case 'md': return 'text-tokyo-blue';
      case 'js':
      case 'ts':
      case 'tsx': return 'text-tokyo-yellow';
      case 'py': return 'text-tokyo-green';
      case 'json': return 'text-tokyo-purple';
      case 'log': return 'text-term-text-dim';
      default: return 'text-term-text';
    }
  };

  return (
    <div className={`file-list space-y-1 ${className}`}>
      {files.map((file, index) => (
        <button
          key={file.id}
          onClick={file.onClick}
          className="file-list-item w-full text-left flex items-center group hover:bg-term-surface px-2 py-1 rounded transition-all duration-150"
        >
          {showNumbers && (
            <span className="file-list-number text-term-text-dim mr-3 font-mono">
              [{String(index + 1).padStart(2, '0')}]
            </span>
          )}
          <span className={`file-list-icon mr-2 ${getColor(file.extension)}`}>
            {getIcon(file.type, file.extension)}
          </span>
          <span className={`flex-1 font-mono text-sm md:text-base ${getColor(file.extension)} group-hover:text-tokyo-orange transition-colors`}>
            {file.name}
            {file.extension && `.${file.extension}`}
          </span>
          {file.description && (
            <span className="text-term-text-dim ml-4 text-xs md:text-sm hidden sm:block">
              {file.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
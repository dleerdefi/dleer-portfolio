'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  command: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', command: 'cd ~' },
  { label: 'About', href: '/#about', command: './about' },
  { label: 'Projects', href: '/#projects', command: 'ls projects' },
  { label: 'Contact', href: '/#contact', command: './contact' },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 touch-target md:hidden"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 w-full bg-term-text transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-term-text transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-term-text transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={toggleMenu}
        ></div>

        {/* Menu panel */}
        <div className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-term-bg border-l border-term-border transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 pt-20">
            <div className="mb-6">
              <p className="text-tokyo-green text-sm mb-2">user@archlinux:~$</p>
              <p className="text-term-text-dim text-sm">help</p>
            </div>

            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className="block group"
                >
                  <div className="flex items-center space-x-3 p-3 rounded hover:bg-term-surface transition-colors">
                    <span className="text-tokyo-blue">$</span>
                    <span className="text-term-text group-hover:text-tokyo-orange transition-colors font-mono">
                      {item.command}
                    </span>
                  </div>
                  <div className="text-term-text-dim text-xs pl-9 mt-1">
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-term-border">
              <p className="text-term-text-dim text-xs font-mono">
                Terminal Portfolio v1.0.0
              </p>
              <p className="text-term-text-dim text-xs font-mono mt-1">
                \u00a9 2024 David Leer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex fixed top-4 right-4 z-30 space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-term-text hover:text-tokyo-orange transition-colors font-mono text-sm"
          >
            {item.command}
          </Link>
        ))}
      </nav>
    </>
  );
}
export function ASCIIHeader() {
  return (
    <pre className="text-terminal-fg text-center select-none" aria-label="David Leer ASCII Art">
{`╔════════════════════════════════════════════════════════════╗
║  ██████╗  █████╗ ██╗   ██╗██╗██████╗     ██╗     ███████╗███████╗██████╗  ║
║  ██╔══██╗██╔══██╗██║   ██║██║██╔══██╗    ██║     ██╔════╝██╔════╝██╔══██╗ ║
║  ██║  ██║███████║██║   ██║██║██║  ██║    ██║     █████╗  █████╗  ██████╔╝ ║
║  ██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║    ██║     ██╔══╝  ██╔══╝  ██╔══██╗ ║
║  ██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝    ███████╗███████╗███████╗██║  ██║ ║
║  ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝     ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝ ║
╚════════════════════════════════════════════════════════════╝`}
    </pre>
  );
}

export function ASCIIDivider() {
  return (
    <div className="text-terminal-dim select-none" aria-hidden="true">
      {'═'.repeat(80)}
    </div>
  );
}

export function ASCIIBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="text-terminal-fg">
      <div className="text-terminal-dim">
        {title ? `┌─ ${title} ${'─'.repeat(Math.max(0, 76 - title.length))}┐` : '┌' + '─'.repeat(78) + '┐'}
      </div>
      <div className="px-2ch py-ch">
        {children}
      </div>
      <div className="text-terminal-dim">
        {'└' + '─'.repeat(78) + '┘'}
      </div>
    </div>
  );
}

export function ASCIIPrompt({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-ch">
      <span className="text-terminal-accent">$</span>
      <span className="text-terminal-fg">{command}</span>
      <span className="cursor"></span>
    </div>
  );
}
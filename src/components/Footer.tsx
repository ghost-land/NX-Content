import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
            <a
              href="https://ghostland.at/dmca/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              DMCA Policy
            </a>
            <span className="text-white/30">•</span>
            <a
              href="https://ghostland.at/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-white/30">•</span>
            <a
              href="https://ghostland.at/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              Discover our other projects
            </a>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <span>v{import.meta.env.PACKAGE_VERSION}</span>
            <span className="text-white/30">•</span>
            <a
              href="https://github.com/ghost-land/NX-Content"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/90 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
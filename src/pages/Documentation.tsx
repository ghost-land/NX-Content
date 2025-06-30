import { Link } from 'react-router-dom';
import { Home, Database, Search, Info, Github, ExternalLink, BookOpen, Users, Shield, Download, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';

/**
 * Documentation page provides comprehensive information about the NX Content Database
 * Includes project overview, usage guide, API documentation, and technical details
 * Serves as a reference for users and developers
 */
export function Documentation() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              NX Documentation
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Complete guide to understand and use the Nintendo Switch content database
            </p>
          </div>
          <div className="flex justify-center pt-6">
            <Link 
              to="/" 
              className="btn-orange glass flex items-center gap-3 px-8 py-4 rounded-xl transition-all hover:bg-orange-500/20 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold text-lg">Back to Home</span>
            </Link>
          </div>
        </header>

        {/* Table of Contents */}
        <div className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Table of Contents
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#overview" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">1</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Project Overview</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#features" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">2</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Main Features</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#usage" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">3</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Usage Guide</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#routes" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">4</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Routes & Navigation</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#search" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">5</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Search & Filters</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#technical" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">6</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">Technical Details</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#api" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">7</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">API & Development</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
            <a href="#faq" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">8</span>
              </div>
              <span className="text-white/90 group-hover:text-white font-medium">FAQ</span>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 ml-auto transition-colors" />
            </a>
          </nav>
        </div>

        {/* Project Overview */}
        <section id="overview" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-6 flex items-center gap-3">
            <Info className="w-8 h-8" />
            Project Overview
          </h2>
          <div className="space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg">
              The <strong className="text-white">NX Content Database</strong> is a comprehensive reference database that catalogs and documents 
              Nintendo Switch content that has been preserved and is available online.
            </p>
            <p className="text-lg">
              This project serves as a reference tool to help track available content and contribute 
              to the digital preservation of gaming heritage.
            </p>
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mt-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-orange-300 font-semibold text-lg mb-2">Important Notice</h3>
                  <p className="text-orange-200/90">
                    This database does not distribute any content. It serves only as a reference for the preservation community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <Database className="w-8 h-8" />
            Main Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Complete Database</h3>
                </div>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Base games with complete metadata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Updates and DLCs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Size and version information</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Unique title identifiers (TID)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Advanced Search</h3>
                </div>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Search by game name</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Search by TID identifier</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Filter by type (games/updates/DLC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Sort by name, size or date</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Modern Interface</h3>
                </div>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Responsive and accessible design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Banner and grid modes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Intuitive navigation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Optimized image loading</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Up-to-date Data</h3>
                </div>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Automatic synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Real-time new entries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Recent additions history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Live statistics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section id="usage" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Usage Guide
          </h2>
          <div className="space-y-8">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Main Navigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">Home Page</h4>
                  <p className="text-sm text-white/70">Overview with statistics and recent games</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">Database</h4>
                  <p className="text-sm text-white/70">Complete list with search and filters</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">Game Details</h4>
                  <p className="text-sm text-white/70">Detailed information and metadata</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Searching for a Game</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ol className="space-y-4 text-white/80">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-400 font-bold text-sm">1</span>
                      </div>
                      <span>Go to the "Database" page</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-400 font-bold text-sm">2</span>
                      </div>
                      <span>Use the search bar by name or TID</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-400 font-bold text-sm">3</span>
                      </div>
                      <span>Apply filters to refine results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-400 font-bold text-sm">4</span>
                      </div>
                      <span>Click on a game to see its details</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Special Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm text-white/80"><strong>Random Game:</strong> Discover games randomly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm text-white/80"><strong>Display Mode:</strong> Switch between views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm text-white/80"><strong>Pagination:</strong> Navigate through results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Routes and Navigation */}
        <section id="routes" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Routes & Navigation
          </h2>
          <div className="space-y-8">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Route Structure</h3>
              <p className="text-white/80 leading-relaxed">
                The application uses a URL parameter-based navigation system for better performance 
                and smooth navigation between different views.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">Main Routes</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-lg">🏠</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Home Page</h4>
                        <code className="text-xs bg-black/40 px-2 py-1 rounded text-orange-100 border border-orange-500/20">/ or /?</code>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Overview with statistics, recent games, updates and DLCs. Main entry point of the application.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Database</h4>
                        <code className="text-xs bg-black/40 px-2 py-1 rounded text-orange-100 border border-orange-500/20">/?view=content</code>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Complete list of all games with search, filters and pagination. Main interface to explore content.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-lg">🎮</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Game Details</h4>
                        <code className="text-xs bg-black/40 px-2 py-1 rounded text-orange-100 border border-orange-500/20">/?game=TID</code>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Detailed page of a specific game with all its metadata, images and technical information.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Documentation</h4>
                        <code className="text-xs bg-black/40 px-2 py-1 rounded text-orange-100 border border-orange-500/20">/?view=docs</code>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Complete usage guide, technical information and FAQ. This page you are currently viewing.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <span className="text-lg">🎲</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Random Game</h4>
                        <code className="text-xs bg-black/40 px-2 py-1 rounded text-orange-100 border border-orange-500/20">/?random=random</code>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Automatically redirects to a randomly chosen base game. Useful for discovering content randomly.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-4">URL Parameters</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-orange-200 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500/30"></div>
                      Search Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">search</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">Game name</span>
                        </div>
                        <p className="text-xs text-white/70">Search for games by their complete or partial name</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">tid</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">TID identifier</span>
                        </div>
                        <p className="text-xs text-white/70">Search for games by their unique title identifier</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-200 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500/30"></div>
                      Filter Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">type</span>
                          <div className="flex gap-1">
                            {['all', 'base', 'update', 'dlc'].map((type) => (
                              <span key={type} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/70">Filter content by type (base games, updates, DLCs, or all)</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">sort</span>
                          <div className="flex gap-1">
                            {['name', 'size', 'date'].map((sort) => (
                              <span key={sort} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                                {sort}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/70">Sort results by name, file size, or date</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">order</span>
                          <div className="flex gap-1">
                            {['asc', 'desc'].map((order) => (
                              <span key={order} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                                {order}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/70">Sort order: ascending or descending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">URL Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-lg p-4 border border-orange-500/30">
                  <h4 className="font-medium text-orange-200 mb-2">Search for Mario games</h4>
                  <code className="text-xs bg-black/40 px-3 py-2 rounded text-orange-100 block border border-orange-500/20">/?view=content&search=mario&type=base</code>
                </div>
                <div className="bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-lg p-4 border border-orange-500/30">
                  <h4 className="font-medium text-orange-200 mb-2">All DLCs sorted by size</h4>
                  <code className="text-xs bg-black/40 px-3 py-2 rounded text-orange-100 block border border-orange-500/20">/?view=content&type=dlc&sort=size</code>
                </div>
                <div className="bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-lg p-4 border border-orange-500/30">
                  <h4 className="font-medium text-orange-200 mb-2">Specific game details</h4>
                  <code className="text-xs bg-black/40 px-3 py-2 rounded text-orange-100 block border border-orange-500/20">/?game=0100000000001000</code>
                </div>
                <div className="bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-lg p-4 border border-orange-500/30">
                  <h4 className="font-medium text-orange-200 mb-2">Random game</h4>
                  <code className="text-xs bg-black/40 px-3 py-2 rounded text-orange-100 block border border-orange-500/20">/?random=random</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section id="search" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <Search className="w-8 h-8" />
            Search & Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Search Types</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/[0.02]">
                  <h4 className="font-medium text-white mb-2">Search by Name</h4>
                  <p className="text-sm text-white/70">
                    Type the complete or partial name of a game. Search is case-insensitive.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02]">
                  <h4 className="font-medium text-white mb-2">Search by TID</h4>
                  <p className="text-sm text-white/70">
                    Enter the title identifier (ex: 0100000000001000) for precise results.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Available Filters</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-white/[0.02]">
                  <h4 className="font-medium text-white mb-2">Content Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Base Games', 'Updates', 'DLCs'].map((type) => (
                      <span key={type} className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02]">
                  <h4 className="font-medium text-white mb-2">Sort Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {['By Name (A-Z)', 'By Size', 'By Date'].map((sort) => (
                      <span key={sort} className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">
                        {sort}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02]">
                  <h4 className="font-medium text-white mb-2">Order</h4>
                  <div className="flex flex-wrap gap-2">
                    {['↑ Ascending', '↓ Descending'].map((order) => (
                      <span key={order} className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">
                        {order}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section id="technical" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Technical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Frontend</h4>
                  <div className="space-y-2">
                    {['React 18 + TypeScript', 'Vite for building', 'Tailwind CSS', 'Lucide React (icons)'].map((tech) => (
                      <div key={tech} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Features</h4>
                  <div className="space-y-2">
                    {['React Router for navigation', 'Lazy loading of images', 'Multiple image fallbacks', 'Responsive design'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Data Sources</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Data comes from public sources of the preservation community 
                  and is regularly updated to ensure accuracy of information.
                </p>
                <p>
                  Images (banners and icons) are retrieved from multiple sources 
                  with automatic fallbacks in case of unavailability.
                </p>
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Image Sources</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>Primary: api.nlib.cc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span>Fallback: tinfoil.media</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>Local: Game metadata</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API and Development */}
        <section id="api" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <Github className="w-8 h-8" />
            API & Development
          </h2>
          <div className="space-y-8">
            <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Contribution</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  This project is open source and contributions are welcome! 
                  You can contribute in several ways:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Report bugs or suggest improvements',
                    'Contribute to source code',
                    'Improve documentation',
                    'Add new features'
                  ].map((contribution) => (
                    <div key={contribution} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span className="text-sm">{contribution}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="https://github.com/ghost-land/NX-Content" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/[0.03] rounded-xl p-6 border border-white/5 hover:bg-white/[0.08] transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Github className="w-6 h-6 text-orange-400" />
                  <span className="font-semibold text-white">GitHub Repository</span>
                  <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <p className="text-sm text-white/70">
                  Access source code and issues
                </p>
              </a>
              <a 
                href="https://nx-missing.ghostland.at" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/[0.03] rounded-xl p-6 border border-white/5 hover:bg-white/[0.08] transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Search className="w-6 h-6 text-orange-400" />
                  <span className="font-semibold text-white">NX Missing</span>
                  <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <p className="text-sm text-white/70">
                  Discover missing content
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="card-glass p-8 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Does this database distribute content?",
                a: "No, this database does not distribute any content. It serves only as a reference to document what is available in the preservation community."
              },
              {
                q: "How often is the data updated?",
                a: "Data is automatically synchronized and updated in real-time when new content is added to reference sources."
              },
              {
                q: "How can I report an error or missing content?",
                a: "You can open an issue on the GitHub repository or use the NX Missing platform to report missing content."
              },
              {
                q: "Does the application work on mobile?",
                a: "Yes, the interface is fully responsive and optimized for all devices, from smartphones to desktop screens."
              },
              {
                q: "Can I use this data in my own project?",
                a: "Yes, the project is open source. Check the license on GitHub for more details on usage conditions."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-orange-400 font-bold text-sm">Q</span>
                  </div>
                  {item.q}
                </h3>
                <p className="text-white/80 leading-relaxed flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 font-bold text-sm">A</span>
                  </div>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
} 
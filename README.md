# NX Content Database

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/Version-4.1.3-blue)](https://github.com/ghost-land/NX-Content/releases)
[![GitHub issues](https://img.shields.io/github/issues/ghost-land/NX-Content)](https://github.com/ghost-land/NX-Content/issues)
[![GitHub stars](https://img.shields.io/github/stars/ghost-land/NX-Content)](https://github.com/ghost-land/NX-Content/stargazers)

A modern web application for tracking Nintendo Switch content preservation status, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎮 Track base games, updates, and DLC content
- 📊 Real-time statistics and content overview
- 🔄 Recent content updates tracking
- 🔍 Advanced search and filtering capabilities
- 📱 Fully responsive design
- 🖼️ Dynamic game banners and screenshots
- 🎲 Random game discovery
   - Use `/?random=random` URL parameter to view a random game
- 📋 Detailed game information including:
  - Publisher details
  - Release dates
  - Game descriptions
  - Available updates
  - DLC content
- 📊 Content statistics including:
  - Total base games
  - Available updates
  - DLC content
  - Total preserved data size

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router
- **Image Handling**: Embla Carousel

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### URL Parameters

The application supports various URL parameters for navigation and filtering:

- `/?random=random` - Display a random game from the database
- `/?game=<tid>` - Display details for a specific game by Title ID
- `/?view=content` - Access the content browser view

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and types
├── pages/         # Main application pages
└── styles/        # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

## Acknowledgments

- Game data and icons provided by [nlib.cc](https://nlib.cc)
- Additional data from [ghostland.at](https://ghostland.at)

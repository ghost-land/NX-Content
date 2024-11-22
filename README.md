# NX Content Tracker

A modern web application for tracking Nintendo Switch content, built with React and TypeScript.

https://github.com/user-attachments/assets/896af358-a0b1-4199-8da2-2d5dd26edd76

## Features

- 🎮 Track base games, updates, and DLC content
- 🔍 Advanced search with configurable precision
- 🌓 Dark/Light theme support
- 📱 Fully responsive design
- 📊 Detailed content information
- 🖼️ Interactive screenshot gallery with advanced features:
  - Zoom and rotation controls
  - Slideshow mode
  - Fullscreen support
  - Keyboard shortcuts
  - Touch gestures
  - Image download
- 📈 Download statistics integration
- 🔄 Auto-refresh capabilities
- ⚙️ Customizable display settings

## Development

This project uses:
- Vite for blazing fast development
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Lucide for icons

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

## Configuration

The application supports various configuration options through the settings panel:

- Search precision for names and Title IDs
- Items per page
- Content display limits
- Auto-refresh intervals
- Custom data source URLs

## Gallery Controls

The screenshot gallery supports various controls:
- **Keyboard**:
  - Arrow keys: Navigate between images
  - R: Rotate image
  - +/-: Zoom in/out
  - F: Toggle fullscreen
  - Space: Toggle slideshow
  - ESC: Close gallery
- **Mouse**:
  - Click and drag to pan
  - Mouse wheel to zoom
  - Click outside to close
- **Touch**:
  - Swipe to navigate
  - Pinch to zoom
  - Double tap to toggle zoom

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data provided by [nlib.cc](https://nlib.cc)
- Icons by [Lucide](https://lucide.dev)
- Stats by [ghostland.at](https://stats.ghostland.at)

# Stellar Legacy

A modern spacefaring empire builder game built with React, TypeScript, and cutting-edge web technologies. Command your starship, manage resources, explore the galaxy, and build your interstellar legacy.

![Stellar Legacy](https://img.shields.io/badge/Stellar-Legacy-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=flat&logo=tailwind-css)

## 🌟 Features

### 🚀 Core Gameplay
- **Resource Management**: Balance credits, energy, minerals, food, and influence
- **Crew Management**: Recruit, train, and manage your crew members
- **Ship Building**: Customize your starship with various components and upgrades
- **Galaxy Exploration**: Discover new star systems and establish colonies
- **Market Trading**: Buy and sell resources with dynamic pricing
- **Legacy System**: Build your family's reputation across generations

### 🎮 Game Systems
- **Dynamic Economy**: Market prices fluctuate based on supply and demand
- **Crew Morale**: Keep your crew happy to maintain efficiency
- **Technology Tree**: Unlock new ship components and abilities
- **Reputation System**: Build alliances and rivalries with galactic factions
- **Save/Load System**: Persistent game state with local storage

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Space-themed dark mode with custom color palette
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized with Vite and modern React patterns

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Custom Design System** - Space-themed color palette

### State Management
- **Zustand** - Lightweight state management
- **Local Storage** - Game save persistence

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **TypeScript** - Type checking

## 📁 Project Structure

```
stellar_legacy/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── game/           # Game-specific components
│   │   │   │   ├── dashboard/  # Dashboard panels
│   │   │   │   ├── shipbuilder/# Ship building interface
│   │   │   │   ├── crew/       # Crew management
│   │   │   │   ├── galaxymap/  # Galaxy exploration
│   │   │   │   ├── market/     # Trading interface
│   │   │   │   └── legacy/     # Legacy management
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/            # Reusable UI components
│   │   ├── stores/            # Zustand state stores
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   ├── styles/            # CSS and styling
│   │   ├── constants/         # Game constants
│   │   ├── api/               # API utilities
│   │   └── test/              # Test utilities
│   ├── public/                # Static assets
│   └── package.json           # Dependencies and scripts
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kalaith/stellar_legacy.git
   cd stellar_legacy
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to play the game!

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
npm run test:ui      # Run tests with UI
```

### CI/CD
```bash
npm run ci           # Full CI pipeline
npm run ci:quick     # Quick CI checks
```

## 🎯 How to Play

### Basic Controls
- **Navigation**: Use the tab bar to switch between different game sections
- **Actions**: Click buttons to perform actions like exploring, trading, or recruiting
- **Resources**: Monitor your resource levels in the header
- **Crew**: Manage crew morale and skills in the Crew Quarters

### Game Objectives
1. **Build Your Empire**: Start with basic resources and expand your influence
2. **Explore the Galaxy**: Discover new star systems and establish colonies
3. **Upgrade Your Ship**: Purchase better components to improve performance
4. **Manage Your Crew**: Keep your crew happy and skilled
5. **Trade Wisely**: Buy low, sell high in the galactic market
6. **Build Your Legacy**: Pass down your empire to future generations

### Tips for Success
- **Balance Resources**: Don't neglect any resource type
- **Crew Morale**: Happy crew = efficient operations
- **Market Timing**: Watch price trends before trading
- **Exploration**: New systems bring new opportunities
- **Legacy Planning**: Choose heirs wisely for succession

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#32b6c5) - Used for active states and accents
- **Background**: Dark slate (#1f2121) - Space-themed dark mode
- **Surface**: Slate (#262828) - Card and panel backgrounds
- **Text**: Light gray (#f5f5f5) - Primary text color
- **Success**: Green (#22c55e) - Positive indicators
- **Warning**: Orange (#f59e0b) - Warning states
- **Error**: Red (#ef4444) - Error states

### Typography
- **Font Family**: FK Grotesk Neue (primary), Berkeley Mono (code)
- **Scale**: Responsive typography with consistent ratios
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting is enforced
- **Tests**: Write tests for new features
- **Documentation**: Update README for significant changes

### Commit Convention
We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the blazing fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Zustand** - For simple and powerful state management
- **Framer Motion** - For smooth animations

## 📞 Support

If you have questions or need help:
- **Issues**: [GitHub Issues](https://github.com/Kalaith/stellar_legacy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kalaith/stellar_legacy/discussions)
- **Documentation**: Check the `/docs` folder for detailed guides

---

**Happy exploring! 🚀✨**

*Built with ❤️ for spacefaring adventurers everywhere*

## License

This project is licensed under the MIT License - see the individual component README files for details.

Part of the WebHatchery game collection.</content>
<parameter name="filePath">h:\WebHatchery\game_apps\stellar_legacy\README.md
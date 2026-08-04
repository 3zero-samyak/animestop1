# AnimeStop

**Built by anime fans. For anime fans.**

A premium, cinematic anime discovery platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Cinematic Design**: Dark, atmospheric interface with subtle anime-inspired aesthetics
- **Fully Responsive**: Optimized for all screen sizes from mobile to desktop
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Reusable UI components for rapid development
- **Accessible**: WCAG-compliant with keyboard navigation and semantic HTML
- **Production Ready**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif) + Dancing Script (display)

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd animestop
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
animestop/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── layout.tsx        # Root layout with fonts
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles & CSS variables
│   ├── components/
│   │   ├── home/            # Homepage-specific components
│   │   ├── layout/          # Header, Footer
│   │   ├── shared/          # Shared components
│   │   └── ui/              # Reusable UI components
│   ├── data/                # Static data
│   ├── types/               # TypeScript type definitions
│   └── lib/                 # Utility functions
├── public/
│   ├── images/              # Image assets
│   └── icons/               # Icon assets
└── package.json
```

## 🎨 Design System

The project uses a comprehensive CSS variable system for consistent theming:

### Colors

- **Backgrounds**: `--page-bg`, `--elevated-bg`, `--card-bg`
- **Text**: `--text-primary`, `--text-muted`, `--text-brand`
- **Accents**: `--accent-warm`, `--accent-red`, `--accent-purple`
- **Borders**: `--border-card`, `--border-soft`

### Typography

- **Sans-serif**: Inter (body, navigation, UI elements)
- **Display**: Dancing Script (emotional headings)

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. Your site will be live at `your-project.vercel.app`

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. The build output will be in `.next/` directory

3. Deploy the built application to any Node.js hosting service

## 🔧 Customization

### Adding New Sections

1. Create a new component in `src/components/home/`
2. Import and add it to `src/app/page.tsx`

### Modifying the Design System

Edit CSS variables in `src/app/globals.css` to customize:
- Colors
- Spacing
- Border radius
- Transitions

### Changing Fonts

Update font imports in `src/app/layout.tsx` using next/font.

## 📱 Responsive Breakpoints

- **Mobile**: 360px+
- **Tablet**: 768px+
- **Laptop**: 1024px+
- **Desktop**: 1440px+

## 🤝 Contributing

This is a frontend-only project. To extend functionality:

1. Create reusable components in the appropriate directory
2. Follow the existing component structure
3. Use TypeScript for type safety
4. Maintain the design system consistency

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

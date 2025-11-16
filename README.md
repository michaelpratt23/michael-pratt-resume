# Michael Pratt Resume Website

A minimal, Japanese-inspired personal resume website built with React and Vite.

## Design Philosophy

This site embodies:
- Japanese minimalism (white space, clean lines, subtle typography)
- Early Apple simplicity (calm, quiet, intentional)
- Sleek, modern, peaceful design
- Fast, responsive, smooth scrolling

## Features

- **Fixed Navigation**: Smooth scrolling to sections, resume PDF download
- **About Me Section**: Scrollable reveal layout with fade-in animations
- **Connected Sections**: Progressive line animation connecting Apple/Platoon roles
- **Thoughts Section**: Twitter feed (placeholder - ready for API integration)
- **Fully Responsive**: Optimized for desktop, tablet, and mobile

## Setup

### Prerequisites

- Node.js 16+ and npm (or yarn)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your resume PDF:
   - Place your resume PDF file in the `public` folder
   - Name it `michael-pratt-resume.pdf`
   - The nav "Resume" button will trigger a download

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Vite and configure the build
4. Deploy!

The site will be live at `your-project.vercel.app`

### Other Platforms

The `dist` folder contains static files that can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Twitter/X API Integration (TODO)

To fetch real tweets in the Thoughts section:

1. Get Twitter API credentials from [Twitter Developer Portal](https://developer.twitter.com)
2. Update `src/components/Thoughts.jsx` to use the Twitter API v2 or X API
3. Add API credentials to environment variables (`.env.local`)
4. Implement the API call in the `useEffect` hook

Example structure:
```javascript
// In Thoughts.jsx
const fetchTweets = async () => {
  const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=from:michaelpratt23', {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TWITTER_BEARER_TOKEN}`
    }
  })
  const data = await response.json()
  // Process and set tweets
}
```

## Project Structure

```
michael-pratt-resume/
├── public/
│   ├── images/
│   │   ├── Apple.png
│   │   └── Platoon.png
│   └── michael-pratt-resume.pdf  (add your resume here)
├── src/
│   ├── components/
│   │   ├── Nav.jsx
│   │   ├── Nav.css
│   │   ├── AboutMe.jsx
│   │   ├── AboutMe.css
│   │   ├── Thoughts.jsx
│   │   └── Thoughts.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Customization

- **Colors**: Edit CSS variables or direct color values in component CSS files
- **Typography**: Change the font in `index.html` and `src/index.css`
- **Content**: Update text content in component JSX files
- **Animations**: Adjust transition timings in component CSS files

## License

Private project for Michael Pratt.


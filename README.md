# AUR — Asia University Ranking

AUR (Asia University Ranking) is a modern web platform that helps students, researchers, and educators discover, compare, and analyze universities across Asia through rankings, analytics, and intelligent search capabilities.

The project brings ranking analytics, university profiles, country search, and interactive data visualization together in a polished Next.js experience.

##  Key Features

- **University Directory** — browse universities in Asia and view their profile details
- **Rankings Dashboard** — compare top institutions using research, employability, and score metrics
- **Country Exploration** — filter universities by country and review regional ranking insights
- **Advanced Search & Filters** — search by name, location, ranking, and category
- **Analytics Visualizations** — interactive charts and comparative analytics for trends
- **Blog & Insights** — Higher education articles, University highlights, Academic trends and updates
- **AI Assistive UI** — intelligent search and guidance for university discovery
- **Mobile-first Design** — fully responsive experience for desktop, tablet, and mobile

##  Tech Stack

### Frontend
- **Next.js 16**
- **TypeScript**
- **Tailwind CSS**

### Development Tools
- Git
- GitHub
- ESLint
- npm

##  Project Structure

```text
AUR/
├── public/                 # Static assets, images, icons
├── src/                    # Application source code
│   ├── app/                # Next.js App Router pages and layout
│   ├── components/         # Reusable UI components
│   ├── styles/             # Global styling and Tailwind configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project overview and setup
```

##  Getting Started

### Clone the Repository

```bash
git clone https://github.com/<username>/aur.git
```


### Prerequisites

- Node.js 20+ recommended
- npm 10+ (or your preferred package manager)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
```

### Start the production server locally

```bash
npm run start
```

### Run linter

```bash
npm run lint
```

##  Available Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — create a production build
- `npm run start` — start the production server
- `npm run lint` — run ESLint checks

##  Development Notes

- `src/app/layout.tsx` defines the shared layout for the app
- `src/app/page.tsx` is the main landing page entry point
- `src/app/components/` contains the main UI building blocks for the dashboard
- `tailwindcss` is configured via `postcss.config.mjs`

##  Future Enhancements

- User Authentication
- University Comparison Tool
- Bookmark & Favorites
- Personalized Recommendations
- AI-Based University Suggestions
- Real-Time Ranking Updates
- Advanced Analytics Reports

##  License

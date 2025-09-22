# Wing Shack Sales Dashboard

A modern, responsive dashboard for monitoring Wing Shack franchise sales performance with real-time data visualization.

## Features

- **Real-time Analytics**: Live data from Supabase backend
- **Interactive Charts**: Revenue trends, store performance, and product analytics
- **Store Management**: Track individual store performance and metrics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Robust error boundaries and retry mechanisms
- **Auto-refresh**: Data updates every 30 seconds

## Tech Stack

- **Frontend**: React 18, Chart.js, Lucide React
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Deployment**: Vercel
- **Styling**: CSS3 with modern design patterns

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_ANALYTICS_API_URL=your_analytics_api_url
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from dashboard directory**:
   ```bash
   cd dashboard
   vercel
   ```

4. **Set environment variables**:
   ```bash
   vercel env add REACT_APP_SUPABASE_URL
   vercel env add REACT_APP_SUPABASE_ANON_KEY
   vercel env add REACT_APP_ANALYTICS_API_URL
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Connect GitHub repository** to Vercel
2. **Set build settings**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Add environment variables** in Vercel dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_ANALYTICS_API_URL`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SUPABASE_URL` | Supabase project URL | Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `REACT_APP_ANALYTICS_API_URL` | Analytics API endpoint | Yes |

## Project Structure

```
dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── MetricsCards.js
│   │   ├── ChartsSection.js
│   │   ├── StorePerformanceTable.js
│   │   └── ErrorBoundary.js
│   ├── utils/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── vercel.json
└── README.md
```

## API Integration

The dashboard connects to Supabase Edge Functions for data:

- **Analytics API**: `https://your-project.supabase.co/functions/v1/analytics`
- **Endpoints**:
  - `dashboard-summary`: Overall metrics
  - `store-performance`: Store-specific data
  - `top-products`: Product analytics
  - `daily-sales`: Daily revenue trends

## Performance Optimizations

- **Code Splitting**: Automatic with Create React App
- **Asset Optimization**: Minified CSS and JS
- **Caching**: Static assets cached for 1 year
- **Lazy Loading**: Charts load on demand
- **Error Boundaries**: Graceful error handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - Wing Shack Franchise System

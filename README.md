# A/B Test Chart

Interactive line chart for visualizing A/B test conversion rates over time.

## Features

- **Interactive Line Chart**: Visualize conversion rates for multiple test variations
- **Multi-Select Variations**: Choose which variations to display using checkboxes
- **Time Frame Switching**: Toggle between daily and weekly data aggregation
- **Line Style Options**: Switch between line, smooth, and area chart styles
- **Light/Dark Theme**: Toggle between light and dark color schemes
- **Zoom Controls**: Zoom in/out to focus on specific time periods
- **Pan Controls**: Navigate through zoomed chart data
- **Export to PNG**: Download chart as high-resolution PNG image
- **Responsive Design**: Optimized layouts for screens from 320px to 1920px

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and build
- **Recharts** for data visualization
- **html2canvas** for PNG export
- **CSS Modules** for component styling

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Build

```bash
npm run build
```

The production build will be created in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Data Format

The application expects a `data.json` file in the `public` folder with the following structure:

```json
{
  "variations": [
    {
      "id": 0,
      "name": "Control"
    },
    {
      "id": 1,
      "name": "Variant A"
    }
  ],
  "data": [
    {
      "date": "2024-01-01",
      "visits": {
        "0": 1000,
        "1": 980
      },
      "conversions": {
        "0": 52,
        "1": 58
      }
    }
  ]
}
```

## Usage

1. **Select Variations**: Click the variations dropdown to show/hide specific test variations
2. **Change Time Frame**: Switch between Day and Week views
3. **Change Line Style**: Choose between line, smooth, or area chart styles
4. **Toggle Theme**: Click the moon/sun icon to switch between light and dark themes
5. **Zoom**: Use +/- buttons to zoom in/out on the chart
6. **Pan**: After zooming, click the pan button and use arrows to navigate
7. **Reset**: Click the refresh button to reset zoom and pan
8. **Export**: Click the download button to save the chart as PNG

## Project Structure

```
src/
├── assets/
│   └── icons/          # SVG icons
├── components/
│   ├── Chart.tsx       # Main chart component
│   ├── Chart.module.css
│   ├── CustomTooltip.tsx
│   ├── Dropdown.tsx
│   └── MultiSelectDropdown.tsx
├── contexts/
│   └── ThemeContext.tsx
├── types/
│   └── data.ts
├── utils/
│   └── dataProcessing.ts
├── App.tsx
└── main.tsx
```

## License

MIT

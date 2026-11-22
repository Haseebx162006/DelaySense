# DELAYSENSE™ — Frontend Design Specification & Architecture

> **Project**: DelaySense — AI-Powered Supply Chain Delay Prediction & Risk Engine  
> **Aesthetic Inspiration**: Modern dark architectural luxury & high-contrast editorial minimalism (inspired by Valyent reference design)  
> **Framework**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion  
> **Backend Service**: FastAPI (`/api/v1/predict`, `/api/v1/health`)

---

## 1. Design Philosophy & Aesthetic Blueprint

The design translates the premium, sculptural aesthetic of the reference screenshot into an enterprise-grade AI supply chain intelligence platform.

### 1.1 Color Palette
- **Deep Obsidian Black (`#060908` / `#090d0b`)**: Primary dark backdrop evoking high-end editorial and enterprise depth.
- **Sculpted Forest & Emerald Glow (`#064e3b` / `#047857` / `#10b981` / `#34d399`)**: Signature glowing organic accents, luminous pills, and fluid wave gradients.
- **Pure White (`#ffffff`) & Soft Slate (`#f8fafc` / `#e2e8f0` / `#94a3b8`)**: Clean, crisp typography with high legibility.
- **Light Contrast Interstitial (`#f8faf9`)**: Dedicated high-contrast brand/partner sections transitioning smoothly between dark and light themes.
- **Semantic Risk Tokens**:
  - **Low Risk / On-Time**: Emerald Glass (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)
  - **Medium Risk / Caution**: Amber Glass (`bg-amber-500/10 text-amber-400 border-amber-500/20`)
  - **High Risk / Delay Warning**: Crimson Glass (`bg-rose-500/10 text-rose-400 border-rose-500/20`)

### 1.2 Typography & Graphic Hierarchy
- **Primary Display**: Bold, geometric sans-serif (`font-sans tracking-tight font-extrabold uppercase`) evoking the iconic `VALYENT™` header.
- **Section Badges**: Uppercase micro-copy (`text-xs font-semibold tracking-[0.25em] text-emerald-400 uppercase`).
- **Body & Metrics**: Monospace tabular numerals for delay rates, order IDs, latencies, and precision metrics.

---

## 2. Page Architecture & Section Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Header & Floating Pill Navigation Bar                    │
│    [Logo: DELAYSENSE™]  [Overview] [Solutions] [Workbench]  │
│    [Case Studies] [System Status: Active]  [Launch Demo ->] │
├─────────────────────────────────────────────────────────────┤
│ 2. Hero Section (Deep Obsidian + 3D Emerald Fluid Ribbon)   │
│    • Headline: "DELAYSENSE™ — AI Supply Chain Precision"   │
│    • Subtitle: "Predict disruptions before departure..."    │
│    • Social Proof Badge: "Trusted by 150+ Freight Leaders" │
│    • Live Precision Badge: "99.2% Model Accuracy"           │
├─────────────────────────────────────────────────────────────┤
│ 3. Enterprise Ecosystem & Carrier Cloud (Clean Contrast)    │
│    • Maersk • DHL Global • FedEx • Flexport • DB Schenker   │
├─────────────────────────────────────────────────────────────┤
│ 4. Core Solutions Matrix (4 Quadrants + Central 3D Capsule) │
│    [1. Real-Time Delay Forecast]  [2. Multimodal Risk Score]│
│                  ┌──────────────────────┐                   │
│                  │  Center Glowing 3D   │                   │
│                  │  DelaySense Capsule  │                   │
│                  └──────────────────────┘                   │
│    [3. Route & Carrier Advisory]  [4. Batch Pipeline (CSV)] │
├─────────────────────────────────────────────────────────────┤
│ 5. Interactive Prediction Workbench (Live ML Playground)    │
│    • Tab 1: Batch CSV Upload (Drag & Drop + Sample Loader)  │
│    • Tab 2: Single Shipment Simulator                       │
│    • Real-time Backend Health Connection Status             │
│    • Live KPI Counters (Delayed, On-Time, Rate, Latency)    │
│    • Searchable, Filterable & Exportable Predictions Table  │
├─────────────────────────────────────────────────────────────┤
│ 6. Case Studies & Production Impact (4 Visual Cards)        │
│    • Global Retail Network (34% Delay Reduction)            │
│    • High-Tech Electronics ($2.4M Penalties Prevented)      │
│    • Cross-Border Automotive (99.1% On-Time Delivery)       │
│    • Cold-Chain Pharma (Zero Integrity Breaches)           │
├─────────────────────────────────────────────────────────────┤
│ 7. Luxury Tech Footer & Status Console                      │
│    • FastAPI Status • LightGBM Model v0.1.0 • Privacy • Docs│
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Integration Specifications

### 3.1 Health Check (`GET /api/v1/health`)
- Checks model availability (`lgb_model.joblib` / `lgb_model.pkl`).
- Returns: `{ "status": "healthy", "model_loaded": true, "version": "0.1.0" }`.

### 3.2 Batch CSV Prediction (`POST /api/v1/predict`)
- Expects multipart form file with `.csv`.
- Validates columns (`Shipping Mode`, `Customer City`, `order date (DateOrders)`, `Order Id`, etc.).
- Returns:
  ```json
  {
    "summary": {
      "total_orders": 100,
      "delayed_count": 38,
      "on_time_count": 62,
      "delay_rate": 38.0,
      "processing_time_ms": 142.5
    },
    "columns": ["order_id", "is_delayed", "delay_probability", "risk_level"],
    "data": [
      {
        "order_id": 75939,
        "is_delayed": 1,
        "delay_probability": 0.84,
        "risk_level": "High"
      }
    ]
  }
  ```

### 3.3 Seamless Fallback Mechanism
- If backend is temporarily offline during design review, client gracefully falls back to authentic simulated data based on `sample_orders.csv` with a clear demo banner, ensuring 100% testability.

---

## 4. Multi-Agent Task Division

To build this modularly and expeditiously, work is partitioned into specialized sub-agents:

1. **Sub-Agent 1: Infrastructure & API Engine (`infra-agent`)**
   - Configures `package.json`, Tailwind CSS with custom emerald shades, glassmorphism, fonts, and utilities.
   - Implements `src/lib/api.ts`, TypeScript schemas in `src/types/prediction.ts`, and fallback mock generators.
   - Provides sample dataset access.

2. **Sub-Agent 2: Navigation & Hero Experience (`hero-agent`)**
   - Crafts the floating frosted pill navigation bar with active section anchors and status indicator.
   - Implements the Valyent-style Hero section with dark obsidian background, emerald fluid glow ribbons, typography, and floating social badges.
   - Builds the enterprise partner logo cloud section.

3. **Sub-Agent 3: Solutions Grid & Central 3D Capsule (`solutions-agent`)**
   - Builds the signature 4-quadrant feature layout matching the reference screenshot.
   - Builds the central illuminated 3D dark-emerald capsule with animated sensor pulse, telemetry readout, and interactive status.

4. **Sub-Agent 4: Interactive Prediction Workbench (`workbench-agent`)**
   - Builds the Drag-and-Drop CSV File Upload Zone with loading progress, file validation, and "Load Sample Dataset" one-click button.
   - Builds the Metrics Summary cards with progress rings and key metrics.
   - Builds the interactive Predictions Table with risk badges, search filtering, risk level tabs, sorting, and CSV export.
   - Builds the Single Order instant prediction calculator.

5. **Sub-Agent 5: Case Studies & Footer (`showcase-agent`)**
   - Builds the 4 visual case study cards mirroring the lower section of the screenshot.
   - Builds the executive footer with system health status and navigation links.
   - Integrates everything into `page.tsx` and performs build verification (`npm run build`).

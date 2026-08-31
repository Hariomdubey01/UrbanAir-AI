# UrbanAir AI — Environmental Intelligence for Sustainable Cities

**Tagline:** "Understand Your City's Air."  
**SDG Focus:** UN SDG 11 (Sustainable Cities and Communities) — Target 11.6 & Indicator 11.6.2  

---

## 1. Architectural Principle: `MEASURED DATA ≠ AI INTERPRETATION`

UrbanAir AI strictly separates raw physical telemetry from artificial intelligence interpretation:

```
                    ENVIRONMENTAL API (Open-Meteo)
                                   ↓
                    VALIDATED TELEMETRY (Deterministic)
                                   ↓
                    AQI ENGINE (calculateAQI, getAQICategory)
                                   ↓
                    DATA TRUST ENGINE (getDataFreshness)
                                   ↓
                    ENVIRONMENTAL CONTEXT
                                   ↓
                    ┌──────────────┴──────────────┐
                    ↓                             ↓
            RAG KNOWLEDGE RETRIEVAL        GEMINI 3.6 FLASH /
            (WHO, EPA, UN SDG 11)          KNOWLEDGE ENGINE
                    ↓                             ↓
                    └──────────────┬──────────────┘
                                   ↓
                    AI EXPLANATION & CITATIONS
```

- **Deterministic AQI Standard:** All calculations follow the official **US EPA AQI** 6-tier breakpoints:
  - `0–50`: **Good**
  - `51–100`: **Moderate**
  - `101–150`: **Unhealthy for Sensitive Groups**
  - `151–200`: **Unhealthy**
  - `201–300`: **Very Unhealthy**
  - `301–500`: **Hazardous**
- **AI Role:** The AI model (Gemini 3.6 Flash or Deterministic Reference Fallback) **never generates or modifies numbers**; it only interprets verified measurements and cites reputable knowledge sources.



---

## 2. Privacy & Data Governance

- **Zero PII Collection:** UrbanAir AI does not collect, retain, or store personally identifiable user information.
- **Client-Side Storage:** Browser storage is strictly limited to local theme preferences (`light` / `dark` mode).
- **Geolocation Processing:** Coordinates from "Use My Location" are used transiently to query telemetry and are not saved to databases or server storage.
- **Anonymous Feedback:** Product feedback is stored anonymously without IP addresses, user IDs, or device fingerprints.

---

## 3. Quick Start & Production Commands

```bash
# 1. Install dependencies
npm install

# 2. Check code quality & types
npm run lint

# 3. Compile optimized production build
npm run build

# 4. Start production server
npm run start
```

Accessible on `http://localhost:3000`.

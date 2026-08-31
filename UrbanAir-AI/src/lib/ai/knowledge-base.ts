import { KnowledgeDocument } from '../types';

export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'who-aqg-2021-pm25',
    title: 'WHO Global Air Quality Guidelines 2021 — Particulate Matter (PM2.5 & PM10)',
    organization: 'World Health Organization (WHO)',
    topic: 'PM2.5 & PM10 Health Thresholds',
    source_url: 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health',
    url: 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health',
    published_date: '2021-09-22',
    date: '2021-09-22',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'WHO recommends annual mean PM2.5 levels should not exceed 5 µg/m³, and 24-hour mean exposure should not exceed 15 µg/m³.',
    content: `The World Health Organization (WHO) updated its Global Air Quality Guidelines in September 2021 to offer clear evidence of the damage air pollution inflicts on human health at lower concentrations than previously understood.

Key recommended 24-hour mean guidelines:
- Fine Particulate Matter (PM2.5): 15 µg/m³
- Coarse Particulate Matter (PM10): 45 µg/m³
- Nitrogen Dioxide (NO2): 25 µg/m³
- Ozone (O3, 8-hour peak): 100 µg/m³
- Sulfur Dioxide (SO2): 40 µg/m³
- Carbon Monoxide (CO): 4 mg/m³

Particulate matter (PM2.5 and PM10) is capable of penetrating deep into the lungs and entering the bloodstream, causing cardiovascular and respiratory impacts. Clean air policies directly reduce non-communicable disease burdens in urban centers.`
  },
  {
    id: 'epa-aqi-scale-guidance',
    title: 'US EPA Air Quality Index (AQI) Technical Guidance & Calculation Scales',
    organization: 'United States Environmental Protection Agency (US EPA)',
    topic: 'AQI Calculation & Categories',
    source_url: 'https://www.airnow.gov/aqi/aqi-basics/',
    url: 'https://www.airnow.gov/aqi/aqi-basics/',
    published_date: '2023-05-15',
    date: '2023-05-15',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'The AQI runs from 0 to 500. The higher the AQI value, the greater the level of air pollution and the greater the health concern.',
    content: `The Air Quality Index (AQI) is a normalized reporting index used by government environmental protection agencies to communicate ambient air pollution levels to the public.

AQI Ranges and Categories:
- 0 to 50 (Good): Air quality is satisfactory, and air pollution poses little or no risk.
- 51 to 100 (Moderate): Air quality is acceptable; however, sensitive individuals may experience minor irritation.
- 101 to 150 (Unhealthy for Sensitive Groups): Members of sensitive groups may experience health effects.
- 151 to 200 (Unhealthy): Everyone may begin to experience health effects; sensitive groups experience more serious effects.
- 201 to 300 (Very Unhealthy): Health alert: risk of health effects is increased for everyone.
- 301 to 500 (Hazardous): Health warning of emergency conditions.


Five major pollutants are tracked: ground-level ozone, particle pollution (PM2.5/PM10), carbon monoxide, sulfur dioxide, and nitrogen dioxide.`
  },
  {
    id: 'un-sdg11-target-116',
    title: 'UN SDG 11: Sustainable Cities and Communities — Target 11.6 & Indicator 11.6.2',
    organization: 'United Nations Department of Economic and Social Affairs',
    topic: 'Sustainable Cities & SDG 11',
    source_url: 'https://sdgs.un.org/goals/goal11',
    url: 'https://sdgs.un.org/goals/goal11',
    published_date: '2023-07-10',
    date: '2023-07-10',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'Target 11.6: By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal waste.',
    content: `Sustainable Development Goal 11 aims to make cities and human settlements inclusive, safe, resilient and sustainable. 

Target 11.6 specifically focuses on urban environmental health:
"By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management."

Indicator 11.6.2 tracks the "annual mean levels of fine particulate matter (e.g. PM2.5 and PM10) in cities (population weighted)."

More than 90% of urban dwellers breathe air that fails to meet WHO guidelines. Accessible environmental intelligence empowers citizens, urban planners, and local authorities to take informed community action toward cleaner transit, low-emission zones, and green urban infrastructure.`
  },
  {
    id: 'eea-urban-air-europe-2023',
    title: 'European Environment Agency: Air Quality in Europe Report & Urban Drivers',
    organization: 'European Environment Agency (EEA)',
    topic: 'Urban Pollution Drivers & Sources',
    source_url: 'https://www.eea.europa.eu/publications/air-quality-in-europe-2023',
    url: 'https://www.eea.europa.eu/publications/air-quality-in-europe-2023',
    published_date: '2023-11-20',
    date: '2023-11-20',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'Urban transportation, residential heating with solid fuels, industrial combustion, and seasonal atmospheric inversions are primary drivers of urban pollution spikes.',
    content: `Urban air quality fluctuates based on localized emissions and meteorological phenomena.

Primary Emission Drivers in Cities:
1. Road Transportation: Internal combustion engines release NO2, VOCs, and primary PM2.5 from tailpipes, tire wear, and brake friction.
2. Residential Energy & Heating: Biomass and coal burning for domestic heating emit heavy loads of organic carbon and PM2.5 during winter months.
3. Industry & Power Plants: Stationary combustion releases SO2, NOx, and heavy particulates.
4. Atmospheric Inversion: Temperature inversions trap cooler air near the ground beneath a warm air cap, preventing pollutant dispersal and causing rapid AQI spikes during stagnant weather conditions.`
  },
  {
    id: 'c40-cities-clean-air-action',
    title: 'C40 Cities Clean Air Action Guide for Urban Neighborhoods & Green Mobility',
    organization: 'C40 Cities Climate Leadership Group',
    topic: 'Community Environmental Intelligence & Action',
    source_url: 'https://www.c40.org/what-we-do/scaling-up-action/clean-air/',
    url: 'https://www.c40.org/what-we-do/scaling-up-action/clean-air/',
    published_date: '2024-02-01',
    date: '2024-02-01',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'Hyperlocal data monitoring combined with community awareness drives city-wide investments in green transport, pedestrian corridors, and clean air zones.',
    content: `Transforming urban air quality requires bridging environmental metrics with community participation.

Key Community Intelligence Principles:
1. Environmental Literacy: Explaining complex metrics (AQI, PM2.5) into plain language helps citizens understand personal and neighborhood exposure.
2. Low-Emission Zones: Cities utilizing real-time air data implement dynamic congestion pricing and low-emission transit corridors.
3. Urban Greening: Tree canopy expansion along heavy traffic arteries traps airborne particulate matter and mitigates urban heat island effects.
4. Active Mobility: Promoting safe walking and cycling infrastructure reduces vehicle kilometers traveled and lowers localized NO2 concentrations.`
  },
  {
    id: 'lancet-planetary-health-air-2023',
    title: 'Lancet Planetary Health: Global Ambient Air Quality & Urban Burden Assessment',
    organization: 'The Lancet Planetary Health',
    topic: 'Global Environmental Health Evidence',
    source_url: 'https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(23)00002-X/fulltext',
    url: 'https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(23)00002-X/fulltext',
    published_date: '2023-03-10',
    date: '2023-03-10',
    retrieved_date: '2026-08-30',
    retrieval_method: 'manual-curation',
    snippet: 'Long-term fine particulate exposure is quantitatively linked with respiratory vulnerability, underscoring the urgent need for open, accessible city environmental intelligence.',
    content: `Epidemiological studies confirm that particulate matter is an environmental risk factor requiring continuous monitoring. Transparent data architectures enable civic resilience by converting scientific monitoring into accessible public guidance.`
  }
];

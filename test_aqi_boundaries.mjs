function determineAQICategory(aqi) {
  if (typeof aqi !== 'number' || isNaN(aqi) || aqi < 0) {
    return { category: 'Good', code: 1, color: '#10b981' };
  }
  if (aqi <= 50) {
    return { category: 'Good', code: 1, color: '#10b981' };
  } else if (aqi <= 100) {
    return { category: 'Moderate', code: 2, color: '#f59e0b' };
  } else if (aqi <= 150) {
    return { category: 'Unhealthy for Sensitive Groups', code: 3, color: '#f97316' };
  } else if (aqi <= 200) {
    return { category: 'Unhealthy', code: 4, color: '#ef4444' };
  } else if (aqi <= 300) {
    return { category: 'Very Unhealthy', code: 5, color: '#8b5cf6' };
  } else {
    return { category: 'Hazardous', code: 6, color: '#881337' };
  }
}

const testBoundaries = [
  { aqi: 0, expected: 'Good' },
  { aqi: 50, expected: 'Good' },
  { aqi: 51, expected: 'Moderate' },
  { aqi: 100, expected: 'Moderate' },
  { aqi: 101, expected: 'Unhealthy for Sensitive Groups' },
  { aqi: 150, expected: 'Unhealthy for Sensitive Groups' },
  { aqi: 151, expected: 'Unhealthy' },
  { aqi: 200, expected: 'Unhealthy' },
  { aqi: 201, expected: 'Very Unhealthy' },
  { aqi: 300, expected: 'Very Unhealthy' },
  { aqi: 301, expected: 'Hazardous' },
  { aqi: 500, expected: 'Hazardous' },
];

console.log('| AQI Boundary | Expected EPA Category | Actual Implemented Category | Result |');
console.log('|--------------|-----------------------|-----------------------------|--------|');

let allPassed = true;
for (const item of testBoundaries) {
  const actual = determineAQICategory(item.aqi);
  const match = actual.category === item.expected;
  if (!match) allPassed = false;
  console.log(`| ${String(item.aqi).padEnd(12)} | ${item.expected.padEnd(21)} | ${actual.category.padEnd(27)} | ${match ? 'PASS' : 'FAIL'} |`);
}

console.log('\nAll boundary tests pass:', allPassed);

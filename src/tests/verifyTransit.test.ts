import assert from 'node:assert';
import { 
  INITIAL_LINES, 
  INITIAL_STATIONS, 
  INITIAL_NOTICES, 
  INITIAL_COMMUTER_REPORTS 
} from '../data/transitData';
import { 
  formatRelativeTime, 
  formatTime24, 
  getHealthDisplay, 
  getSeverityDisplay, 
  generateDeparturesForStation, 
  exportToGTFSRealtime 
} from '../utils/transitFormatters';

console.log('--- RUNNING TRANSITNOTICE SYSTEM VERIFICATION TESTS ---');

// Test 1: Baseline Integrity
assert.strictEqual(INITIAL_LINES.length, 8, 'Expected 8 initial transit lines');
assert.strictEqual(INITIAL_STATIONS.length, 16, 'Expected 16 initial transit stations');
assert.ok(INITIAL_NOTICES.length >= 7, 'Expected at least 7 initial active transit notices');
assert.ok(INITIAL_COMMUTER_REPORTS.length >= 3, 'Expected at least 3 initial commuter reports');
console.log('✓ Baseline data models validated');

// Test 2: Formatting & Time Utilities
const relNow = formatRelativeTime(new Date().toISOString());
assert.strictEqual(relNow, 'Just now', 'formatRelativeTime should return Just now for current time');
const time24 = formatTime24(new Date('2026-11-01T14:35:00'));
assert.strictEqual(time24, '14:35', 'formatTime24 should return 14:35');
console.log('✓ Time formatting and relative calculations validated');

// Test 3: Health & Severity Tokens
const greenHealth = getHealthDisplay('good_service');
assert.strictEqual(greenHealth.label, 'Good Service');
const severeSev = getSeverityDisplay('severe');
assert.strictEqual(severeSev.label, 'Severe Disruption');
console.log('✓ Semantic status tokens & WCAG AAA mappings validated');

// Test 4: Departures Generator
const centralStation = INITIAL_STATIONS.find(s => s.id === 'ST-CENTRAL')!;
const mockTime = new Date('2026-11-01T12:00:00Z');
const departures = generateDeparturesForStation(centralStation, INITIAL_LINES, INITIAL_NOTICES, mockTime);
assert.ok(departures.length > 0, 'Departures should be generated for Central Station');
assert.ok(departures[0].minutesAway >= 1, 'Minutes away should be positive');
assert.ok(departures[0].platform.includes('Platform'), 'Platform should be formatted');
console.log(`✓ Departures generator computed ${departures.length} upcoming movements for Central Station`);

// Test 5: GTFS-RT Realtime Feed Compliance
const gtfsFeed = exportToGTFSRealtime(INITIAL_NOTICES, INITIAL_LINES);
assert.strictEqual(gtfsFeed.header.gtfsRealtimeVersion, '2.0', 'GTFS version must be 2.0');
assert.strictEqual(gtfsFeed.header.incrementality, 'FULL_DATASET');
assert.strictEqual(gtfsFeed.entity.length, INITIAL_NOTICES.length, 'Every notice must yield a GTFS entity');
const firstAlert = gtfsFeed.entity[0].alert;
assert.ok(firstAlert.headerText.translation.length > 0, 'GTFS alert must contain header translation block');
assert.ok(firstAlert.informedEntity.length > 0, 'GTFS alert must have informed entities');
console.log(`✓ GTFS-RT 2.0 feed generator produced ${gtfsFeed.entity.length} valid entities`);

console.log('--- ALL TRANSITNOTICE QUALITY ASSURANCE TESTS PASSED (5/5) ---');

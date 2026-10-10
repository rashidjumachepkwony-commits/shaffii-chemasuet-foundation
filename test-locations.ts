import { getCounties, getSubCounties, getWards, getLocations } from './src/lib/locations';

console.log('Total counties:', getCounties().length);

// Test Busia
const county = 'Busia';
const subs = getSubCounties(county);
console.log(`Busia subCounties: ${JSON.stringify(subs)}`);

if (subs.length > 0) {
  const sub = subs[0];
  const wards = getWards(county, sub);
  console.log(`Busia/${sub} wards: ${JSON.stringify(wards)}`);

  if (wards.length > 0) {
    const ward = wards[0];
    const locs = getLocations(county, sub, ward);
    console.log(`Busia/${sub}/${ward} locations: ${JSON.stringify(locs)}`);
  }
}

// Test Nairobi (more complex)
const nairobi = 'Nairobi';
const nSubs = getSubCounties(nairobi);
console.log(`Nairobi subCounties: ${JSON.stringify(nSubs)}`);

if (nSubs.length > 0) {
  const nSub = nSubs[0];
  const nWards = getWards(nairobi, nSub);
  console.log(`Nairobi/${nSub} wards: ${JSON.stringify(nWards)}`);

  if (nWards.length > 0) {
    const nWard = nWards[0];
    const nLocs = getLocations(nairobi, nSub, nWard);
    console.log(`Nairobi/${nSub}/${nWard} locations: ${JSON.stringify(nLocs)}`);
  }
}

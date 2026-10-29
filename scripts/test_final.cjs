const https = require('https');

const data = JSON.stringify({
  full_name: "Test Registration",
  email: "test-final@example.com",
  phone: "+254700000002",
  age_group: "ages_25_59",
  activity_interest: "community_service",
  county: "Busia",
  sub_county: "Teso North",
  ward: "Ang'urai East",
  location: "Ang'urai Location",
  sub_location: "Market Centre",
  id_number: "12345678",
  attendee_count: 1
});

const req = https.request('https://shafie-chemasuet-foundation-worker.rashidjumachepkwony.workers.dev/api/events/9fa1ee4a-4346-4854-8905-16f9e23daf9d/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.status);
    console.log('Response:', body);
  });
});
req.on('error', (e) => console.error(e.message));
req.write(data);
req.end();

import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./tmp_astros.json', 'utf8'));
data.results.forEach((a, i) => {
  console.log(`=== ASTRO ${i}: ${a.name} ===`);
  console.log('  id:', a.id || a._id);
  console.log('  experience:', a.experience);
  console.log('  per_min_chat:', a.per_min_chat);
  console.log('  per_min_voice_call:', a.per_min_voice_call);
  console.log('  per_min_video_call:', a.per_min_video_call);
  console.log('  avg_rate:', a.avg_rate);
  console.log('  total_review:', a.total_review);
  console.log('  category:', JSON.stringify(a.category));
  console.log('  all_category:', JSON.stringify(a.all_category));
  console.log('  language:', JSON.stringify(a.language));
  console.log('  primary_language:', JSON.stringify(a.primary_language));
  console.log('-------------------------------------------');
});

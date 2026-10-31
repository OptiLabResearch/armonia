import sharp from 'sharp';

await sharp('src/assets/images/hero-room.png')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('public/social.jpg');
console.log('Created public/social.jpg (1200 × 630).');

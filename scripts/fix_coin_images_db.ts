import { queryDb } from '../src/utils/db';

async function main() {
  try {
    console.log('--- Updating product_media table ---');
    // Republic One Rupee
    await queryDb(`
      UPDATE product_media 
      SET media_url = '/coin_image.jpg' 
      WHERE product_id = '4082fb09-d8dc-49de-8aa4-248b081ba946' AND is_primary = true
    `);

    // Mughal Shah Alam
    await queryDb(`
      UPDATE product_media 
      SET media_url = '/images/categories/mughal-square-mohur.jpg' 
      WHERE product_id = '69b16fd9-c324-4280-ada6-6d935f3fd14d' AND is_primary = true
    `);

    // Republic 1950 Proof set
    await queryDb(`
      UPDATE product_media 
      SET media_url = '/images/categories/commemorative-100.jpg' 
      WHERE product_id = 'b2a5b653-7c5e-474e-9644-da100b5ca940' AND is_primary = true
    `);

    // Victoria Empress
    await queryDb(`
      UPDATE product_media 
      SET media_url = '/images/categories/victoria-queen.jpg' 
      WHERE product_id = '485d7fb6-c448-45b3-83e2-db4b571eef91' AND media_url = '/coin_image_new.png'
    `);

    // Any remaining /coin_image_new.png in product_media
    await queryDb(`
      UPDATE product_media 
      SET media_url = '/coin_image.jpg' 
      WHERE media_url = '/coin_image_new.png'
    `);

    console.log('--- Updating categories table ---');
    await queryDb(`UPDATE categories SET image_url = '/images/categories/mughal-zodiac.png' WHERE slug = 'mughal-coins'`);
    await queryDb(`UPDATE categories SET image_url = '/images/categories/princely-states-awadh.jpg' WHERE slug = 'princely-states'`);
    await queryDb(`UPDATE categories SET image_url = '/images/categories/east-india-company.jpg' WHERE slug = 'tokens-badges'`);
    await queryDb(`UPDATE categories SET image_url = '/images/categories/ancient-lakshmi.jpg' WHERE slug = 'sultanates'`);
    await queryDb(`UPDATE categories SET image_url = '/coin_image.jpg' WHERE image_url = '/coin_image_new.png'`);

    console.log('--- Verification ---');
    const checkMedia = await queryDb(`SELECT count(*) FROM product_media WHERE media_url LIKE '%coin_image_new%'`);
    console.log('Remaining coin_image_new in product_media:', checkMedia[0].count);

    const checkCats = await queryDb(`SELECT count(*) FROM categories WHERE image_url LIKE '%coin_image_new%'`);
    console.log('Remaining coin_image_new in categories:', checkCats[0].count);

    console.log('SUCCESS: All coin images updated in database!');
  } catch (err) {
    console.error('Error updating coin images:', err);
  } finally {
    process.exit(0);
  }
}

main();

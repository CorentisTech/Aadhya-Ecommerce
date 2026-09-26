import fs from 'fs';
import { CATEGORIES, PRODUCTS } from './src/data/mockData';
import { v4 as uuidv4 } from 'uuid'; // need to install uuid

const generateSql = () => {
  let sql = `-- Seed Data for AADHYA Ecommerce Generated Script\n\n`;

  // Track generated UUIDs mapping
  const catIdMap: Record<string, string> = {};
  
  // 1. Categories
  sql += `-- CATEGORIES\n`;
  for (const cat of CATEGORIES) {
    const newId = uuidv4();
    catIdMap[cat.id] = newId;
    sql += `INSERT INTO categories (id, name, slug, description, visual_type, visual_color, image_url, department) VALUES ('${newId}', '${cat.name.replace(/'/g, "''")}', '${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}', '${(cat.description || '').replace(/'/g, "''")}', '${cat.visualType || ''}', '${cat.visualColor || ''}', '${cat.image || ''}', '${cat.department}') ON CONFLICT (slug) DO NOTHING;\n`;
  }

  sql += `\n-- PRODUCTS\n`;
  for (const prod of PRODUCTS) {
    const prodId = uuidv4();
    // Default to first category UUID if not explicitly found in map, or generate a dummy one if mock is incomplete
    const matchedCat = CATEGORIES.find(c => c.name.toLowerCase() === prod.category.toLowerCase() && c.department === prod.department);
    const categoryId = matchedCat ? catIdMap[matchedCat.id] : (Object.values(catIdMap)[0] || uuidv4());

    sql += `INSERT INTO products (id, product_no, name, slug, category_id, department, description, visual_type, visual_color, visual_pattern, base_price, base_mrp, base_discount, is_bestseller, avg_rating, reviews_count, return_policy) VALUES ('${prodId}', '${prod.productNo || prod.id}', '${prod.name.replace(/'/g, "''")}', '${prod.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}', '${categoryId}', '${prod.department}', '${(prod.description || '').replace(/'/g, "''")}', '${prod.visualType || ''}', '${prod.visualColor || ''}', '${prod.visualPattern || ''}', ${prod.price}, ${prod.mrp}, ${prod.discount}, ${prod.bestseller ? 'true' : 'false'}, ${prod.rating || 0}, ${prod.reviewsCount || 0}, '${(prod.returnPolicy || '').replace(/'/g, "''")}') ON CONFLICT (product_no) DO NOTHING;\n`;

    // Images (Product Media)
    if (prod.image) {
      sql += `INSERT INTO product_media (product_id, media_url, is_primary) VALUES ('${prodId}', '${prod.image}', true);\n`;
    }
    if (prod.images) {
      for (const img of prod.images) {
         if (img !== prod.image) {
             sql += `INSERT INTO product_media (product_id, media_url) VALUES ('${prodId}', '${img}');\n`;
         }
      }
    }

    // Domain Specific
    if (prod.department === 'fashion') {
      sql += `INSERT INTO fashion_product_details (product_id, fabric, pattern, neck_type, sleeves, occasion, length, pack_of, fit, model_info, return_time) VALUES ('${prodId}', '${(prod as any).fabric || ''}', '${(prod as any).pattern || ''}', '${(prod as any).neckType || ''}', '${(prod as any).sleeves || ''}', '${(prod as any).occasion || ''}', '${(prod as any).length || ''}', '${(prod as any).packOf || ''}', '${(prod as any).fit || ''}', '${((prod as any).modelInfo || '').replace(/'/g, "''")}', '${(prod as any).returnTime || ''}') ON CONFLICT DO NOTHING;\n`;
    } else if (prod.department === 'numismatics') {
      sql += `INSERT INTO numismatic_product_details (product_id, rarity, era, year, denomination, material, weight, condition, mint, shipping_charges, collection_label) VALUES ('${prodId}', '${(prod as any).rarity || ''}', '${((prod as any).era || '').replace(/'/g, "''")}', '${(prod as any).year || ''}', '${(prod as any).denomination || ''}', '${(prod as any).material || ''}', '${(prod as any).weight || ''}', '${(prod as any).condition || ''}', '${(prod as any).mint || ''}', '${(prod as any).shippingCharges || ''}', '${(prod as any).collectionLabel || ''}') ON CONFLICT DO NOTHING;\n`;
    }
  }

  fs.writeFileSync('supabase/migrations/seed_data_temp.sql', sql);
  console.log('Seed SQL generated at supabase/migrations/seed_data_temp.sql');
};

generateSql();

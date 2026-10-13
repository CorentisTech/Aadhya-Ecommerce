import { Product } from '@/data/mockData';

// Helper to convert DB product format to mockData format
function mapDbProductToFrontend(dbProduct: any): Product {
  const primaryMedia = dbProduct.product_media?.find((m: any) => m.is_primary) || dbProduct.product_media?.[0];
  const imageUrl = primaryMedia ? primaryMedia.media_url : '/images/placeholder.jpg';
  
  const basePrice = dbProduct.base_price || 0;
  const baseMrp = dbProduct.base_mrp || 0;
  
  return {
    id: dbProduct.id,
    productNo: dbProduct.product_no,
    name: dbProduct.name,
    slug: dbProduct.slug || dbProduct.id,
    category: dbProduct.categories?.name || 'Uncategorized',
    price: basePrice,
    mrp: baseMrp,
    discount: dbProduct.base_discount || 0,
    description: dbProduct.description,
    image: imageUrl,
    images: dbProduct.product_media?.map((m: any) => m.media_url) || [imageUrl],
    visualType: dbProduct.visual_type,
    visualColor: dbProduct.visual_color,
    department: dbProduct.department,
    bestseller: dbProduct.is_bestseller,
    isHero: dbProduct.is_hero,
    heroOrder: dbProduct.hero_order,
    rating: dbProduct.avg_rating,
    reviewsCount: dbProduct.reviews_count,
    // Provide defaults for missing mock fields
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  };
}

export async function fetchProducts(params: {
  department?: 'fashion' | 'numismatics';
  isHero?: boolean;
  isBestseller?: boolean;
  limit?: number;
}): Promise<Product[]> {
  try {
    const urlParams = new URLSearchParams();
    if (params.department) urlParams.append('department', params.department);
    if (params.isHero !== undefined) urlParams.append('is_hero', String(params.isHero));
    if (params.isBestseller !== undefined) urlParams.append('is_bestseller', String(params.isBestseller));
    if (params.limit) urlParams.append('limit', String(params.limit));

    const res = await fetch(`/api/products?${urlParams.toString()}`);
    if (!res.ok) {
      console.warn('Products API returned non-OK status:', res.status);
      return [];
    }
    const data = await res.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(mapDbProductToFrontend);
    }
    return [];
  } catch (error) {
    console.error('Error fetching real products:', error);
    return [];
  }
}

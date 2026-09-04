export interface ProductColorGallery {
  colorName: string;
  colorHex: string;
  images: string[];
}

export interface SizeGuideItem {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  length: string;
}

export interface Product {
  id: string;
  productNo: string; // Required for all products
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  description: string;
  image: string; // Used for standard thumbnail/image panels
  images?: string[]; // Multiple product images
  visualType: 'saree' | 'dress' | 'bodycon' | 'ethnic' | 'blouse' | 'kurti' | 'lehenga' | 'coin' | 'note'; // For premium vector rendering
  visualColor?: string; // Hex color for the SVG garment/coin path
  visualPattern?: 'gold-brocade' | 'floral-embroidery' | 'silk-sheen' | 'plain' | 'antique-metallic' | 'currency-green' | 'rupee-blue';
  colors?: string[];
  sizes?: string[];
  bestseller?: boolean;
  department: 'fashion' | 'numismatics';
  
  // Fashion Specific Attributes
  fabric?: string; // 'AV Cotton' | 'Rayon' | string
  pattern?: 'Plain' | 'Printed';
  length?: string; // 'Ankle Length' | 'Floor Length' | 'Full Length' | 'Midi Length' | 'Regular Length'
  packOf?: number | string; // 'Pack of 1' | 'Pack of 2' | number
  fabricCare?: string[]; // ['Cold Wash', 'Machine Wash', 'Brush Care']
  returnTime?: string; // e.g. "7 Days", "10 Days"
  returnPolicy?: string; // Product-level return policy string
  sizeGuide?: SizeGuideItem[]; // Measurements table
  
  // Numismatics Specific Attributes
  material?: string; // 'Gold' | 'Silver' | 'Copper' | 'Brass' | 'Nickel' | 'Other'
  weight?: string; // e.g. '7.98 g', '11.66 g', '1.2 g' (supporting g, kg, mg)
  mint?: string; // e.g. 'Mumbai Mint', 'Kolkata Mint', 'Hyderabad Mint', 'Noida Mint'
  year?: string; // e.g. '1954', '2017', '1835'
  shippingCharges?: string; // e.g. 'Free Shipping', '₹99', '₹149'
  rarity?: 'Common' | 'Scarce' | 'Rare' | 'Very Rare' | 'Extremely Rare';
  era?: string;
  denomination?: string;
  condition?: string;
  collectionLabel?: string;
  
  // Shared Editorial & UI metadata
  rating?: number;
  reviewsCount?: number;
  imagesByColor?: ProductColorGallery[];
  neckType?: string;
  sleeves?: string;
  occasion?: string;
  fit?: string;
  sku?: string;
  modelInfo?: string;
  details?: string[];
  customerPhotos?: string[];
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  author: string;
  verified: boolean;
  productName: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  visualType: string;
  visualColor: string;
  image: string;
  department: 'fashion' | 'numismatics';
}

export const CATEGORIES: Category[] = [
  // Fashion Categories (Strict 7 as requested by user)
  {
    id: 'palazzo',
    name: 'Palazzo',
    description: 'Gracefully flared, breathable wide-leg palazzos for effortless elegance.',
    visualType: 'bodycon',
    visualColor: '#71836C',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'pants',
    name: 'Pants',
    description: 'Tailored straight-fit and contemporary trousers for everyday versatility.',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'salwar',
    name: 'Salwar',
    description: 'Heritage pleated salwars crafted in artisanal drape fabrics.',
    visualType: 'ethnic',
    visualColor: '#9A7955',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'blouse',
    name: 'Blouse',
    description: 'Exquisitely tailored silk, zari, and embroidered designer blouses.',
    visualType: 'blouse',
    visualColor: '#F3DFDF',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'kurti-pants',
    name: 'Kurti & Pants',
    description: 'Effortless designer tunic tops paired with matching tailored trousers.',
    visualType: 'kurti',
    visualColor: '#756E69',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'saree-shaper',
    name: 'Saree Shaper',
    description: 'Flawless compression silhouette underskirts for a seamless saree drape.',
    visualType: 'bodycon',
    visualColor: '#C98F91',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'nighty',
    name: 'Nighty',
    description: 'Ultra-soft premium lounge and nightwear crafted in breathable AV cotton.',
    visualType: 'dress',
    visualColor: '#E8A598',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },

  // Numismatics Categories (Preserved exact historical categories)
  { id: 'ancient-coins', name: 'ANCIENT COINS', description: 'Punched mark and ancient dynasty coins.', visualType: 'coin', visualColor: '#9A7955', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'mughal-coins', name: 'MUGHAL COINS', description: 'Silver & gold coins from Mughal emperors.', visualType: 'coin', visualColor: '#B89A67', image: '/coin_image_new.png', department: 'numismatics' },
  { id: 'british-india', name: 'BRITISH INDIA', description: 'Victoria and George VI coinage issues.', visualType: 'coin', visualColor: '#756E69', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'princely-states', name: 'PRINCELY STATES', description: 'Coinage issued by royal Indian princely states.', visualType: 'coin', visualColor: '#9A7955', image: '/coin_image_new.png', department: 'numismatics' },
  { id: 'republic-india', name: 'REPUBLIC INDIA', description: 'Post-1950 Indian coinage and proof sets.', visualType: 'coin', visualColor: '#B89A67', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'foreign-coins', name: 'FOREIGN COINS', description: 'International historical coins.', visualType: 'coin', visualColor: '#756E69', image: '/coin_image_new.png', department: 'numismatics' },
  { id: 'medals', name: 'MEDALS', description: 'Historical military & commemorative medals.', visualType: 'coin', visualColor: '#9A7955', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'paper-money', name: 'PAPER MONEY', description: 'Banknotes from British India and RBI.', visualType: 'note', visualColor: '#71836C', image: '/images/inr-100-note.png', department: 'numismatics' },
  { id: 'tokens-badges', name: 'TOKENS & BADGES', description: 'Trade tokens and heritage badges.', visualType: 'coin', visualColor: '#B89A67', image: '/coin_image_new.png', department: 'numismatics' },
  { id: 'east-india-company', name: 'EAST INDIA COMPANY', description: 'Coins struck by EIC mints.', visualType: 'coin', visualColor: '#756E69', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'sultanates', name: 'SULTANATES', description: 'Medieval Delhi and regional sultanate coins.', visualType: 'coin', visualColor: '#9A7955', image: '/coin_image_new.png', department: 'numismatics' },
  { id: 'independent-kingdoms', name: 'INDEPENDENT KINGDOMS', description: 'Maratha, Sikh, and regional kingdom coinage.', visualType: 'coin', visualColor: '#B89A67', image: '/coin_image.jpg', department: 'numismatics' }
];

// Standard Size Guide measurements helper
const STANDARD_FASHION_SIZE_GUIDE: SizeGuideItem[] = [
  { size: '34', bust: '34 in', waist: '28 in', hip: '36 in', length: '38 in' },
  { size: '36', bust: '36 in', waist: '30 in', hip: '38 in', length: '39 in' },
  { size: '38', bust: '38 in', waist: '32 in', hip: '40 in', length: '40 in' },
  { size: '40', bust: '40 in', waist: '34 in', hip: '42 in', length: '41 in' }
];

export const PRODUCTS: Product[] = [
  // ----------------------------------------------------
  // FASHION PRODUCTS (Mapped to the 7 strict categories)
  // ----------------------------------------------------
  {
    id: 'f-prod-cat-1',
    productNo: 'FP-101',
    name: 'Flared Rayon Palazzo',
    category: 'Palazzo',
    price: 2499,
    mrp: 3499,
    discount: 28,
    description: 'Crisp wide-leg palazzo tailored from pure Rayon featuring double side pockets, comfortable elastic waistband, and fluid drape.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#E8A598',
    department: 'fashion',
    rating: 4.5,
    reviewsCount: 142,
    occasion: 'Casual',
    fabric: 'Rayon',
    pattern: 'Printed',
    length: 'Ankle Length',
    packOf: 'Pack of 1',
    fabricCare: ['Cold Wash', 'Machine Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery in unworn condition with original tags intact.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#E8A598', '#2C2522'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true
  },
  {
    id: 'f-prod-cat-2',
    productNo: 'FP-102',
    name: 'Fine Cotton Tailored Pants',
    category: 'Pants',
    price: 3499,
    mrp: 4999,
    discount: 30,
    description: 'Architectural tailored straight-fit trousers engineered with pure AV Cotton, precision front pleats, and clean hook closure.',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#71836C',
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 89,
    occasion: 'Formal',
    fabric: 'AV Cotton',
    pattern: 'Plain',
    length: 'Full Length',
    packOf: 'Pack of 1',
    fabricCare: ['Machine Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery in original packaging.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#71836C', '#121110'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true
  },
  {
    id: 'f-prod-cat-3',
    productNo: 'FP-103',
    name: 'Artisanal Pleated Salwar',
    category: 'Salwar',
    price: 2899,
    mrp: 3999,
    discount: 27,
    description: 'Heritage Patiala-style pleated salwar crafted in breathable Rayon with traditional gathers and adjustable drawstring waist.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'ethnic',
    visualColor: '#9A7955',
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 176,
    occasion: 'Festive',
    fabric: 'Rayon',
    pattern: 'Printed',
    length: 'Full Length',
    packOf: 'Pack of 1',
    fabricCare: ['Cold Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery subject to condition verification.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#9A7955', '#FCFAF7'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true
  },
  {
    id: 'f-prod-cat-4',
    productNo: 'FP-104',
    name: 'Handcrafted Zari Silk Blouse',
    category: 'Blouse',
    price: 2499,
    mrp: 3299,
    discount: 24,
    description: 'Artisanal handwoven gold zari silk blouse with intricate boat neckline, padded inner lining, and back dori ties.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      '/pink_bow_top.png',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'blouse',
    visualColor: '#F3DFDF',
    department: 'fashion',
    rating: 5.0,
    reviewsCount: 112,
    occasion: 'Festive',
    fabric: 'AV Cotton',
    pattern: 'Printed',
    length: 'Regular Length',
    packOf: 'Pack of 1',
    fabricCare: ['Cold Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery if unstitched/unaltered.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#F3DFDF', '#DE7A8C'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true
  },
  {
    id: 'f-new-1',
    productNo: 'FP-105',
    name: 'Emerald Flared Palazzo Pants',
    category: 'Palazzo',
    price: 2799,
    mrp: 3899,
    discount: 28,
    description: 'Runway silhouette palazzo tailored from fluid Rayon with wide tiered flare, high-waisted elastic casing, and hidden side zip.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#2D5A43',
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 88,
    occasion: 'Evening',
    fabric: 'Rayon',
    pattern: 'Plain',
    length: 'Floor Length',
    packOf: 'Pack of 1',
    fabricCare: ['Cold Wash', 'Machine Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#2D5A43', '#1A1A1A'],
    sizes: ['34', '36', '38', '40'],
    bestseller: false
  },
  {
    id: 'f-new-2',
    productNo: 'FP-106',
    name: 'Regal Contour Saree Shaper',
    category: 'Saree Shaper',
    price: 1999,
    mrp: 2799,
    discount: 28,
    description: 'Seamless four-way stretch compression saree shaper petticoat tailored from AV Cotton blend with comfortable side slit and sturdy waistband.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      '/ivory_saree.png',
      '/rose_silk_saree.png'
    ],
    visualType: 'bodycon',
    visualColor: '#8E283B',
    department: 'fashion',
    rating: 5.0,
    reviewsCount: 142,
    occasion: 'Festive',
    fabric: 'AV Cotton',
    pattern: 'Plain',
    length: 'Ankle Length',
    packOf: 'Pack of 1',
    fabricCare: ['Machine Wash', 'Cold Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days in unopened hygiene seal.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#8E283B', '#FCFAF7', '#1A1A1A'],
    sizes: ['34', '36', '38', '40'],
    bestseller: false
  },
  {
    id: 'f-new-3',
    productNo: 'FP-107',
    name: 'Crimson Cotton Lounge Nighty',
    category: 'Nighty',
    price: 2199,
    mrp: 2999,
    discount: 26,
    description: 'Ultra-soft breathable AV Cotton full-length nighty with delicate neck lace trimming, side pocket, and relaxed airy silhouette.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'dress',
    visualColor: '#721B29',
    department: 'fashion',
    rating: 4.8,
    reviewsCount: 96,
    occasion: 'Casual',
    fabric: 'AV Cotton',
    pattern: 'Printed',
    length: 'Full Length',
    packOf: 'Pack of 1',
    fabricCare: ['Cold Wash', 'Machine Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    colors: ['#721B29', '#E8A598'],
    sizes: ['34', '36', '38', '40'],
    bestseller: false
  },
  {
    id: 'f-prod-1',
    productNo: 'FP-108',
    name: 'Floral Kurti & Pants Set',
    category: 'Kurti & Pants',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'A beautiful light floral print Rayon tunic kurti paired with matching tapered ankle-length pants and detachable sash belt.',
    image: '/floral_midi_dress.png',
    images: [
      '/floral_midi_dress.png',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'kurti',
    visualColor: '#F3DFDF',
    visualPattern: 'floral-embroidery',
    colors: ['#F3DFDF', '#D0E1FD'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.8,
    reviewsCount: 128,
    fabric: 'Rayon',
    pattern: 'Printed',
    neckType: 'V-Neck',
    sleeves: 'Half Sleeves',
    occasion: 'Casual',
    length: 'Midi Length',
    packOf: 'Pack of 2',
    fit: 'Relaxed',
    sku: 'REF-1102/554',
    modelInfo: 'The model size: 36. Height: 5.70ft / 174cm.',
    fabricCare: ['Cold Wash', 'Machine Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery in original packaging.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Soft lightweight floral print Rayon fabric.',
      'Includes matching tapered cigarette pants.',
      'Flared tiered side panels for elegant movement.',
      'Detachable matching fabric waist tie.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Pink',
        colorHex: '#F3DFDF',
        images: [
          '/floral_midi_dress.png',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
        ]
      },
      {
        colorName: 'Blue',
        colorHex: '#D0E1FD',
        images: [
          'https://images.unsplash.com/photo-1539008885128-40d24b2d6ca5?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-2',
    productNo: 'FP-109',
    name: 'Blush Pink Tailored Blouse',
    category: 'Blouse',
    price: 2499,
    mrp: 3499,
    discount: 28,
    description: 'Charming blush pink blouse featuring a delicate sweetheart neckline, front closure, and tailored wrist cuffs.',
    image: '/pink_bow_top.png',
    images: [
      '/pink_bow_top.png',
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'blouse',
    visualColor: '#FFFFFF',
    visualPattern: 'plain',
    colors: ['#F3DFDF', '#FFFFFF'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 256,
    fabric: 'AV Cotton',
    pattern: 'Plain',
    neckType: 'Sweetheart',
    sleeves: 'Long Sleeves',
    occasion: 'Festive',
    length: 'Regular Length',
    packOf: 'Pack of 1',
    fit: 'Slim Fit',
    sku: 'REF-2289/302',
    modelInfo: 'The model size: 34. Height: 5.80ft / 177cm.',
    fabricCare: ['Cold Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Premium AV Cotton fabric with a soft structural sheen.',
      'Adjustable front hook and bow neckline detailing.',
      'Long sleeves with elegant buttoned cuffs.',
      'Tailored crop length designed for saree pair.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Blush',
        colorHex: '#F3DFDF',
        images: [
          '/pink_bow_top.png',
          'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop'
        ]
      },
      {
        colorName: 'White',
        colorHex: '#FFFFFF',
        images: [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-3',
    productNo: 'FP-110',
    name: 'Cozy Cotton Sleep Nighty',
    category: 'Nighty',
    price: 1999,
    mrp: 2999,
    discount: 33,
    description: 'Cozy neutral beige breathable sleep nighty crafted from fine AV Cotton with gentle ribbed neckline and roomy side pocket.',
    image: '/ribbed_knit_sweater.png',
    images: [
      '/ribbed_knit_sweater.png',
      'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'dress',
    visualColor: '#756E69',
    visualPattern: 'plain',
    colors: ['#D1C4B9', '#121110'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.7,
    reviewsCount: 174,
    fabric: 'AV Cotton',
    pattern: 'Plain',
    neckType: 'Round Neck',
    sleeves: 'Full Sleeves',
    occasion: 'Casual',
    length: 'Full Length',
    packOf: 'Pack of 1',
    fit: 'Oversized',
    sku: 'REF-8319/401',
    modelInfo: 'The model size: 36. Height: 5.60ft / 170cm.',
    fabricCare: ['Machine Wash', 'Cold Wash'],
    returnTime: '10 Days',
    returnPolicy: 'Eligible for return within 10 days of delivery in unused condition.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Pure AV Cotton knit yarn with soft touch.',
      'Classic rounded crewneck and drop shoulders.',
      'Relaxed maxi length with comfortable wrist hems.',
      'Easy wash and durable day-to-night loungewear.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Beige',
        colorHex: '#D1C4B9',
        images: [
          '/ribbed_knit_sweater.png',
          'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-4',
    productNo: 'FP-111',
    name: 'Classic Kurti & Pants Ensemble',
    category: 'Kurti & Pants',
    price: 3999,
    mrp: 5999,
    discount: 33,
    description: 'Tailored dusk-rose Rayon matching kurti and tailored straight-leg pants delivering a polished everyday formal silhouette.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'kurti',
    visualColor: '#2C2522',
    visualPattern: 'plain',
    colors: ['#C98F91', '#756E69'],
    sizes: ['34', '36', '38', '40'],
    bestseller: false,
    department: 'fashion',
    rating: 4.6,
    reviewsCount: 221,
    fabric: 'Rayon',
    pattern: 'Plain',
    neckType: 'Collared',
    sleeves: 'Three-Quarter',
    occasion: 'Formal',
    length: 'Ankle Length',
    packOf: 'Pack of 2',
    fit: 'Flared',
    sku: 'REF-4920/121',
    modelInfo: 'The model size: 36. Height: 5.75ft / 175cm.',
    fabricCare: ['Cold Wash', 'Machine Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Tailored matching set from breathable Rayon fabric.',
      'Point collar styling and front double buttons.',
      'Flared trousers with comfortable elasticized waist.',
      'Sophisticated double pleated pockets.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Rose',
        colorHex: '#C98F91',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-5',
    productNo: 'FP-112',
    name: 'Sage Flared Rayon Palazzo',
    category: 'Palazzo',
    price: 1899,
    mrp: 2699,
    discount: 29,
    description: 'Sophisticated sage green Rayon palazzo with clean hand-pleated flare and comfortable elasticated back waist.',
    image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#71836C',
    visualPattern: 'plain',
    colors: ['#71836C', '#F4EFE9'],
    sizes: ['34', '36', '38', '40'],
    department: 'fashion',
    rating: 4.8,
    reviewsCount: 95,
    fabric: 'Rayon',
    pattern: 'Plain',
    neckType: 'Round Neck',
    sleeves: 'Sleeveless',
    occasion: 'Casual',
    length: 'Floor Length',
    packOf: 'Pack of 1',
    fit: 'Tailored',
    sku: 'REF-7890/409',
    modelInfo: 'The model size: 36. Height: 5.70ft / 174cm.',
    fabricCare: ['Cold Wash', 'Machine Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Pure breathable Rayon fabric.',
      'Flared wide-leg pattern with double side pockets.',
      'High-rise elasticated waistband for all-day comfort.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Sage',
        colorHex: '#71836C',
        images: [
          'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-6',
    productNo: 'FP-113',
    name: 'Midnight Tailored Formal Pants',
    category: 'Pants',
    price: 2199,
    mrp: 3199,
    discount: 31,
    description: 'High-waisted tailored straight-fit formal pants in dark espresso, complete with double front pleats and side slip pockets.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#2C2522',
    colors: ['#2C2522'],
    sizes: ['34', '36', '38', '40'],
    department: 'fashion',
    rating: 4.5,
    reviewsCount: 45,
    fabric: 'AV Cotton',
    pattern: 'Plain',
    neckType: 'Round Neck',
    sleeves: 'Sleeveless',
    occasion: 'Formal',
    length: 'Full Length',
    packOf: 'Pack of 1',
    fit: 'Tailored',
    sku: 'REF-6628/109',
    modelInfo: 'The model size: 36. Height: 5.65ft / 172cm.',
    fabricCare: ['Machine Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Tailored straight-leg structure in dark espresso color.',
      'Double front pleats with back pocket detail.',
      'High-waisted fit with invisible hook closure.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Espresso',
        colorHex: '#2C2522',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-7',
    productNo: 'FP-114',
    name: 'Artisan Embroidered Silk Blouse',
    category: 'Blouse',
    price: 2699,
    mrp: 3899,
    discount: 30,
    description: 'Heritage handloom silk blouse styled with rich gold zari floral embroidery and comfortable inner cotton lining.',
    image: '/rose_silk_saree.png',
    images: [
      '/rose_silk_saree.png',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'blouse',
    visualColor: '#C98F91',
    visualPattern: 'floral-embroidery',
    colors: ['#DE7A8C', '#B89A67'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 5.0,
    reviewsCount: 198,
    fabric: 'AV Cotton',
    pattern: 'Printed',
    neckType: 'Boat Neck',
    sleeves: 'Three-Quarter',
    occasion: 'Festive',
    length: 'Regular Length',
    packOf: 'Pack of 1',
    fit: 'Tailored',
    sku: 'REF-4491/220',
    modelInfo: 'The model size: 36. Height: 5.70ft / 174cm.',
    fabricCare: ['Cold Wash', 'Brush Care'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days of delivery.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Dense handwoven gold zari work throughout.',
      'Padded inner lining for seamless comfort.',
      'Back tie closure with handcrafted tassels.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Rose',
        colorHex: '#DE7A8C',
        images: ['/rose_silk_saree.png']
      }
    ]
  },
  {
    id: 'f-prod-8',
    productNo: 'FP-115',
    name: 'Ivory Mermaid Saree Shaper',
    category: 'Saree Shaper',
    price: 1899,
    mrp: 2699,
    discount: 29,
    description: 'Comfort-stretch ivory mermaid silhouette saree shaper with elasticized drawcord, breathable AV Cotton blend fabric, and seamless hip contouring.',
    image: '/ivory_saree.png',
    images: [
      '/ivory_saree.png',
      'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=600&auto=format&fit=crop'
    ],
    visualType: 'bodycon',
    visualColor: '#F4EFE9',
    visualPattern: 'plain',
    colors: ['#FCFAF7'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 88,
    fabric: 'AV Cotton',
    pattern: 'Plain',
    neckType: 'Round Neck',
    sleeves: 'Sleeveless',
    occasion: 'Festive',
    length: 'Ankle Length',
    packOf: 'Pack of 1',
    fit: 'Slim Fit',
    sku: 'REF-9928/502',
    modelInfo: 'The model size: 36. Height: 5.75ft / 175cm.',
    fabricCare: ['Machine Wash', 'Cold Wash'],
    returnTime: '7 Days',
    returnPolicy: 'Eligible for return within 7 days in original sealed hygiene pack.',
    sizeGuide: STANDARD_FASHION_SIZE_GUIDE,
    details: [
      'Engineered mermaid flare for fluid ease of movement.',
      'Broad comfort waistband that supports heavy sarees.',
      'Side slit for natural walking stride.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Ivory',
        colorHex: '#FCFAF7',
        images: ['/ivory_saree.png']
      }
    ]
  },

  // ----------------------------------------------------
  // NUMISMATICS PRODUCTS (Preserved with complete schema)
  // ----------------------------------------------------
  {
    id: 'n-prod-1',
    productNo: 'NP-201',
    name: '1954 REPUBLIC OF INDIA ONE RUPEE SILVER COIN',
    category: 'REPUBLIC INDIA',
    price: 12500,
    mrp: 15000,
    discount: 16,
    description: 'A historic Indian silver coin preserved for collectors, featuring an archival-era Ashoka Lion Capital design and distinctive Bombay mint details.',
    image: '/coin_image_new.png',
    images: [
      '/coin_image_new.png',
      '/coin_image.jpg',
      '/coin_image_new.png'
    ],
    visualType: 'coin',
    visualColor: '#B89A67',
    visualPattern: 'antique-metallic',
    bestseller: true,
    department: 'numismatics',
    rarity: 'Rare',
    era: 'Republic India',
    year: '1954',
    denomination: '₹1',
    material: 'Silver',
    weight: '11.66 g',
    condition: 'Extremely Fine',
    mint: 'Mumbai Mint',
    shippingCharges: 'Free Shipping',
    returnPolicy: 'Certified archival item eligible for return within 3 days with untampered certificate security seal.',
    collectionLabel: 'RARE COLLECTION'
  },
  {
    id: 'n-prod-2',
    productNo: 'NP-202',
    name: 'KING GEORGE VI SILVER RUPEE',
    category: 'BRITISH INDIA',
    price: 3500,
    mrp: 4500,
    discount: 22,
    description: 'British India King George VI Silver One Rupee coin. Beautiful original luster, minted in Bombay in 1940. A historic silver collector\'s treasure.',
    image: '/coin_image.jpg',
    images: [
      '/coin_image.jpg',
      '/coin_image_new.png'
    ],
    visualType: 'coin',
    visualColor: '#9A7955',
    visualPattern: 'antique-metallic',
    bestseller: true,
    department: 'numismatics',
    rarity: 'Scarce',
    era: 'British India',
    year: '1940',
    denomination: '₹1',
    material: 'Silver',
    weight: '11.66 g',
    condition: 'Very Fine',
    mint: 'Kolkata Mint',
    shippingCharges: '₹99',
    returnPolicy: 'Eligible for return within 3 days with anti-tamper security tag intact.',
    collectionLabel: 'COLLECTOR\'S EDIT'
  },
  {
    id: 'n-prod-3',
    productNo: 'NP-203',
    name: 'BRITISH INDIA 100 RUPEE ASHOKA NOTE',
    category: 'PAPER MONEY',
    price: 18500,
    mrp: 24000,
    discount: 23,
    description: 'Rare 100 Rupee paper currency note with purple watermark border and Ashoka emblem. Preserved crisp uncirculated paper fiber condition.',
    image: '/images/inr-100-note.png',
    images: [
      '/images/inr-100-note.png'
    ],
    visualType: 'note',
    visualColor: '#71836C',
    visualPattern: 'currency-green',
    bestseller: true,
    department: 'numismatics',
    rarity: 'Very Rare',
    era: 'Republic India',
    year: '1950',
    denomination: '₹100',
    material: 'Paper',
    weight: '1.2 g',
    condition: 'Uncirculated',
    mint: 'Nasik Mint',
    shippingCharges: 'Free Shipping',
    returnPolicy: 'Fully insured currency note eligible for return within 3 days in original display slab.',
    collectionLabel: 'HISTORIC CURRENCY'
  },
  {
    id: 'n-prod-4',
    productNo: 'NP-204',
    name: 'VICTORIA EMPRESS TWO ANNAS',
    category: 'BRITISH INDIA',
    price: 8500,
    mrp: 12000,
    discount: 29,
    description: 'Queen Victoria Empress silver Two Annas coin dated 1885. Exceedingly sharp details with fine toning. Highly sought after by advanced numismatists.',
    image: '/coin_image.jpg',
    images: [
      '/coin_image.jpg',
      '/coin_image_new.png'
    ],
    visualType: 'coin',
    visualColor: '#B89A67',
    visualPattern: 'antique-metallic',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Rare',
    era: 'British India',
    year: '1885',
    denomination: '2 Annas',
    material: 'Silver',
    weight: '1.46 g',
    condition: 'Fine',
    mint: 'Kolkata Mint',
    shippingCharges: '₹149',
    returnPolicy: 'Eligible for return within 3 days with untampered certificate security seal.',
    collectionLabel: 'ROYAL HERITAGE'
  },
  {
    id: 'n-prod-5',
    productNo: 'NP-205',
    name: 'MUGHAL SHAH ALAM II RUPEE',
    category: 'MUGHAL COINS',
    price: 14200,
    mrp: 18000,
    discount: 21,
    description: 'Mughal Empire Shah Alam II Silver Rupee coin, minted at Murshidabad, RY 19. Complete inscriptions in Persian, high grading status.',
    image: '/coin_image_new.png',
    images: [
      '/coin_image_new.png',
      '/coin_image.jpg'
    ],
    visualType: 'coin',
    visualColor: '#9A7955',
    visualPattern: 'antique-metallic',
    bestseller: true,
    department: 'numismatics',
    rarity: 'Very Rare',
    era: 'Mughal Empire',
    year: '1785',
    denomination: '1 Rupee',
    material: 'Silver',
    weight: '11.4 g',
    condition: 'Very Fine',
    mint: 'Hyderabad Mint',
    shippingCharges: 'Free Shipping',
    returnPolicy: 'Certified archival item eligible for return within 3 days with untampered security seal.',
    collectionLabel: 'DYNASTY SELECTION'
  },
  {
    id: 'n-prod-6',
    productNo: 'NP-206',
    name: 'BRITISH INDIA 5 RUPEE GEORGE VI NOTE',
    category: 'PAPER MONEY',
    price: 6500,
    mrp: 8500,
    discount: 23,
    description: 'King George VI Portrait 5 Rupee currency note. Issued in 1943, signed by CD Deshmukh. Remarkable condition, showing original crisp paper fibers.',
    image: '/images/inr-100-note.png',
    images: [
      '/images/inr-100-note.png'
    ],
    visualType: 'note',
    visualColor: '#71836C',
    visualPattern: 'currency-green',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Rare',
    era: 'British India',
    year: '1943',
    denomination: '₹5',
    material: 'Paper',
    weight: '1.0 g',
    condition: 'Very Good',
    mint: 'Nasik Mint',
    shippingCharges: '₹99',
    returnPolicy: 'Eligible for return within 3 days in original collector sleeve.',
    collectionLabel: 'VINTAGE BANKNOTE'
  },
  {
    id: 'n-prod-7',
    productNo: 'NP-207',
    name: 'REPUBLIC INDIA 1950 FIRST COINAGE PROOF SET',
    category: 'REPUBLIC INDIA',
    price: 22500,
    mrp: 29000,
    discount: 22,
    description: 'Republic of India 1950 First Coinage Set. Features the iconic Ashoka Lion capital emblem on 7 original coins. Housed in a custom velvet display booklet.',
    image: '/coin_image_new.png',
    images: [
      '/coin_image_new.png',
      '/coin_image.jpg'
    ],
    visualType: 'coin',
    visualColor: '#B89A67',
    visualPattern: 'antique-metallic',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Extremely Rare',
    era: 'Republic India',
    year: '1950',
    denomination: '7 Coin Set',
    material: 'Nickel',
    weight: '45.0 g',
    condition: 'Proof Uncirculated',
    mint: 'Mumbai Mint',
    shippingCharges: 'Free Shipping',
    returnPolicy: 'Proof set eligible for return within 3 days in un-opened museum casing.',
    collectionLabel: 'PROOF COLLECTION'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    rating: 5,
    text: "The fabric quality of the Rayon Palazzo is outstanding. It has a beautiful weight to it and the drape is elegant and fluid. Highly recommend Aadhya!",
    author: "Priyah Sharma",
    verified: true,
    productName: "Flared Rayon Palazzo",
    date: "Aug 12, 2026"
  },
  {
    id: 'rev-2',
    rating: 5,
    text: "Truly editorial piece! I wore the Kurti & Pants set for a gallery exhibition launch and received endless compliments. The drape flows naturally and looks very high-fashion.",
    author: "Aditi Roy",
    verified: true,
    productName: "Floral Kurti & Pants Set",
    date: "Aug 05, 2026"
  },
  {
    id: 'rev-3',
    rating: 5,
    text: "I was hesitant to buy historical coins online, but the George VI Silver Rupee arrived with clear certificates, perfect grading, and was packaged exquisitely. A secure and premium collection.",
    author: "Rohan Mehta",
    verified: true,
    productName: "King George VI Silver Rupee",
    date: "Jul 28, 2026"
  },
  {
    id: 'rev-4',
    rating: 5,
    text: "The details on the Shah Alam II Rupee are stunning. Original patina and deep historical weight. The coin animation preview was very accurate to the physical piece.",
    author: "Devendra Singh",
    verified: true,
    productName: "Mughal Shah Alam II Rupee",
    date: "Jul 24, 2026"
  },
  {
    id: 'rev-5',
    rating: 5,
    text: "I ordered the Saree Shaper and it completely transformed the saree drape! Super comfortable fabric with zero bulkiness. Absolutely essential.",
    author: "Kavita Nair",
    verified: true,
    productName: "Regal Contour Saree Shaper",
    date: "Aug 15, 2026"
  }
];

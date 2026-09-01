export interface ProductColorGallery {
  colorName: string;
  colorHex: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  description: string;
  image: string; // Used for standard thumbnail/image panels
  visualType: 'saree' | 'dress' | 'bodycon' | 'ethnic' | 'blouse' | 'kurti' | 'lehenga' | 'coin' | 'note'; // For premium vector rendering
  visualColor?: string; // Hex color for the SVG garment/coin path
  visualPattern?: 'gold-brocade' | 'floral-embroidery' | 'silk-sheen' | 'plain' | 'antique-metallic' | 'currency-green' | 'rupee-blue';
  colors?: string[];
  sizes?: string[];
  bestseller?: boolean;
  department: 'fashion' | 'numismatics';
  rarity?: 'Common' | 'Scarce' | 'Rare' | 'Very Rare' | 'Extremely Rare'; // For Numismatics
  era?: string; // For Numismatics e.g. "British India", "Mughal Empire"
  year?: string; // For Numismatics
  denomination?: string; // For Numismatics e.g. "₹1", "₹100"
  material?: string; // For Numismatics e.g. "Silver", "Gold", "Paper"
  weight?: string; // For Numismatics e.g. "11.66 g"
  condition?: string; // For Numismatics e.g. "Extremely Fine", "Uncirculated"
  mint?: string; // For Numismatics e.g. "Mumbai", "Bombay", "Nasik"
  collectionLabel?: string; // For Hero showcase
  rating?: number; // UI/UX star ratings (1-5)
  reviewsCount?: number; // UI/UX reviews count
  
  // Editorial specifications and color galleries
  imagesByColor?: ProductColorGallery[];
  fabric?: string;
  neckType?: string;
  sleeves?: string;
  occasion?: string;
  length?: string;
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
  image: string; // Curated Unsplash Campaign Shot
  department: 'fashion' | 'numismatics';
}

export const CATEGORIES: Category[] = [
  // Fashion Categories (Strict 6 from Reference)
  {
    id: 'dresses',
    name: 'Dresses',
    description: 'Modern silhouettes designed for everyday elegance.',
    visualType: 'dress',
    visualColor: '#71836C',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'tops-blouses',
    name: 'Tops & Blouses',
    description: 'Exquisitely tailored shirts, overlays and blouses.',
    visualType: 'blouse',
    visualColor: '#F3DFDF',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'sweaters',
    name: 'Sweaters',
    description: 'Cozy woolens, cardigans and ribbed sweaters.',
    visualType: 'kurti',
    visualColor: '#756E69',
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'pants',
    name: 'Pants',
    description: 'Sophisticated tailored trousers and casual pants.',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'coord-sets',
    name: 'Co-ord Sets',
    description: 'Effortless matching tops and pants ensembles.',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },
  {
    id: 'occasion-wear',
    name: 'Occasion Wear',
    description: 'Heritage sarees, lehengas and festival coordinates.',
    visualType: 'saree',
    visualColor: '#C98F91',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    department: 'fashion'
  },

  // Numismatics Categories (Curated Content Reference)
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

export const PRODUCTS: Product[] = [
  {
    id: 'f-prod-1',
    name: 'Floral Midi Dress',
    category: 'Dresses',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'A beautiful light floral print georgette midi dress with tiered ruffle detailing and an elegant waist sash.',
    image: '/floral_midi_dress.png',
    visualType: 'dress',
    visualColor: '#F3DFDF',
    visualPattern: 'floral-embroidery',
    colors: ['#F3DFDF', '#D0E1FD'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.8,
    reviewsCount: 128,
    fabric: 'Chiffon',
    neckType: 'V-Neck',
    sleeves: 'Half Sleeves',
    occasion: 'Casual',
    length: 'Midi',
    fit: 'Relaxed',
    sku: 'REF-1102/554',
    modelInfo: 'The model size: 36. Height: 5.70ft / 174cm.',
    details: [
      'Soft lightweight floral print chiffon fabric.',
      'Flared tiered ruffle panels for elegant movement.',
      'Inner satin lining for absolute comfort.',
      'Includes detachable matching fabric waist sash.'
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
    name: 'Pink Bow Top',
    category: 'Tops & Blouses',
    price: 2499,
    mrp: 3499,
    discount: 28,
    description: 'Charming blush pink top featuring a delicate bow neckline detailing, balloon sleeves, and fitted cuffs.',
    image: '/pink_bow_top.png',
    visualType: 'blouse',
    visualColor: '#FFFFFF',
    visualPattern: 'plain',
    colors: ['#F3DFDF', '#FFFFFF'],
    sizes: ['34', '36', '38', '40'],
    bestseller: true,
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 256,
    fabric: 'Silk',
    neckType: 'Sweetheart',
    sleeves: 'Long Sleeves',
    occasion: 'Festive',
    length: 'Crop',
    fit: 'Slim Fit',
    sku: 'REF-2289/302',
    modelInfo: 'The model size: 34. Height: 5.80ft / 177cm.',
    details: [
      'Premium silk fabric with a soft structural sheen.',
      'Adjustable front bow closure at the neckline.',
      'Long balloon sleeves with elegant buttoned cuffs.',
      'Flattering crop length designed for high-waisted styling.'
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
    name: 'Ribbed Knit Sweater',
    category: 'Sweaters',
    price: 2999,
    mrp: 3999,
    discount: 25,
    description: 'Cozy neutral beige cropped knit pullover styled with vertical ribbing, a relaxed crewneck, and soft drop shoulders.',
    image: '/ribbed_knit_sweater.png',
    visualType: 'kurti',
    visualColor: '#756E69',
    visualPattern: 'plain',
    colors: ['#D1C4B9', '#121110'],
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    department: 'fashion',
    rating: 4.7,
    reviewsCount: 174,
    fabric: 'Wool Blend',
    neckType: 'Round Neck',
    sleeves: 'Full Sleeves',
    occasion: 'Casual',
    length: 'Crop',
    fit: 'Oversized',
    sku: 'REF-8319/401',
    modelInfo: 'The model size: M. Height: 5.60ft / 170cm.',
    details: [
      'Premium wool blend yarn with soft touch ribbing.',
      'Classic rounded crewneck and dropped shoulders.',
      'Cozy oversized silhouette with comfortable rib cuffs.',
      'Easy wash and long-term durability.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Beige',
        colorHex: '#D1C4B9',
        images: [
          '/ribbed_knit_sweater.png',
          'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1620799139587-2159d7276375?q=80&w=600&auto=format&fit=crop'
        ]
      },
      {
        colorName: 'Black',
        colorHex: '#121110',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-4',
    name: 'Chic Co-ord Set',
    category: 'Co-ord Sets',
    price: 3999,
    mrp: 5999,
    discount: 33,
    description: 'Premium dusk-rose utility linen matching blouse and trouser set, delivering a polished modern structural silhouette.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    visualPattern: 'plain',
    colors: ['#C98F91', '#756E69'],
    sizes: ['34', '36', '38', '40'],
    bestseller: false,
    department: 'fashion',
    rating: 4.6,
    reviewsCount: 221,
    fabric: 'Linen',
    neckType: 'Collared',
    sleeves: 'Three-Quarter',
    occasion: 'Formal',
    length: 'Maxi',
    fit: 'Flared',
    sku: 'REF-4920/121',
    modelInfo: 'The model size: 36. Height: 5.75ft / 175cm.',
    details: [
      'Tailored matching set from breathable utility linen.',
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
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-5',
    name: 'Sage Linen Kurti',
    category: 'Occasion Wear',
    price: 1599,
    mrp: 2299,
    discount: 30,
    description: 'Sophisticated sage green organic linen daily wear kurti with clean Mandarin collar and handwoven silver pin-stripes.',
    image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=600&auto=format&fit=crop',
    visualType: 'ethnic',
    visualColor: '#71836C',
    visualPattern: 'plain',
    colors: ['#71836C', '#F4EFE9'],
    sizes: ['S', 'M', 'L', 'XL'],
    department: 'fashion',
    rating: 4.8,
    reviewsCount: 95,
    fabric: 'Linen',
    neckType: 'Collared',
    sleeves: 'Three-Quarter',
    occasion: 'Festive',
    length: 'Midi',
    fit: 'Tailored',
    sku: 'REF-7890/409',
    modelInfo: 'The model size: M. Height: 5.70ft / 174cm.',
    details: [
      'Pure organic linen with metallic silver pin-stripes.',
      'Mandarin button collar and double side slits.',
      'Three-quarter length sleeves with folded cuffs.',
      'Comfortable lightweight fit perfect for festive curation.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Sage',
        colorHex: '#71836C',
        images: [
          'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-6',
    name: 'Midnight Wide Trousers',
    category: 'Pants',
    price: 1899,
    mrp: 2699,
    discount: 29,
    description: 'High-waisted wide-leg tailored trousers in deep espresso, complete with double front pleats and side slip pockets.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    colors: ['#2C2522'],
    sizes: ['XS', 'S', 'M', 'L'],
    department: 'fashion',
    rating: 4.5,
    reviewsCount: 45,
    fabric: 'Cotton',
    neckType: 'Round Neck',
    sleeves: 'Sleeveless',
    occasion: 'Formal',
    length: 'Maxi',
    fit: 'Flared',
    sku: 'REF-6628/109',
    modelInfo: 'The model size: S. Height: 5.65ft / 172cm.',
    details: [
      'Tailored wide leg structure in dark espresso color.',
      'Double front pleats with back pockets details.',
      'High-waisted fit with invisible hook closures.',
      'Smooth premium cotton fabric blend.'
    ],
    customerPhotos: [],
    imagesByColor: [
      {
        colorName: 'Espresso',
        colorHex: '#2C2522',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-7',
    name: 'Rose Silk Saree',
    category: 'Occasion Wear',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'A classic heritage Kanjivaram rose pink silk saree with dense gold zari handwoven checks and a solid matching border.',
    image: '/rose_silk_saree.png',
    visualType: 'saree',
    visualColor: '#C98F91',
    visualPattern: 'floral-embroidery',
    colors: ['#DE7A8C', '#B89A67'],
    sizes: ['Free Size'],
    bestseller: true,
    department: 'fashion',
    rating: 5.0,
    reviewsCount: 198,
    fabric: 'Raw Silk',
    neckType: 'Boat Neck',
    sleeves: 'Three-Quarter',
    occasion: 'Wedding',
    length: 'Maxi',
    fit: 'Tailored',
    sku: 'REF-4491/220',
    modelInfo: 'The model size: Free Size. Height: 5.70ft / 174cm.',
    details: [
      'Dense handwoven gold zari checks throughout.',
      'Classic matching running blouse piece included.',
      'Rich contrast pallu with detailed floral motifs.',
      'Made from authenticated premium raw silk.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Rose',
        colorHex: '#DE7A8C',
        images: [
          '/rose_silk_saree.png',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=600&auto=format&fit=crop'
        ]
      },
      {
        colorName: 'Gold',
        colorHex: '#B89A67',
        images: [
          'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },
  {
    id: 'f-prod-8',
    name: 'Ivory Saree',
    category: 'Occasion Wear',
    price: 3200,
    mrp: 4799,
    discount: 33,
    description: 'Layered fluid ivory georgette dress with a structured single shoulder strap and modern asymmetrical drapes.',
    image: '/ivory_saree.png',
    visualType: 'dress',
    visualColor: '#F4EFE9',
    visualPattern: 'silk-sheen',
    colors: ['#FCFAF7'],
    sizes: ['Free Size'],
    bestseller: true,
    department: 'fashion',
    rating: 4.9,
    reviewsCount: 88,
    fabric: 'Chiffon',
    neckType: 'Boat Neck',
    sleeves: 'Sleeveless',
    occasion: 'Evening',
    length: 'Maxi',
    fit: 'Flared',
    sku: 'REF-9928/502',
    modelInfo: 'The model size: Free Size. Height: 5.75ft / 175cm.',
    details: [
      'Layered asymmetrical drapes in fluid ivory georgette.',
      'Single shoulder strap with structured pleated details.',
      'Muted ivory tint with premium satin feel.',
      'Perfect for contemporary evening and occasion wear.'
    ],
    customerPhotos: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop'
    ],
    imagesByColor: [
      {
        colorName: 'Ivory',
        colorHex: '#FCFAF7',
        images: [
          '/ivory_saree.png',
          'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
        ]
      }
    ]
  },

  // Numismatics Products (Coins & notes - Preserved exact business fields)
  {
    id: 'n-prod-1',
    name: '1954 REPUBLIC OF INDIA ONE RUPEE SILVER COIN',
    category: 'RARE COINS',
    price: 12500,
    mrp: 15000,
    discount: 16,
    description: 'A historic Indian silver coin preserved for collectors, featuring an archival-era Ashoka Lion Capital design and distinctive Bombay mint details.',
    image: '/coin_image_new.png',
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
    mint: 'Mumbai',
    collectionLabel: 'RARE COLLECTION'
  },
  {
    id: 'n-prod-2',
    name: 'KING GEORGE VI SILVER RUPEE',
    category: 'INDIAN COINS',
    price: 3500,
    mrp: 4500,
    discount: 22,
    description: 'British India King George VI Silver One Rupee coin. Beautiful original luster, minted in Bombay in 1940. A historic silver collector\'s treasure.',
    image: '/coin_image.jpg',
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
    mint: 'Bombay',
    collectionLabel: 'COLLECTOR\'S EDIT'
  },
  {
    id: 'n-prod-3',
    name: 'BRITISH INDIA 100 RUPEE ASHOKA NOTE',
    category: 'CURRENCY NOTES',
    price: 18500,
    mrp: 24000,
    discount: 23,
    description: 'Rare 100 Rupee paper currency note with purple watermark border and Ashoka emblem. Preserved crisp uncirculated paper fiber condition.',
    image: '/images/inr-100-note.png',
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
    mint: 'Nasik',
    collectionLabel: 'HISTORIC CURRENCY'
  },
  {
    id: 'n-prod-4',
    name: 'VICTORIA EMPRESS TWO ANNAS',
    category: 'RARE COINS',
    price: 8500,
    mrp: 12000,
    discount: 29,
    description: 'Queen Victoria Empress silver Two Annas coin dated 1885. Exceedingly sharp details with fine toning. Highly sought after by advanced numismatists.',
    image: '/coin_image.jpg',
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
    mint: 'Kolkata',
    collectionLabel: 'ROYAL HERITAGE'
  },
  {
    id: 'n-prod-5',
    name: 'MUGHAL SHAH ALAM II RUPEE',
    category: 'RARE COINS',
    price: 14200,
    mrp: 18000,
    discount: 21,
    description: 'Mughal Empire Shah Alam II Silver Rupee coin, minted at Murshidabad, RY 19. Complete inscriptions in Persian, high grading status.',
    image: '/coin_image_new.png',
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
    mint: 'Murshidabad',
    collectionLabel: 'DYNASTY SELECTION'
  },
  {
    id: 'n-prod-6',
    name: 'BRITISH INDIA 5 RUPEE GEORGE VI NOTE',
    category: 'CURRENCY NOTES',
    price: 6500,
    mrp: 8500,
    discount: 23,
    description: 'King George VI Portrait 5 Rupee currency note. Issued in 1943, signed by CD Deshmukh. Remarkable condition, showing original crisp paper fibers.',
    image: '/images/inr-100-note.png',
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
    mint: 'Nasik',
    collectionLabel: 'VINTAGE BANKNOTE'
  },
  {
    id: 'n-prod-7',
    name: 'REPUBLIC INDIA 1950 FIRST COINAGE PROOF SET',
    category: 'COMMEMORATIVE COINS',
    price: 22500,
    mrp: 29000,
    discount: 22,
    description: 'Republic of India 1950 First Coinage Set. Features the iconic Ashoka Lion capital emblem on 7 original coins. Housed in a custom velvet display booklet.',
    image: '/coin_image_new.png',
    visualType: 'coin',
    visualColor: '#B89A67',
    visualPattern: 'antique-metallic',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Extremely Rare',
    era: 'Republic India',
    year: '1950',
    denomination: '7 Coin Set',
    material: 'Mixed Metal',
    weight: '45.0 g',
    condition: 'Proof Uncirculated',
    mint: 'Mumbai',
    collectionLabel: 'PROOF COLLECTION'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    rating: 5,
    text: "The fabric quality of the Rose Silk Saree is outstanding. It has a beautiful weight to it and the zari work is elegant and subtle, not too shiny. Highly recommend Aadhya!",
    author: "Priyah Sharma",
    verified: true,
    productName: "The Rose Silk Saree",
    date: "Aug 12, 2026"
  },
  {
    id: 'rev-2',
    rating: 5,
    text: "Truly editorial piece! I wore the Ivory Georgette Drape for an art exhibition launch and received endless compliments. The drape flows naturally and looks very high-fashion.",
    author: "Aditi Roy",
    verified: true,
    productName: "Ivory Georgette Drape",
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
    text: "I ordered the Scarlet Velvet Lehenga for a festive evening. Fits like a glove. The hand embroidery is dense, rich, and retains a heritage charm.",
    author: "Kavita Nair",
    verified: true,
    productName: "Scarlet Velvet Lehenga",
    date: "Aug 15, 2026"
  }
];

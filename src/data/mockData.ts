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
  rating?: number; // UI/UX star ratings (1-5)
  reviewsCount?: number; // UI/UX reviews count
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

  // Numismatics Categories (Curated)
  { id: 'indian-coins', name: 'INDIAN COINS', description: 'Historic Indian coinage from ancient to modern eras.', visualType: 'coin', visualColor: '#9A7955', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'rare-coins', name: 'RARE COINS', description: 'Exceedingly scarce mintages with historical provenance.', visualType: 'coin', visualColor: '#B89A67', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'commemorative', name: 'COMMEMORATIVE COINS', description: 'Special issue coinage celebrating pivotal milestones.', visualType: 'coin', visualColor: '#756E69', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'currency-notes', name: 'CURRENCY NOTES', description: 'Paper currency notes from British India and RBI.', visualType: 'note', visualColor: '#71836C', image: '/coin_image.jpg', department: 'numismatics' },
  { id: 'collectors-picks', name: 'COLLECTOR\'S PICKS', description: 'Curated sets and graded numismatic treasures.', visualType: 'coin', visualColor: '#2C2522', image: '/coin_image.jpg', department: 'numismatics' }
];

export const PRODUCTS: Product[] = [
  // Fashion Products (Strict 4 from reference grid - All Premium Womenswear on solid white studio backgrounds)
  {
    id: 'f-prod-1',
    name: 'Floral Midi Dress',
    category: 'Dresses',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'A beautiful light floral print georgette midi dress with tiered ruffle detailing and an elegant waist sash.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
    visualType: 'dress',
    visualColor: '#F3DFDF',
    visualPattern: 'floral-embroidery',
    colors: ['#F3DFDF', '#C98F91'],
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    department: 'fashion',
    rating: 4,
    reviewsCount: 128
  },
  {
    id: 'f-prod-2',
    name: 'Elegant Puff Sleeve Top',
    category: 'Tops & Blouses',
    price: 2499,
    mrp: 3499,
    discount: 28,
    description: 'Tailored ivory cotton shirt featuring structural balloon puff sleeves, front mother-of-pearl buttons and clean cuffs.',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop',
    visualType: 'blouse',
    visualColor: '#FFFFFF',
    visualPattern: 'plain',
    colors: ['#FFFFFF', '#FCFAF7'],
    sizes: ['XS', 'S', 'M', 'L'],
    bestseller: true,
    department: 'fashion',
    rating: 4,
    reviewsCount: 256
  },
  {
    id: 'f-prod-3',
    name: 'Ribbed Knit Sweater',
    category: 'Sweaters',
    price: 2999,
    mrp: 3999,
    discount: 25,
    description: 'Cozy neutral beige cropped knit pullover styled with vertical ribbing, a relaxed crewneck, and soft drop shoulders.',
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600&auto=format&fit=crop',
    visualType: 'kurti',
    visualColor: '#756E69',
    visualPattern: 'plain',
    colors: ['#756E69', '#2C2522'],
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    department: 'fashion',
    rating: 4,
    reviewsCount: 174
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
    colors: ['#2C2522', '#756E69'],
    sizes: ['XS', 'S', 'M', 'L'],
    bestseller: true,
    department: 'fashion',
    rating: 4,
    reviewsCount: 221
  },

  // Supporting Editorial Fashion Items (All Premium Womenswear on solid white studio backgrounds)
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
    rating: 4,
    reviewsCount: 95
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
    rating: 4,
    reviewsCount: 45
  },
  {
    id: 'f-prod-7',
    name: 'The Rose Silk Saree',
    category: 'Occasion Wear',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'A classic heritage Kanjivaram rose pink silk saree with dense gold zari handwoven checks and a solid matching border.',
    image: 'https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=600&auto=format&fit=crop',
    visualType: 'saree',
    visualColor: '#C98F91',
    visualPattern: 'floral-embroidery',
    colors: ['#C98F91', '#FFFFFF'],
    sizes: ['Free Size'],
    bestseller: true,
    department: 'fashion',
    rating: 5,
    reviewsCount: 198
  },
  {
    id: 'f-prod-8',
    name: 'Ivory Georgette Drape',
    category: 'Dresses',
    price: 3200,
    mrp: 4799,
    discount: 33,
    description: 'Layered fluid ivory georgette dress with a structured single shoulder strap and modern asymmetrical drapes.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    visualType: 'dress',
    visualColor: '#F4EFE9',
    visualPattern: 'silk-sheen',
    colors: ['#F4EFE9'],
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    department: 'fashion',
    rating: 5,
    reviewsCount: 88
  },

  // Numismatics Products (Coins & notes - Preserved exact business fields)
  {
    id: 'n-prod-1',
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
    year: '1940'
  },
  {
    id: 'n-prod-2',
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
    year: '1885'
  },
  {
    id: 'n-prod-3',
    name: 'MUGHAL SHAH ALAM II RUPEE',
    category: 'RARE COINS',
    price: 12500,
    mrp: 15000,
    discount: 16,
    description: 'Mughal Empire Shah Alam II Silver Rupee coin, minted at Murshidabad, RY 19. Complete inscriptions in Persian, high grading status.',
    image: '/coin_image.jpg',
    visualType: 'coin',
    visualColor: '#9A7955',
    visualPattern: 'antique-metallic',
    bestseller: true,
    department: 'numismatics',
    rarity: 'Very Rare',
    era: 'Mughal Empire',
    year: 'AH 1202 / RY 19'
  },
  {
    id: 'n-prod-4',
    name: 'BRITISH INDIA 5 RUPEE PAPER NOTE',
    category: 'CURRENCY NOTES',
    price: 9500,
    mrp: 13000,
    discount: 26,
    description: 'King George VI Portrait 5 Rupee currency note. Issued in 1943, signed by CD Deshmukh. Remarkable condition, showing original crisp paper fibers.',
    image: 'note_george.jpg',
    visualType: 'note',
    visualColor: '#71836C',
    visualPattern: 'currency-green',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Rare',
    era: 'British India',
    year: '1943'
  },
  {
    id: 'n-prod-5',
    name: 'REPUBLIC INDIA FIRST ISSUES SET',
    category: 'COLLECTOR\'S PICKS',
    price: 4999,
    mrp: 6500,
    discount: 23,
    description: 'Republic of India 1950 First Coinage Set. Features the iconic Ashoka Lion capital emblem on 7 original coins. Housed in a custom velvet display booklet.',
    image: '/coin_image.jpg',
    visualType: 'coin',
    visualColor: '#B89A67',
    visualPattern: 'antique-metallic',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Scarce',
    era: 'Republic India',
    year: '1950'
  },
  {
    id: 'n-prod-6',
    name: 'RBI 10 RUPEE BOAT NOTE',
    category: 'CURRENCY NOTES',
    price: 1800,
    mrp: 2500,
    discount: 28,
    description: 'Early Reserve Bank of India 10 Rupee note featuring the dhow/boat illustration on reverse. Signed by Governor PC Bhattacharya.',
    image: 'note_boat.jpg',
    visualType: 'note',
    visualColor: '#C98F91',
    visualPattern: 'rupee-blue',
    bestseller: false,
    department: 'numismatics',
    rarity: 'Common',
    era: 'Republic India',
    year: '1962'
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

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
  department: 'fashion' | 'numismatics';
}

export const CATEGORIES: Category[] = [
  // Fashion Categories
  { id: 'sarees', name: 'SAREES', description: 'Timeless nine-yard drapes in silk and georgette.', visualType: 'saree', visualColor: '#C98F91', department: 'fashion' },
  { id: 'dresses', name: 'DRESSES', description: 'Modern silhouettes designed for everyday elegance.', visualType: 'dress', visualColor: '#71836C', department: 'fashion' },
  { id: 'bodycon', name: 'BODYCON', description: 'Sculpting fits that make a bold statement.', visualType: 'bodycon', visualColor: '#2C2522', department: 'fashion' },
  { id: 'ethnic-wear', name: 'ETHNIC WEAR', description: 'Traditional craftsmanship meets modern cuts.', visualType: 'ethnic', visualColor: '#B96F72', department: 'fashion' },
  { id: 'blouses', name: 'BLOUSES', description: 'Exquisitely tailored overlays and corset styles.', visualType: 'blouse', visualColor: '#F3DFDF', department: 'fashion' },
  { id: 'kurtis', name: 'KURTIS', description: 'Lightweight linen and cotton essential wear.', visualType: 'kurti', visualColor: '#756E69', department: 'fashion' },
  { id: 'lehengas', name: 'LEHENGAS', description: 'Oversized skirts crafted for grand Indian festivities.', visualType: 'lehenga', visualColor: '#B89A67', department: 'fashion' },

  // Numismatics Categories
  { id: 'indian-coins', name: 'INDIAN COINS', description: 'Historic Indian coinage from ancient to modern eras.', visualType: 'coin', visualColor: '#9A7955', department: 'numismatics' },
  { id: 'rare-coins', name: 'RARE COINS', description: 'Exceedingly scarce mintages with historical provenance.', visualType: 'coin', visualColor: '#B89A67', department: 'numismatics' },
  { id: 'commemorative', name: 'COMMEMORATIVE COINS', description: 'Special issue coinage celebrating pivotal milestones.', visualType: 'coin', visualColor: '#756E69', department: 'numismatics' },
  { id: 'currency-notes', name: 'CURRENCY NOTES', description: 'Paper currency notes from British India and RBI.', visualType: 'note', visualColor: '#71836C', department: 'numismatics' },
  { id: 'collectors-picks', name: 'COLLECTOR\'S PICKS', description: 'Curated sets and graded numismatic treasures.', visualType: 'coin', visualColor: '#2C2522', department: 'numismatics' }
];

export const PRODUCTS: Product[] = [
  // Fashion Bestsellers
  {
    id: 'f-best-1',
    name: 'THE ROSE SILK SAREE',
    category: 'SAREES',
    price: 2999,
    mrp: 4499,
    discount: 33,
    description: 'Elegant handcrafted Kanjivaram silk saree with intricate floral-embellished borders, designed for modern celebrations and heirlooms.',
    image: 'saree_rose.jpg',
    visualType: 'saree',
    visualColor: '#C98F91',
    visualPattern: 'floral-embroidery',
    colors: ['#C98F91', '#F3DFDF', '#2C2522'],
    sizes: ['Free Size'],
    bestseller: true,
    department: 'fashion'
  },
  {
    id: 'f-best-2',
    name: 'AURUM BANARASI DRAPE',
    category: 'SAREES',
    price: 4500,
    mrp: 5999,
    discount: 25,
    description: 'Rich metallic gold weave Banarasi saree featuring heritage motifs woven by master artisans on fine mulberry silk.',
    image: 'saree_aurum.jpg',
    visualType: 'saree',
    visualColor: '#B89A67',
    visualPattern: 'gold-brocade',
    colors: ['#B89A67', '#2C2522'],
    sizes: ['Free Size'],
    bestseller: true,
    department: 'fashion'
  },
  {
    id: 'f-best-3',
    name: 'IVORY GEORGETTE DRAPE',
    category: 'DRESSES',
    price: 3200,
    mrp: 4799,
    discount: 33,
    description: 'Asymmetric ivory georgette cocktail dress with layered fluid drapes and a structured single-shoulder neckline.',
    image: 'dress_ivory.jpg',
    visualType: 'dress',
    visualColor: '#F4EFE9',
    visualPattern: 'silk-sheen',
    colors: ['#F4EFE9', '#F3DFDF', '#756E69'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    bestseller: true,
    department: 'fashion'
  },
  {
    id: 'f-best-4',
    name: 'SCARLET VELVET LEHENGA',
    category: 'LEHENGAS',
    price: 7999,
    mrp: 11999,
    discount: 33,
    description: 'A striking scarlet velvet panelled lehenga skirt combined with a heavily hand-embroidered floral choli and organza dupatta.',
    image: 'lehenga_scarlet.jpg',
    visualType: 'lehenga',
    visualColor: '#B96F72',
    visualPattern: 'floral-embroidery',
    colors: ['#B96F72', '#2C2522'],
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    department: 'fashion'
  },

  // Fashion New Arrivals & General Products
  {
    id: 'f-prod-5',
    name: 'MIDNIGHT CO-ORD SET',
    category: 'CO-ORD SETS',
    price: 2499,
    mrp: 3499,
    discount: 28,
    description: 'Sophisticated midnight espresso silk co-ord set with relaxed trousers and an asymmetric buttoned tunic blouse.',
    image: 'coord_midnight.jpg',
    visualType: 'bodycon',
    visualColor: '#2C2522',
    visualPattern: 'plain',
    colors: ['#2C2522', '#756E69'],
    sizes: ['XS', 'S', 'M', 'L'],
    department: 'fashion'
  },
  {
    id: 'f-prod-6',
    name: 'BLUSH CORSET BLOUSE',
    category: 'BLOUSES',
    price: 1899,
    mrp: 2699,
    discount: 29,
    description: 'Tailored blush pink corset style crop blouse with padded structure, featuring a gold hook enclosure at the back.',
    image: 'blouse_blush.jpg',
    visualType: 'blouse',
    visualColor: '#F3DFDF',
    visualPattern: 'silk-sheen',
    colors: ['#F3DFDF', '#C98F91', '#FFFFFF'],
    sizes: ['XS', 'S', 'M', 'L'],
    department: 'fashion'
  },
  {
    id: 'f-prod-7',
    name: 'SAGE LINEN KURTI',
    category: 'KURTIS',
    price: 1599,
    mrp: 2299,
    discount: 30,
    description: 'Breathable organic linen kurti in sage green, featuring hand-embroidered French knots around the Mandarin collar.',
    image: 'kurti_sage.jpg',
    visualType: 'kurti',
    visualColor: '#71836C',
    visualPattern: 'plain',
    colors: ['#71836C', '#F4EFE9'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    department: 'fashion'
  },
  {
    id: 'f-prod-8',
    name: 'DUSK EMBROIDERED SAREE',
    category: 'SAREES',
    price: 3499,
    mrp: 4999,
    discount: 30,
    description: 'Delicate charcoal gray organza saree adorned with detailed silver metallic threadwork vine motifs along the borders.',
    image: 'saree_dusk.jpg',
    visualType: 'saree',
    visualColor: '#756E69',
    visualPattern: 'floral-embroidery',
    colors: ['#756E69', '#2C2522'],
    sizes: ['Free Size'],
    department: 'fashion'
  },

  // Numismatics Products (Coins & notes)
  {
    id: 'n-prod-1',
    name: 'KING GEORGE VI SILVER RUPEE',
    category: 'INDIAN COINS',
    price: 3500,
    mrp: 4500,
    discount: 22,
    description: 'British India King George VI Silver One Rupee coin. Beautiful original luster, minted in Bombay in 1940. A historic silver collector\'s treasure.',
    image: 'coin_george.jpg',
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
    image: 'coin_victoria.jpg',
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
    image: 'coin_mughal.jpg',
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
    image: 'coin_set_1950.jpg',
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
    text: "I ordered the Scarlet Velvet Lehenga for a festive evening. Fits like a glove. The hand embroidery is dense, rich, and retains a beautiful heritage charm.",
    author: "Kavita Nair",
    verified: true,
    productName: "Scarlet Velvet Lehenga",
    date: "Aug 15, 2026"
  }
];

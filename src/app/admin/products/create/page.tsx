"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shirt, 
  Coins, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

function CreateProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') as 'fashion' | 'numismatics' | null;

  // Step 1: Type Selection (if not preselected via URL)
  const [department, setDepartment] = useState<'fashion' | 'numismatics' | null>(initialType);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common Base Fields
  const [productNo, setProductNo] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [baseMrp, setBaseMrp] = useState<number | ''>('');
  const [baseDiscount, setBaseDiscount] = useState<number | ''>('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [heroOrder, setHeroOrder] = useState<number>(0);
  const [returnPolicy, setReturnPolicy] = useState('7-day replacement or return for eligible items');
  const [mainImageUrl, setMainImageUrl] = useState('');

  // Fashion Specific Fields
  const [fabric, setFabric] = useState('');
  const [pattern, setPattern] = useState('');
  const [fit, setFit] = useState('');
  const [neckType, setNeckType] = useState('');
  const [sleeves, setSleeves] = useState('');
  const [occasion, setOccasion] = useState('');
  const [length, setLength] = useState('');
  const [packOf, setPackOf] = useState('1');
  const [returnTime, setReturnTime] = useState('7 Days');

  // Fashion Multi-Color Variants
  interface ColorVariant {
    color: string;
    color_hex: string;
    sku: string;
    size: string;
    stock: number;
    price: number | '';
    images: string[];
  }

  const [fashionVariants, setFashionVariants] = useState<ColorVariant[]>([
    { color: 'Crimson Red', color_hex: '#b31b1b', sku: '', size: '36', stock: 15, price: '', images: [''] }
  ]);

  // Numismatics Specific Fields
  const [material, setMaterial] = useState('Silver');
  const [weight, setWeight] = useState('');
  const [mint, setMint] = useState('Calcutta Mint');
  const [year, setYear] = useState('1940');
  const [denomination, setDenomination] = useState('1 Rupee');
  const [rarity, setRarity] = useState('Scarce');
  const [era, setEra] = useState('British India');
  const [condition, setCondition] = useState('Very Fine');
  const [shippingCharges, setShippingCharges] = useState('Free Shipping');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [additionalImages, setAdditionalImages] = useState<string[]>(['']);

  // Fetch domain categories when department selected
  useEffect(() => {
    if (!department) return;
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/categories?department=${department}`);
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, [department]);

  // Auto-calculate discount when price or MRP changes
  useEffect(() => {
    if (typeof basePrice === 'number' && typeof baseMrp === 'number' && baseMrp > basePrice) {
      const disc = Math.round(((baseMrp - basePrice) / baseMrp) * 100);
      setBaseDiscount(disc);
    }
  }, [basePrice, baseMrp]);

  const addColorVariant = () => {
    setFashionVariants(prev => [
      ...prev,
      { color: '', color_hex: '#000000', sku: '', size: '36', stock: 10, price: basePrice || '', images: [''] }
    ]);
  };

  const removeColorVariant = (idx: number) => {
    setFashionVariants(prev => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: keyof ColorVariant, value: any) => {
    setFashionVariants(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!department) {
      setError('Please choose a product type first');
      return;
    }

    if (!productNo.trim() || !name.trim() || !categoryId || basePrice === '') {
      setError('Please fill all required base fields: Product No, Name, Category, Price');
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        product_no: productNo.trim(),
        name: name.trim(),
        department,
        category_id: categoryId,
        description,
        base_price: Number(basePrice),
        base_mrp: Number(baseMrp || basePrice),
        base_discount: Number(baseDiscount || 0),
        is_bestseller: isBestseller,
        is_hero: isHero,
        hero_order: Number(heroOrder) || 0,
        return_policy: returnPolicy,
        media: mainImageUrl.trim() ? [{ media_url: mainImageUrl.trim(), is_primary: true }] : []
      };

      if (department === 'fashion') {
        payload.fashion_details = {
          fabric,
          pattern,
          neck_type: neckType,
          sleeves,
          occasion,
          length,
          pack_of: packOf,
          fit,
          return_time: returnTime
        };

        // Format multi-color variants
        payload.variants = fashionVariants.map(v => ({
          color: v.color,
          color_hex: v.color_hex,
          sku: v.sku || `${productNo}-${(v.color || 'STD').toUpperCase()}`,
          size: v.size,
          stock_quantity: Number(v.stock || 0),
          price: Number(v.price || basePrice),
          mrp: Number(baseMrp || basePrice),
          discount: Number(baseDiscount || 0),
          images: v.images.filter(img => img.trim().length > 0)
        }));
      } else {
        payload.numismatic_details = {
          material,
          weight,
          mint,
          year,
          denomination,
          rarity,
          era,
          condition,
          shipping_charges: shippingCharges
        };

        // Add additional images into media
        additionalImages.forEach(img => {
          if (img.trim()) {
            payload.media.push({ media_url: img.trim(), is_primary: false });
          }
        });

        payload.variants = [{
          sku: `${productNo}-COIN`,
          price: Number(basePrice),
          mrp: Number(baseMrp || basePrice),
          discount: Number(baseDiscount || 0),
          stock_quantity: Number(stockQuantity || 1)
        }];
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (resJson.success) {
        // Redirect to corresponding product list
        router.push(department === 'fashion' ? '/admin/products/fashion' : '/admin/products/numismatics');
      } else {
        setError(resJson.error || 'Failed to create product in database');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred while saving product');
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 1: CHOOSE PRODUCT TYPE (If not selected)
  if (!department) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-8">
        <div>
          <span className="text-xs font-bold text-[#cca05b] uppercase tracking-wider block mb-1">
            NEW PRODUCT WIZARD
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Choose Product Domain</h1>
          <p className="text-sm font-semibold text-gray-500 max-w-md mx-auto mt-1">
            AADHYA features two strictly separated catalogs. Select the product type to open its domain-tailored management form.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
          {/* FASHION CARD */}
          <button
            onClick={() => setDepartment('fashion')}
            className="p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-[#cca05b] hover:shadow-xl transition-all group flex flex-col justify-between space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#cca05b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shirt className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">Fashion Apparel</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Sarees, kurtis, palazzos, co-ords, multi-color variants, size guides, fabric specifications.
              </p>
            </div>
            <div className="text-xs font-bold text-[#cca05b] group-hover:underline">
              Create Fashion Item →
            </div>
          </button>

          {/* NUMISMATICS CARD */}
          <button
            onClick={() => setDepartment('numismatics')}
            className="p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group flex flex-col justify-between space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">Coins & Banknotes</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Historical coins, Mughal, British India, mints, denomination, alloy materials, rarity grades.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 group-hover:underline">
              Create Coin / Note →
            </div>
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: DOMAIN-SPECIFIC FORM
  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setDepartment(null)}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Product Type</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
            department === 'fashion' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
          }`}>
            {department === 'fashion' ? 'Fashion Apparel' : 'Coins & Notes'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: CORE PRODUCT IDENTIFICATION */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900 tracking-tight">1. Product Identification</h2>
          <p className="text-xs text-gray-400 font-semibold">Unique identifiers and categorization</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Product No / SKU Identifier *
            </label>
            <input
              type="text"
              required
              value={productNo}
              onChange={(e) => setProductNo(e.target.value)}
              placeholder={department === 'fashion' ? 'e.g. F-SAREE-ROS' : 'e.g. N-COIN-MUG-01'}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={department === 'fashion' ? 'e.g. THE ROSE SILK SAREE' : 'e.g. 1940 BRITISH INDIA ONE RUPEE'}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ImageUpload 
            value={mainImageUrl} 
            onChange={setMainImageUrl} 
            label="Main Product Image" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Detailed Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a luxury editorial description..."
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b]"
          />
        </div>
      </div>

      {/* SECTION 2: PRICING & INVENTORY */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900 tracking-tight">2. Authoritative Pricing & Offers</h2>
          <p className="text-xs text-gray-400 font-semibold">Controlled pricing model with automatic discount calculations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Actual Selling Price (₹) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="2499"
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              MRP / Original Price (₹)
            </label>
            <input
              type="number"
              min={0}
              value={baseMrp}
              onChange={(e) => setBaseMrp(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="2999"
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Calculated Discount %
            </label>
            <input
              type="number"
              readOnly
              value={baseDiscount}
              placeholder="0"
              className="w-full bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="bestseller"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="w-4 h-4 text-[#cca05b] rounded focus:ring-[#cca05b]"
            />
            <label htmlFor="bestseller" className="text-xs font-bold text-gray-800 cursor-pointer">
              Feature in "Best Sellers" showcase
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hero"
              checked={isHero}
              onChange={(e) => setIsHero(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="hero" className="text-xs font-bold text-purple-900 cursor-pointer">
              Feature on Homepage Hero Carousel
            </label>
          </div>

          {isHero && (
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              <label className="text-[11px] font-bold text-purple-900 uppercase">Hero Display Order:</label>
              <input
                type="number"
                min={0}
                max={99}
                value={heroOrder}
                onChange={(e) => setHeroOrder(parseInt(e.target.value, 10) || 0)}
                className="w-14 bg-white border border-purple-300 px-2 py-1 rounded-lg text-xs font-bold text-center text-purple-950 focus:outline-none focus:border-purple-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DOMAIN SPECIFIC ATTRIBUTES */}
      {department === 'fashion' ? (
        <>
          {/* Fashion Garment Specs */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight">3. Fashion Specifications</h2>
              <p className="text-xs text-gray-400 font-semibold">Material, styling, cut and fit</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Fabric</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="Pure Silk / Cotton"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Zari / Solid"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Fit</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder="Regular / Slim"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Occasion</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Festive / Wedding"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* CRITICAL: MULTI-COLOR VARIANT BUILDER */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight">4. Color Variants & Media Sets</h2>
                <p className="text-xs text-gray-400 font-semibold">
                  Each color has isolated gallery images and stock count
                </p>
              </div>
              <button
                type="button"
                onClick={addColorVariant}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-[#cca05b] font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Color</span>
              </button>
            </div>

            <div className="space-y-4">
              {fashionVariants.map((v, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 uppercase">
                      Variant #{idx + 1}
                    </span>
                    {fashionVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorVariant(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Color Name</label>
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                        placeholder="e.g. Royal Navy"
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Color Hex</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={v.color_hex}
                          onChange={(e) => updateVariant(idx, 'color_hex', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-gray-300 p-0.5"
                        />
                        <input
                          type="text"
                          value={v.color_hex}
                          onChange={(e) => updateVariant(idx, 'color_hex', e.target.value)}
                          className="flex-1 bg-white border border-gray-200 px-2 py-2 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Size</label>
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                        placeholder="36 / Free Size"
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Stock Qty</label>
                      <input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={(e) => updateVariant(idx, 'stock', Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Variant Price</label>
                      <input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder={basePrice ? String(basePrice) : '2499'}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Images for this Color */}
                  <div className="space-y-2 pt-2 border-t border-gray-200/60">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">
                      Color-Specific Images (Will display when customer selects {v.color || 'this color'})
                    </label>
                    <div className="space-y-2">
                      {v.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="flex items-center space-x-2">
                          <input
                            type="url"
                            value={imgUrl}
                            onChange={(e) => {
                              const newImgs = [...v.images];
                              newImgs[imgIdx] = e.target.value;
                              updateVariant(idx, 'images', newImgs);
                            }}
                            placeholder="https://.../color-photo.jpg"
                            className="flex-1 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs text-gray-800"
                          />
                          {v.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newImgs = v.images.filter((_, i) => i !== imgIdx);
                                updateVariant(idx, 'images', newImgs);
                              }}
                              className="text-gray-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateVariant(idx, 'images', [...v.images, ''])}
                        className="text-[11px] font-bold text-[#cca05b] hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add image for this color</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Numismatics Specs */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900 tracking-tight">3. Numismatic Historical Attributes</h2>
            <p className="text-xs text-gray-400 font-semibold">Minting, era, certification, and alloy</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Material / Metal</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Silver / Gold / Copper"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Era</label>
              <input
                type="text"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                placeholder="Mughal / British India"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 1940 or 1612 AD"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Mint</label>
              <input
                type="text"
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                placeholder="Calcutta / Bombay / Lahore"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Denomination</label>
              <input
                type="text"
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                placeholder="1 Rupee / Mohur"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Rarity</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              >
                <option value="Common">Common</option>
                <option value="Scarce">Scarce</option>
                <option value="Rare">Rare</option>
                <option value="Very Rare">Very Rare</option>
                <option value="Extremely Rare">Extremely Rare</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="11.66 g"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Stock Units</label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Submission Bar */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <Link
          href={department === 'fashion' ? '/admin/products/fashion' : '/admin/products/numismatics'}
          className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-2xl shadow-md hover:bg-[#d8ae69] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving to Database...' : 'Publish Product to Store'}</span>
        </button>
      </div>
    </form>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-gray-400">Loading wizard...</div>}>
      <CreateProductContent />
    </Suspense>
  );
}

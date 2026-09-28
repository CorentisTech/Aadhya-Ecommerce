"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, Trash2, Shirt, Coins } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Editable fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [baseMrp, setBaseMrp] = useState<number | ''>('');
  const [baseDiscount, setBaseDiscount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [heroOrder, setHeroOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  // Fashion fields
  const [fabric, setFabric] = useState('');
  const [pattern, setPattern] = useState('');
  const [fit, setFit] = useState('');
  const [occasion, setOccasion] = useState('');

  // Numismatics fields
  const [era, setEra] = useState('');
  const [year, setYear] = useState('');
  const [mint, setMint] = useState('');
  const [material, setMaterial] = useState('');
  const [rarity, setRarity] = useState('Common');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setName(p.name || '');
          setCategoryId(p.category_id || '');
          setBasePrice(Number(p.base_price) || '');
          setBaseMrp(Number(p.base_mrp) || '');
          setBaseDiscount(Number(p.base_discount) || '');
          setDescription(p.description || '');
          setIsBestseller(Boolean(p.is_bestseller));
          setIsHero(Boolean(p.is_hero));
          setHeroOrder(Number(p.hero_order) || 0);
          setIsActive(Boolean(p.is_active));

          if (data.domainDetails) {
            if (p.department === 'fashion') {
              setFabric(data.domainDetails.fabric || '');
              setPattern(data.domainDetails.pattern || '');
              setFit(data.domainDetails.fit || '');
              setOccasion(data.domainDetails.occasion || '');
            } else {
              setEra(data.domainDetails.era || '');
              setYear(data.domainDetails.year || '');
              setMint(data.domainDetails.mint || '');
              setMaterial(data.domainDetails.material || '');
              setRarity(data.domainDetails.rarity || 'Common');
            }
          }

          // Fetch categories for this department
          const catRes = await fetch(`/api/admin/categories?department=${p.department}`);
          const catData = await catRes.json();
          if (catData.success) {
            setCategories(catData.categories);
          }
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        name,
        category_id: categoryId,
        base_price: Number(basePrice),
        base_mrp: Number(baseMrp || basePrice),
        base_discount: Number(baseDiscount || 0),
        description,
        is_bestseller: isBestseller,
        is_hero: isHero,
        hero_order: Number(heroOrder) || 0,
        is_active: isActive
      };

      if (product.department === 'fashion') {
        payload.fashion_details = { fabric, pattern, fit, occasion };
      } else {
        payload.numismatic_details = { era, year, mint, material, rarity };
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        router.push(product.department === 'fashion' ? '/admin/products/fashion' : '/admin/products/numismatics');
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-sm font-bold text-rose-600">{error}</div>
        <Link href="/admin/products" className="text-xs font-bold text-[#cca05b]">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href={product?.department === 'fashion' ? '/admin/products/fashion' : '/admin/products/numismatics'}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-gray-100 text-gray-800">
          Editing SKU: {product?.product_no}
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900">Product Information</h2>
          <p className="text-xs text-gray-400 font-semibold">Base details and pricing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase">Selling Price (₹)</label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 uppercase">MRP Price (₹)</label>
            <input
              type="number"
              min={0}
              value={baseMrp}
              onChange={(e) => setBaseMrp(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="w-4 h-4 text-[#cca05b] rounded"
            />
            <span>Best Seller Feature</span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isHero}
              onChange={(e) => setIsHero(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="text-purple-900">Feature on Homepage Hero Carousel</span>
          </label>

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

          <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <span>Active on Website Storefront</span>
          </label>
        </div>
      </div>

      {/* Domain Specific */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900">
            {product?.department === 'fashion' ? 'Fashion Attributes' : 'Numismatics Attributes'}
          </h2>
          <p className="text-xs text-gray-400 font-semibold">Domain-specific details</p>
        </div>

        {product?.department === 'fashion' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Fabric</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Pattern</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Fit</label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Occasion</label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Era</label>
              <input
                type="text"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Mint</label>
              <input
                type="text"
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-2xl shadow hover:bg-[#d8ae69] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
}

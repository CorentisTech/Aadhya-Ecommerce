"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, Trash2, Shirt, Coins, Plus } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

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
  const [neckType, setNeckType] = useState('');
  const [sleeves, setSleeves] = useState('');
  const [lengthVal, setLengthVal] = useState('');
  const [fabricCare, setFabricCare] = useState('');
  const [modelInfo, setModelInfo] = useState('');

  // Numismatics fields
  const [era, setEra] = useState('');
  const [year, setYear] = useState('');
  const [mint, setMint] = useState('');
  const [material, setMaterial] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [denomination, setDenomination] = useState('');
  const [weight, setWeight] = useState('');
  const [condition, setCondition] = useState('');
  const [collectionLabel, setCollectionLabel] = useState('');

  // Media
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [fashionVariants, setFashionVariants] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/products/' + id);
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
              setNeckType(data.domainDetails.neck_type || '');
              setSleeves(data.domainDetails.sleeves || '');
              setLengthVal(data.domainDetails.length || '');
              setFabricCare(data.domainDetails.fabric_care || '');
              setModelInfo(data.domainDetails.model_info || '');
            } else {
              setEra(data.domainDetails.era || '');
              setYear(data.domainDetails.year || '');
              setMint(data.domainDetails.mint || '');
              setMaterial(data.domainDetails.material || '');
              setRarity(data.domainDetails.rarity || 'Common');
              setDenomination(data.domainDetails.denomination || '');
              setWeight(data.domainDetails.weight || '');
              setCondition(data.domainDetails.condition || '');
              setCollectionLabel(data.domainDetails.collection_label || '');
            }
          }

          // Fetch categories for this department
          const catRes = await fetch('/api/admin/categories?department=' + p.department);
          const catData = await catRes.json();
          if (catData.success) setCategories(catData.categories);

          // Populate Media & Variants (Preserve both primary and additional gallery images)
          if (data.media) {
            const primary = data.media.find((m: any) => m.is_primary);
            if (primary) setMainImageUrl(primary.media_url);

            const extra = data.media.filter((m: any) => !m.is_primary && !m.variant_id).map((m: any) => m.media_url);
            setAdditionalImages(extra);
          }

          if (p.department === 'fashion' && data.variants) {
            const vars = data.variants.map((v: any) => {
              const variantMedia = data.media ? data.media.filter((m: any) => m.variant_id === v.id).map((m: any) => m.media_url) : [];
              return {
                id: v.id,
                color: v.color || '',
                color_hex: v.color_hex || '#000000',
                size: v.size || '',
                sku: v.sku || '',
                images: variantMedia.length > 0 ? variantMedia : ['']
              };
            });
            setFashionVariants(vars);
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

  const handleDeleteProduct = async () => {
    if (!product || !confirm(`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}?action=delete`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Product deleted successfully');
        router.push(product.department === 'numismatics' ? '/admin/products/numismatics' : '/admin/products/fashion');
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Build media array preserving both variant media and general additional gallery images
      const media: any[] = [];
      if (mainImageUrl.trim()) {
        media.push({ media_url: mainImageUrl.trim(), is_primary: true });
      }

      additionalImages.forEach(img => {
        if (img && img.trim()) {
          media.push({ media_url: img.trim(), is_primary: false });
        }
      });

      if (product.department === 'fashion' && fashionVariants.length > 0) {
        fashionVariants.forEach((v) => {
          v.images.forEach((img: string) => {
            if (img && img.trim()) {
              media.push({
                media_url: img.trim(),
                is_primary: false,
                variant_id: v.id || null,
                color_name: v.color,
                color_hex: v.color_hex
              });
            }
          });
        });
      }

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
        is_active: isActive,
        media
      };

      if (product.department === 'fashion') {
        payload.fashion_details = { 
          fabric, 
          pattern, 
          fit, 
          occasion, 
          neck_type: neckType, 
          sleeves, 
          length: lengthVal, 
          fabric_care: fabricCare, 
          model_info: modelInfo 
        };
      } else {
        payload.numismatic_details = { 
          era, 
          year, 
          mint, 
          material, 
          rarity, 
          denomination, 
          weight, 
          condition, 
          collection_label: collectionLabel 
        };
      }

      const res = await fetch('/api/admin/products/' + id, {
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

  const updateVariantImage = (vIdx: number, iIdx: number, val: string) => {
    const copy = [...fashionVariants];
    copy[vIdx].images[iIdx] = val;
    setFashionVariants(copy);
  };

  const addVariantImage = (vIdx: number) => {
    const copy = [...fashionVariants];
    copy[vIdx].images.push('');
    setFashionVariants(copy);
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
      <div className="p-12 text-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 text-left">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Product</h1>
          <p className="text-xs font-bold text-gray-400">Update product information and variants</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-sm font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* MEDIA SECTION */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900">Product Images</h2>
            <p className="text-xs text-gray-400 font-semibold">Manage primary and variant images</p>
          </div>
          
          <div className="w-full md:w-1/2">
            <ImageUpload 
              value={mainImageUrl}
              onChange={setMainImageUrl}
              label="Primary Product Image (Hero)"
            />
          </div>

          {product?.department === 'fashion' && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-gray-800">Variant Images</h3>
              {fashionVariants.map((v, vIdx) => (
                <div key={v.id || vIdx} className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.color_hex }}></div>
                    <span className="text-xs font-bold text-gray-700 uppercase">{v.color || 'Variant'} - {v.size} ({v.sku})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {v.images.map((img: string, iIdx: number) => (
                      <div key={iIdx} className="relative">
                        <ImageUpload
                          value={img}
                          onChange={(val) => updateVariantImage(vIdx, iIdx, val)}
                          label={`Image ${iIdx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addVariantImage(vIdx)}
                    className="text-[10px] font-bold text-[#cca05b] uppercase tracking-wider flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Image to {v.color}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Additional Gallery Images (Available for all products) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-800">Additional Images (Gallery)</h3>
              <p className="text-[11px] text-gray-400 font-semibold">Editorial, texture, and catalog shots displayed on the product page</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {additionalImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <ImageUpload
                    value={img}
                    onChange={(val) => {
                      const copy = [...additionalImages];
                      copy[idx] = val;
                      setAdditionalImages(copy);
                    }}
                    label={`Gallery Image ${idx + 1}`}
                  />
                  {additionalImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const copy = additionalImages.filter((_, i) => i !== idx);
                        setAdditionalImages(copy);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-bold hover:bg-red-100 z-10"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAdditionalImages([...additionalImages, ''])}
              className="text-[10px] font-bold text-[#cca05b] uppercase tracking-wider flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Gallery Image</span>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900">Basic Information</h2>
            <p className="text-xs text-gray-400 font-semibold">Core product details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#cca05b]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#cca05b]"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs font-medium focus:outline-none focus:border-[#cca05b]"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900">Pricing Strategy</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Selling Price (?) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">MRP (?)</label>
              <input
                type="number"
                value={baseMrp}
                onChange={(e) => setBaseMrp(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Discount (%)</label>
              <input
                type="number"
                value={baseDiscount}
                onChange={(e) => setBaseDiscount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Domain Specific */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900">
              {product?.department === 'fashion' ? 'Fashion Specifications' : 'Numismatics Specifications'}
            </h2>
            <p className="text-xs text-gray-400 font-semibold">Authoritative catalog metadata</p>
          </div>

          {product?.department === 'fashion' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Fabric</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Pure Rayon / Silk"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Floral / Solid"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Fit</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Regular / Flared"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Occasion</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Festive / Daily Wear"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Neck Type</label>
                <input
                  type="text"
                  value={neckType}
                  onChange={(e) => setNeckType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Round Neck / V-Neck"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Sleeves</label>
                <input
                  type="text"
                  value={sleeves}
                  onChange={(e) => setSleeves(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. 3/4 Sleeves / Sleeveless"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Length</label>
                <input
                  type="text"
                  value={lengthVal}
                  onChange={(e) => setLengthVal(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Calf Length / Ankle"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Fabric Care</label>
                <input
                  type="text"
                  value={fabricCare}
                  onChange={(e) => setFabricCare(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Hand Wash / Dry Clean"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Model / Sizing Info</label>
                <input
                  type="text"
                  value={modelInfo}
                  onChange={(e) => setModelInfo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Model is 5'8 wearing size S"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Era</label>
                <input
                  type="text"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Mughal / British India"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Year / Period</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. 1940 or AH 1205"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Mint</label>
                <input
                  type="text"
                  value={mint}
                  onChange={(e) => setMint(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Bombay / Calcutta"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Material / Metal</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Silver 0.917 / Copper"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Rarity</label>
                <input
                  type="text"
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Rare / Extremely Rare"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Denomination</label>
                <input
                  type="text"
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. One Rupee / Mohur"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. 11.66g"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Condition / Grade</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. UNC / Very Fine"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Collection Label</label>
                <input
                  type="text"
                  value={collectionLabel}
                  onChange={(e) => setCollectionLabel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Heritage Imperial Collection"
                />
              </div>
            </div>
          )}
        </div>

        {/* Display Flags & Hero Placement */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-gray-900">Visibility & Flags</h2>
            <p className="text-xs text-gray-400 font-semibold">Control storefront spotlight, hero placement, and status</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 text-[#cca05b] border-gray-300 rounded focus:ring-[#cca05b]"
              />
              <div>
                <span className="text-sm font-bold text-gray-800 block">Bestseller</span>
                <span className="text-[10px] text-gray-400 font-medium block">Show in Best Sellers</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#cca05b] border-gray-300 rounded focus:ring-[#cca05b]"
              />
              <div>
                <span className="text-sm font-bold text-gray-800 block">Active (Visible)</span>
                <span className="text-[10px] text-gray-400 font-medium block">Live on storefront</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isHero}
                onChange={(e) => setIsHero(e.target.checked)}
                className="w-4 h-4 text-[#cca05b] border-gray-300 rounded focus:ring-[#cca05b]"
              />
              <div>
                <span className="text-sm font-bold text-gray-800 block">Hero Spotlight</span>
                <span className="text-[10px] text-gray-400 font-medium block">Homepage carousel hero</span>
              </div>
            </label>

            <div className="p-4 border border-gray-100 rounded-2xl space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase block">Hero Display Order</label>
              <input
                type="number"
                min={0}
                value={heroOrder}
                onChange={(e) => setHeroOrder(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDeleteProduct}
            className="px-6 py-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center space-x-2 border border-rose-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Product</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-[#15171c] text-[#cca05b] font-black text-sm uppercase tracking-widest rounded-full shadow-xl hover:bg-black transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving Changes...' : 'Save Product Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

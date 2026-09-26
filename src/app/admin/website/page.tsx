"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Save, Check, Plus, Trash2, Tag, Image as ImageIcon, ShieldCheck } from 'lucide-react';

export default function WebsiteCMSPage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'policies' | 'banners' | 'offers'>('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings
  const [brandName, setBrandName] = useState('AADHYA');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('support@aadhya.co');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactAddress, setContactAddress] = useState('123 Heritage Boulevard, Luxury Avenue, Mumbai, India');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/aadhya');
  const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/aadhya');
  const [socialYoutube, setSocialYoutube] = useState('https://youtube.com/aadhya');

  // Banners & Offers Lists
  const [banners, setBanners] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  // Banner Modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('EXPLORE NOW');
  const [bannerCtaLink, setBannerCtaLink] = useState('/catalog');
  const [bannerDepartment, setBannerDepartment] = useState('global');

  // Offer Modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscount, setOfferDiscount] = useState<number>(10);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/website');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        setBrandName(s.brand_name || 'AADHYA');
        setLogoUrl(s.logo_url || '');
        setContactEmail(s.contact_email || '');
        setContactPhone(s.contact_phone || '');
        setContactAddress(s.contact_address || '');
        setPrivacyPolicy(s.privacy_policy || '');
        setRefundPolicy(s.refund_policy || '');
        setTermsConditions(s.terms_conditions || '');
        setShippingPolicy(s.shipping_policy || '');

        if (s.social_links) {
          setSocialInstagram(s.social_links.instagram || '');
          setSocialFacebook(s.social_links.facebook || '');
          setSocialYoutube(s.social_links.youtube || '');
        }
      }

      // Fetch banners & offers
      const bRes = await fetch('/api/admin/banners');
      const bData = await bRes.json();
      if (bData.success) setBanners(bData.banners || []);

      const oRes = await fetch('/api/admin/offers');
      const oData = await oRes.json();
      if (oData.success) setOffers(oData.offers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/website', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: brandName,
          logo_url: logoUrl,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_address: contactAddress,
          privacy_policy: privacyPolicy,
          refund_policy: refundPolicy,
          terms_conditions: termsConditions,
          shipping_policy: shippingPolicy,
          social_links: {
            instagram: socialInstagram,
            facebook: socialFacebook,
            youtube: socialYoutube
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bannerTitle,
          image_url: bannerImage,
          cta_text: bannerCtaText,
          cta_link: bannerCtaLink,
          department: bannerDepartment
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowBannerModal(false);
        setBannerTitle('');
        setBannerImage('');
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      fetchSettings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: offerTitle,
          code: offerCode,
          discount_percentage: Number(offerDiscount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowOfferModal(false);
        setOfferTitle('');
        setOfferCode('');
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Delete this promo offer?')) return;
    try {
      await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
      fetchSettings();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-gray-400">Loading website configuration...</div>;
  }

  return (
    <div className="space-y-8 text-left pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Website Configuration (CMS)</h1>
        <p className="text-xs font-semibold text-gray-500">
          Manage brand identity, contact information, legal policies, promotional banners and coupon codes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600">
        {[
          { id: 'branding', label: 'Brand & Contact' },
          { id: 'policies', label: 'Store Policies' },
          { id: 'banners', label: `Banners (${banners.length})` },
          { id: 'offers', label: `Offers & Codes (${offers.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === t.id ? 'bg-[#cca05b] text-[#15171c] shadow' : 'hover:text-black'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. BRANDING & CONTACT FORM */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-gray-900">Brand Identity & Direct Contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Logo Image URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://.../logo.png"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Support Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Support Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Storefront Physical Address</label>
              <textarea
                rows={2}
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-medium"
              />
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-gray-400">Social Media Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Instagram</label>
                  <input
                    type="url"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Facebook</label>
                  <input
                    type="url"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">YouTube</label>
                  <input
                    type="url"
                    value={socialYoutube}
                    onChange={(e) => setSocialYoutube(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-2xl shadow hover:bg-[#d8ae69] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : savedSuccess ? 'Saved to Website!' : 'Save Brand Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. POLICIES FORM */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-gray-900">Legal Policies & Buyer Protections</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Privacy Policy</label>
                <textarea
                  rows={4}
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Return & Refund Policy</label>
                <textarea
                  rows={4}
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Terms & Conditions</label>
                <textarea
                  rows={4}
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Shipping Policy</label>
                <textarea
                  rows={3}
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-2xl shadow hover:bg-[#d8ae69] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : savedSuccess ? 'Policies Updated!' : 'Save Policies'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. BANNERS SECTION */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900">Promotional Store Banners</h2>
            <button
              onClick={() => setShowBannerModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Banner</span>
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-xs font-bold text-gray-400">
              No promotional banners created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="h-32 rounded-2xl bg-gray-100 overflow-hidden relative">
                    <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase">
                      {b.department || 'global'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{b.title}</h4>
                      <span className="text-[11px] text-gray-400">{b.cta_text} → {b.cta_link}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. OFFERS & PROMO CODES */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900">Coupon Offers & Promotional Codes</h2>
            <button
              onClick={() => setShowOfferModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {offers.map((off) => (
              <div key={off.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-[#cca05b] font-mono font-black text-xs">
                      {off.code}
                    </span>
                    <button
                      onClick={() => handleDeleteOffer(off.id)}
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm pt-2">{off.title}</h4>
                  <span className="text-xs font-extrabold text-emerald-600 block">
                    {off.discount_percentage}% Instant Discount
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner Creation Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-gray-900">Add Promotional Banner</h3>
            <form onSubmit={handleCreateBanner} className="space-y-3">
              <input
                type="text"
                required
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Banner Title"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
              <input
                type="url"
                required
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="Banner Image URL"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={bannerCtaText}
                  onChange={(e) => setBannerCtaText(e.target.value)}
                  placeholder="CTA Text (EXPLORE NOW)"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
                />
                <select
                  value={bannerDepartment}
                  onChange={(e) => setBannerDepartment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  <option value="global">Global (Both)</option>
                  <option value="fashion">Fashion Store Only</option>
                  <option value="numismatics">Coins Store Only</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#cca05b] text-[#15171c] font-bold text-xs shadow"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-gray-900">Create Promo Discount Code</h3>
            <form onSubmit={handleCreateOffer} className="space-y-3">
              <input
                type="text"
                required
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                placeholder="Offer Title (e.g. Diwali Fest)"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
              <input
                type="text"
                required
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE (e.g. FESTIVE20)"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-mono font-bold"
              />
              <input
                type="number"
                min={1}
                max={100}
                value={offerDiscount}
                onChange={(e) => setOfferDiscount(Number(e.target.value))}
                placeholder="Discount %"
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#cca05b] text-[#15171c] font-bold text-xs shadow"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

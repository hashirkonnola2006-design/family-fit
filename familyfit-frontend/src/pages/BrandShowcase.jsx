import React from 'react'
import { Logo } from '../components/brand/Logo'
import { BrandLeaf, BrandHeart, BrandFamilyDots, BrandSprout } from '../components/brand/BrandElements'

export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-[#F8F6EF] text-[#1A2E22] p-6 sm:p-10 font-body">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#E3E0D3] pb-6">
          <span className="text-xs font-black tracking-widest text-[#1F5D3A] uppercase">Design System &amp; Brand Audit</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F5D3A] font-display mt-1">
            FamilyFit Brand Logo &amp; Theme Showcase
          </h1>
          <p className="text-sm text-[#4F6355] mt-1 font-medium">
            Side-by-side verification against the official brand sheet (public/brand/brand-sheet.png) at 4x zoom.
          </p>
        </div>

        {/* ── 1. SIDE-BY-SIDE 4X ZOOM LOGO VERIFICATION ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display text-[#1F5D3A] flex items-center gap-2">
            <span>1. Traced Vector Logos vs. Original Brand Sheet (Side-by-Side 4x Zoom)</span>
          </h2>

          {/* Mark Only Comparison */}
          <div className="bg-white rounded-2xl border border-[#E3E0D3] p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F6355] mb-4">
              Mark Only (Two family figures over two-tone leaf with white vein curve)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center p-4 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Original Brand Sheet Crop (4x)</span>
                <img src="/brand/ref_mark.png" alt="Original Mark" className="h-[120px] object-contain" />
              </div>
              <div className="flex flex-col items-center p-4 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Traced Vector: Color Mark (4x)</span>
                <Logo variant="mark" tone="color" height={120} />
              </div>
              <div className="flex flex-col items-center p-4 bg-[#1F5D3A] rounded-xl border border-[#143F27]">
                <span className="text-xs font-bold text-white/80 mb-3">Traced Vector: White Mark on Forest (4x)</span>
                <Logo variant="mark" tone="white" height={120} />
              </div>
            </div>
          </div>

          {/* Lockup Comparison */}
          <div className="bg-white rounded-2xl border border-[#E3E0D3] p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F6355] mb-4">
              Lockup: Mark + Wordmark (Navbar &amp; Header scale)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center p-5 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Original Brand Sheet Lockup</span>
                <img src="/brand/ref_lockup.png" alt="Original Lockup" className="h-[54px] object-contain" />
              </div>
              <div className="flex flex-col items-center p-5 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Traced Vector: Lockup (Color)</span>
                <Logo variant="lockup" tone="color" height={54} />
              </div>
            </div>
          </div>

          {/* Full Logo with Tagline */}
          <div className="bg-white rounded-2xl border border-[#E3E0D3] p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F6355] mb-4">
              Full Logo with Tagline ("Healthy Families • Happier Lives")
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center p-6 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Original Full Logo</span>
                <img src="/brand/ref_full_logo.png" alt="Original Full Logo" className="h-[96px] object-contain" />
              </div>
              <div className="flex flex-col items-center p-6 bg-[#F8F6EF] rounded-xl border border-[#E3E0D3]">
                <span className="text-xs font-bold text-[#4F6355] mb-3">Traced Vector: Full Logo (Color)</span>
                <Logo variant="full" tone="color" height={96} showTagline />
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. BRAND SHEET 5 BACKGROUND VARIANTS ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#1F5D3A]">
            2. Brand Sheet Background &amp; Tone Variants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Color on Cream */}
            <div className="p-6 rounded-2xl bg-[#F8F6EF] border border-[#E3E0D3] flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-xs">
              <Logo variant="full" tone="color" height={44} showTagline />
              <span className="text-xs font-semibold text-[#4F6355]">Color on Cream (#F8F6EF)</span>
            </div>

            {/* 2. White on Forest Green */}
            <div className="p-6 rounded-2xl bg-[#1F5D3A] border border-[#143F27] flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-xs text-white">
              <Logo variant="full" tone="white" height={44} showTagline />
              <span className="text-xs font-semibold text-white/80">White on Forest Green (#1F5D3A)</span>
            </div>

            {/* 3. Color on Light Green */}
            <div className="p-6 rounded-2xl bg-[#DDEBC8] border border-[#7CB342]/30 flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-xs">
              <Logo variant="full" tone="color" height={44} showTagline />
              <span className="text-xs font-semibold text-[#1F5D3A]">Color on Light Green (#DDEBC8)</span>
            </div>

            {/* 4. White on Sun Orange */}
            <div className="p-6 rounded-2xl bg-[#F59E0B] border border-[#D97706] flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-xs text-white">
              <Logo variant="full" tone="white" height={44} showTagline />
              <span className="text-xs font-semibold text-[#1A2E22] font-bold">White on Sun Orange (#F59E0B)</span>
            </div>

            {/* 5. White on Charcoal */}
            <div className="p-6 rounded-2xl bg-[#1A2E22] border border-[#143F27] flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-xs text-white">
              <Logo variant="full" tone="white" height={44} showTagline />
              <span className="text-xs font-semibold text-white/80">White on Charcoal (#1A2E22)</span>
            </div>

            {/* App Icon Rounded Square */}
            <div className="p-6 rounded-2xl bg-white border border-[#E3E0D3] flex items-center justify-center gap-4 min-h-[140px] shadow-xs">
              <img src="/favicon.svg" alt="App Icon Forest" className="w-16 h-16 rounded-2xl shadow-sm" />
              <div className="w-16 h-16 rounded-2xl bg-[#F8F6EF] border border-[#E3E0D3] flex items-center justify-center p-2 shadow-sm">
                <Logo variant="mark" tone="color" height={40} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#F59E0B] flex items-center justify-center p-2 shadow-sm">
                <Logo variant="mark" tone="white" height={40} />
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. CONTRAST RATIOS VERIFIED (WCAG AA & AAA) ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#1F5D3A]">
            3. Contrast Ratios Verification (WCAG Standards)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#1F5D3A] text-[#F8F6EF] shadow-xs">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Forest on Cream</span>
              <div className="text-3xl font-black mt-1 font-display">7.23 : 1</div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold">AAA Pass (Normal Text)</span>
            </div>
            <div className="p-5 rounded-xl bg-[#1F5D3A] text-white shadow-xs">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">White on Forest</span>
              <div className="text-3xl font-black mt-1 font-display">7.82 : 1</div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold">AAA Pass (All Sizes)</span>
            </div>
            <div className="p-5 rounded-xl bg-[#F59E0B] text-[#1A2E22] shadow-xs">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1A2E22]/80">Charcoal on Sun</span>
              <div className="text-3xl font-black mt-1 font-display">6.71 : 1</div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-black/15 text-[11px] font-bold">AA Pass (Normal) / AAA Large</span>
            </div>
            <div className="p-5 rounded-xl bg-[#F8F6EF] text-[#4F6355] border border-[#E3E0D3] shadow-xs">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#4F6355]/80">Muted on Cream</span>
              <div className="text-3xl font-black mt-1 font-display text-[#1A2E22]">5.98 : 1</div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#4F6355]/15 text-[#1A2E22] text-[11px] font-bold">AA Pass (4.5:1+)</span>
            </div>
          </div>
        </section>

        {/* ── 4. BRAND ELEMENTS ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#1F5D3A]">
            4. Brand Accent Elements (Leaf, Heart, Family Dots, Sprout)
          </h2>
          <div className="bg-white rounded-2xl border border-[#E3E0D3] p-6 flex flex-wrap items-center justify-around gap-6">
            <div className="flex flex-col items-center gap-2">
              <BrandLeaf size={32} color="#7CB342" />
              <span className="text-xs font-bold text-[#4F6355]">Leaf (#7CB342)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BrandHeart size={32} color="#F59E0B" />
              <span className="text-xs font-bold text-[#4F6355]">Heart (#F59E0B)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BrandFamilyDots size={32} color="#1F5D3A" />
              <span className="text-xs font-bold text-[#4F6355]">Family Dots</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BrandSprout size={32} forest="#1F5D3A" leaf="#7CB342" />
              <span className="text-xs font-bold text-[#4F6355]">Sprout</span>
            </div>
          </div>
        </section>

        {/* ── 5. LOADING SCREEN & ERROR STATE PREVIEW ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-[#1F5D3A]">
            5. Loading Screen Component (Mark with subtle pulse)
          </h2>
          <div className="bg-[#F8F6EF] rounded-2xl border border-[#E3E0D3] p-10 flex flex-col items-center justify-center text-center shadow-xs">
            <Logo variant="mark" tone="color" height={54} className="animate-pulse motion-reduce:animate-none" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#4F6355]">
              Loading FamilyFit...
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Hero,
  PartnerLogos,
  SolutionsGrid,
  CaseStudies,
  Footer,
  FileUploadZone,
  MetricsSummary,
  PredictionsTable,
  SingleOrderSimulator,
  ExportButton,
} from '@/components';
import { BatchPredictionResponse, HealthResponse } from '@/types/prediction';
import { predictBatchOrders, loadSampleOrdersCsv, checkBackendHealth } from '@/lib/api';
import {
  Sparkles,
  Layers,
  Cpu,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchResponse, setBatchResponse] = useState<BatchPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [workbenchTab, setWorkbenchTab] = useState<'batch' | 'single'>('batch');
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  // Check backend health status on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth()
      .then((res) => {
        if (mounted) setBackendHealth(res);
      })
      .catch((err) => {
        console.warn('Backend health check error:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Process batch prediction when a file is dropped or selected
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsLoading(true);

    try {
      const response = await predictBatchOrders(file);
      setBatchResponse(response);
    } catch (err: any) {
      console.error('Batch prediction failed:', err);
      setError(err?.message || 'Failed to process shipment file. Please check format.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample dataset
  const handleLoadSample = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const sampleFile = await loadSampleOrdersCsv();
      setSelectedFile(sampleFile);
      const response = await predictBatchOrders(sampleFile);
      setBatchResponse(response);
    } catch (err: any) {
      console.error('Sample loading failed:', err);
      setError(err?.message || 'Failed to load sample dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setBatchResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Global Floating Frosted Pill Navbar */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section (Obsidian depth + 3D fluid emerald contours) */}
        <Hero />

        {/* 3. Enterprise Ecosystem Partner Logos */}
        <PartnerLogos />

        {/* 4. Signature 4-Quadrant Solutions Grid with Central 3D Capsule */}
        <SolutionsGrid />

        {/* 5. Interactive Prediction Workbench */}
        <section
          id="workbench"
          className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-b border-white/[0.06] bg-obsidian-900/60 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-12">
            {/* Workbench Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-[0.2em]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Real-Time Prediction Workbench</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
                  Active ML <span className="text-gradient-emerald">Inference Suite</span>
                </h2>
                <p className="text-sage-400 text-sm sm:text-base leading-relaxed">
                  Evaluate supply chain risk profiles in seconds. Upload high-volume CSV manifests,
                  inspect delay probabilities, or simulate individual delivery routes on the fly.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="inline-flex items-center p-1.5 rounded-2xl glass-dark border border-white/10 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setWorkbenchTab('batch')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    workbenchTab === 'batch'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : 'text-sage-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Batch Manifest (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkbenchTab('single')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    workbenchTab === 'single'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : 'text-sage-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Single Order Simulator</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: BATCH CSV PIPELINE */}
            {workbenchTab === 'batch' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Upload Zone & Quick Specifications Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  <div className="lg:col-span-2">
                    <FileUploadZone
                      onFileSelect={handleFileSelect}
                      onLoadSample={handleLoadSample}
                      isLoading={isLoading}
                      selectedFile={selectedFile}
                      onClear={handleClear}
                      error={error}
                    />
                  </div>

                  {/* Manifest Guidelines & Telemetry Card */}
                  <div className="rounded-2xl glass-card p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wider uppercase text-sage-400">
                          Data Requirements
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          CSV UTF-8
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Standard Manifest Columns
                      </h4>
                      <p className="text-xs text-sage-400 leading-relaxed">
                        For optimal accuracy, your CSV manifest should ideally include:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span><strong className="text-white">Order Id:</strong> Unique identifier</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span><strong className="text-white">Customer City:</strong> Destination city</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span><strong className="text-white">Shipping Mode:</strong> Standard, First, Second</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span><strong className="text-white">Order Date:</strong> Timestamp / Date string</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs text-sage-400">
                        <span>Backend Service</span>
                        <span className="text-white font-mono flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          FastAPI v1.0.0
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-sage-400">
                        <span>Predictive Engine</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          LightGBM Classifier
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Dashboard (Displayed when response or file is processed) */}
                {batchResponse && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span>Manifest Execution Summary</span>
                      </h3>
                      <span className="text-xs text-sage-400 font-mono">
                        Generated in {batchResponse.summary.processing_time_ms.toFixed(1)} ms
                      </span>
                    </div>

                    <MetricsSummary
                      summary={batchResponse.summary}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {/* Tabular Predictions Grid */}
                {batchResponse && (
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>Order-Level Risk Telemetry</span>
                        </h3>
                        <p className="text-xs text-sage-400">
                          Granular predictions and calibrated delay probabilities for all {batchResponse.data.length} records.
                        </p>
                      </div>

                      <ExportButton orders={batchResponse.data} />
                    </div>

                    <PredictionsTable
                      orders={batchResponse.data}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SINGLE ORDER SIMULATOR */}
            {workbenchTab === 'single' && (
              <div className="animate-fadeIn">
                <SingleOrderSimulator />
              </div>
            )}
          </div>
        </section>

        {/* 6. Case Studies Showcase */}
        <CaseStudies />
      </main>

      {/* 7. Executive Tech Footer */}
      <Footer />
    </div>
  );
}

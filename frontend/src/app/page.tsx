'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Hero,
  CorridorMatrix,
  DelayStressTester,
  DisruptionEconomics,
  ModelArchitecture,
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
  FileSpreadsheet,
  Zap,
  Sliders,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchResponse, setBatchResponse] = useState<BatchPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [workbenchTab, setWorkbenchTab] = useState<'batch' | 'single' | 'stress'>('batch');
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

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

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsLoading(true);

    try {
      const response = await predictBatchOrders(file);
      setBatchResponse(response);
    } catch (err: unknown) {
      console.error('Batch prediction failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to process shipment file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const sampleFile = await loadSampleOrdersCsv();
      setSelectedFile(sampleFile);
      const response = await predictBatchOrders(sampleFile);
      setBatchResponse(response);
    } catch (err: unknown) {
      console.error('Sample loading failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sample dataset.');
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
    <div className="min-h-screen bg-jet-950 text-smoke-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section with Real Editorial Photography */}
        <Hero />

        {/* 2. Global Transit Corridors Matrix (Interactive Lane Disruption Telemetry) */}
        <CorridorMatrix />

        {/* 3. Core Prediction Workbench */}
        <section
          id="workbench"
          className="py-24 px-4 sm:px-6 lg:px-8 border-b border-smoke-800 bg-jet-950"
        >
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Workbench Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  Active freight disruption workbench
                </h2>
                <p className="mt-2 text-sm sm:text-base text-smoke-400 leading-relaxed">
                  Evaluate supply chain risk profiles in seconds. Upload high-volume CSV manifests, inspect delay probabilities, or simulate individual delivery routes.
                </p>
              </div>

              {/* Segmented Mode Control (Non-button connected toggle) */}
              <div className="segmented-control self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setWorkbenchTab('batch')}
                  className={
                    workbenchTab === 'batch'
                      ? 'segmented-item-active flex items-center gap-1.5'
                      : 'segmented-item-inactive flex items-center gap-1.5'
                  }
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Batch manifest (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkbenchTab('single')}
                  className={
                    workbenchTab === 'single'
                      ? 'segmented-item-active flex items-center gap-1.5'
                      : 'segmented-item-inactive flex items-center gap-1.5'
                  }
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Single order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkbenchTab('stress')}
                  className={
                    workbenchTab === 'stress'
                      ? 'segmented-item-active flex items-center gap-1.5'
                      : 'segmented-item-inactive flex items-center gap-1.5'
                  }
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>What-if stress tester</span>
                </button>
              </div>
            </div>

            {/* TAB 1: BATCH CSV MANIFEST */}
            {workbenchTab === 'batch' && (
              <div className="space-y-8">
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

                  {/* Specifications Card */}
                  <div className="panel-jet p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-smoke-400 font-medium">Manifest format</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-smoke-850 text-smoke-300 border border-smoke-750">
                          UTF-8 CSV
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Standard telemetry columns
                      </h3>
                      <ul className="space-y-2 text-xs text-smoke-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-smoke-400 flex-shrink-0" />
                          <span><strong className="text-white">Order Id:</strong> Unique order identifier</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-smoke-400 flex-shrink-0" />
                          <span><strong className="text-white">Customer City:</strong> Destination terminal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-smoke-400 flex-shrink-0" />
                          <span><strong className="text-white">Shipping Mode:</strong> Standard, First, Second</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-smoke-400 flex-shrink-0" />
                          <span><strong className="text-white">Order Date:</strong> ISO date format</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-smoke-800 space-y-2 text-xs text-smoke-400">
                      <div className="flex items-center justify-between">
                        <span>Backend pipeline</span>
                        <span className="text-smoke-200 font-mono">FastAPI v1.0.0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Predictive engine</span>
                        <span className="text-smoke-200 font-mono">Stacking Ensemble</span>
                      </div>
                    </div>
                  </div>
                </div>

                {batchResponse && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-smoke-400" />
                        <span>Execution summary</span>
                      </h3>
                      <span className="text-xs text-smoke-400 font-mono tabular-nums">
                        Generated in {batchResponse.summary.processing_time_ms.toFixed(1)} ms
                      </span>
                    </div>

                    <MetricsSummary
                      summary={batchResponse.summary}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {batchResponse && (
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          Order-level risk predictions
                        </h3>
                        <p className="text-xs text-smoke-400 mt-0.5">
                          Calibrated delay probabilities for all {batchResponse.data.length} records.
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

            {/* TAB 2: SINGLE ORDER SIMULATOR */}
            {workbenchTab === 'single' && (
              <div>
                <SingleOrderSimulator />
              </div>
            )}

            {/* TAB 3: DELAY SENSITIVITY STRESS TESTER */}
            {workbenchTab === 'stress' && (
              <div>
                <DelayStressTester />
              </div>
            )}
          </div>
        </section>

        {/* 4. Supply Chain Disruption Economics & Penalty Calculator */}
        <DisruptionEconomics />

        {/* 5. Four-Model Ensemble Architecture & Feature Importance */}
        <ModelArchitecture />

        {/* 6. Operational Case Studies (Art-Directed Editorial Photography) */}
        <CaseStudies />
      </main>

      <Footer />
    </div>
  );
}

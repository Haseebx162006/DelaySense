'use client';

import React, { useState } from 'react';
import { Cpu, Layers, GitBranch, Shield, ArrowRight } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  role: string;
  type: string;
  strengths: string;
  inferenceSpeed: string;
  treesDepth: string;
}

const MODELS: ModelInfo[] = [
  {
    id: 'lightgbm',
    name: 'LightGBM Classifier',
    role: 'Primary Fast Feature Splitter',
    type: 'Leaf-Wise Gradient Boosted Decision Tree',
    strengths: 'Optimized for high-throughput tabular inference and non-linear numerical splits.',
    inferenceSpeed: '< 4.2 ms / order',
    treesDepth: '300 trees · max leaf 31',
  },
  {
    id: 'xgboost',
    name: 'XGBoost Classifier',
    role: 'Regularized Depth Estimator',
    type: 'Exact Greedy Depth-Constrained Boosting',
    strengths: 'Prevents overfitting on volatile holiday spikes and rare origin-destination port pairs.',
    inferenceSpeed: '< 8.5 ms / order',
    treesDepth: '250 trees · max depth 6',
  },
  {
    id: 'catboost',
    name: 'CatBoost Classifier',
    role: 'Categorical Target Encoder',
    type: 'Symmetric Oblivious Decision Trees',
    strengths: 'Processes high-cardinality shipping destinations, product departments, and freight carriers directly without one-hot explosion.',
    inferenceSpeed: '< 11.0 ms / order',
    treesDepth: '400 trees · depth 6',
  },
  {
    id: 'meta-learner',
    name: 'Stacking Meta-Learner',
    role: 'Ensemble Consensus Blender',
    type: 'L2-Penalized Logistic Regression',
    strengths: 'Weights predictions from all three base models with decision threshold tuning (0.50 cutoff) to minimize false negatives on late arrivals.',
    inferenceSpeed: '< 0.8 ms / order',
    treesDepth: 'Weighted Logistic Layer',
  },
];

const FEATURES = [
  { name: 'Days for shipment (scheduled)', weight: 36, desc: 'Primary baseline transit window committed to consignee.' },
  { name: 'Shipping Mode', weight: 24, desc: 'Class of freight handling (Standard, First, Second Class, Same Day).' },
  { name: 'Customer City & Destination Port', weight: 18, desc: 'Geographic destination and local terminal infrastructure density.' },
  { name: 'Department & Category ID', weight: 12, desc: 'Cargo sensitivity, weight profile, and specialized handling requirements.' },
  { name: 'Order Item Profit & Discount Ratio', weight: 10, desc: 'Economic prioritization indicator influencing warehouse dispatch order.' },
];

export const ModelArchitecture: React.FC = () => {
  const [activeModelId, setActiveModelId] = useState<string>('lightgbm');

  const selectedModel = MODELS.find((m) => m.id === activeModelId) || MODELS[0];

  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-smoke-800 bg-jet-900/40">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading: Benefit first, no eyebrow */}
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Four-model stacking ensemble pipeline
          </h2>
          <p className="mt-3 text-sm sm:text-base text-smoke-400 leading-relaxed">
            DelaySense blends gradient boosted trees with target encoding and meta-learning calibration to minimize false negative late predictions.
          </p>
        </div>

        {/* Interactive Architecture Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Models Tab Selector */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs text-smoke-400 block mb-2 font-medium">
              Ensemble component models
            </span>
            {MODELS.map((m) => {
              const isActive = m.id === activeModelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModelId(m.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isActive
                      ? 'bg-jet-850 border-smoke-600 shadow-panel'
                      : 'bg-jet-900/60 border-smoke-800 hover:border-smoke-700 hover:bg-jet-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white">{m.name}</h3>
                    <span className="text-[10px] font-mono text-smoke-400">{m.inferenceSpeed}</span>
                  </div>
                  <p className="text-xs text-smoke-400 mt-1">{m.role}</p>
                </button>
              );
            })}
          </div>

          {/* Model Deep-Dive Detail Card */}
          <div className="lg:col-span-7 panel-jet-elevated p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs text-smoke-400 block">Model specification</span>
              <h3 className="text-xl font-bold text-white mt-1">{selectedModel.name}</h3>
              <p className="text-xs text-smoke-300 font-mono mt-0.5">{selectedModel.type}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-smoke-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Core architectural role:</span>
                <span className="text-smoke-200 font-medium">{selectedModel.role}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Hyperparameter geometry:</span>
                <span className="font-mono text-smoke-200 tabular-nums">{selectedModel.treesDepth}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-smoke-400">Inference benchmark:</span>
                <span className="font-mono text-smoke-200 tabular-nums">{selectedModel.inferenceSpeed}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-smoke-900 border border-smoke-800 space-y-1.5">
              <span className="text-xs font-semibold text-white block">Ensemble contribution:</span>
              <p className="text-xs text-smoke-300 leading-relaxed">{selectedModel.strengths}</p>
            </div>

            {/* Feature Weights Section */}
            <div className="space-y-3 pt-3 border-t border-smoke-800">
              <span className="text-xs font-semibold text-smoke-300 block">
                Top global feature weights (SHAP values)
              </span>
              <div className="space-y-2.5">
                {FEATURES.map((f) => (
                  <div key={f.name} className="space-y-1 text-xs">
                    <div className="flex justify-between text-smoke-300">
                      <span>{f.name}</span>
                      <span className="font-mono tabular-nums text-smoke-400">{f.weight}%</span>
                    </div>
                    <div className="w-full bg-smoke-900 h-1.5 rounded-full overflow-hidden border border-smoke-800">
                      <div className="bg-smoke-400 h-full rounded-full" style={{ width: `${f.weight * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

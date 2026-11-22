'use client';

import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadSampleOrdersCsv } from '@/lib/api';

export interface FileUploadZoneProps {
  onFileSelect: (file: File) => void | Promise<void>;
  onLoadSample?: () => void | Promise<void>;
  isLoading?: boolean;
  selectedFile?: File | null;
  onClear?: () => void;
  error?: string | null;
  className?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  onLoadSample,
  isLoading = false,
  selectedFile = null,
  onClear,
  error: externalError = null,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active error is either external from API/parent or internal from drag/drop validation
  const activeError = externalError || internalError;

  // Track elapsed processing time while isLoading is true
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setElapsedTime(0);
      const startTime = Date.now();
      timer = setInterval(() => {
        setElapsedTime(Number(((Date.now() - startTime) / 1000).toFixed(1)));
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const validateAndProcessFile = (file: File) => {
    setInternalError(null);

    // Validate CSV extension or MIME type
    const isCsvName = file.name.toLowerCase().endsWith('.csv');
    const isCsvType =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/csv' ||
      file.type === '';

    if (!isCsvName && !isCsvType) {
      setInternalError(`"${file.name}" is not a valid CSV file. Please upload a dataset with a .csv extension.`);
      return;
    }

    // Limit maximum size to 50MB for responsive browser handling
    const maxSizeInBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setInternalError('Dataset size exceeds the 50 MB limit. Please provide a smaller sample slice.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
    // Reset file input value so re-uploading the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSampleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || isSampleLoading) return;

    setInternalError(null);
    setIsSampleLoading(true);

    try {
      if (onLoadSample) {
        await onLoadSample();
      } else {
        const sampleFile = await loadSampleOrdersCsv();
        onFileSelect(sampleFile);
      }
    } catch (err) {
      console.error('Failed to load sample orders:', err);
      setInternalError('Could not load sample dataset. Please try again or upload a manual CSV.');
    } finally {
      setIsSampleLoading(false);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) {
      onClear();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={cn('w-full flex flex-col gap-3', className)}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      {/* Main Dropzone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-300 p-8 flex flex-col items-center justify-center text-center',
          selectedFile ? 'cursor-default' : 'cursor-pointer',
          isDragOver
            ? 'border-emerald-400 bg-emerald-950/30 shadow-glow-emerald-lg scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/30 bg-obsidian-900/80 shadow-glow-card'
            : 'border-white/10 bg-obsidian-900/50 hover:border-emerald-500/40 hover:bg-obsidian-850/60 shadow-glass'
        )}
      >
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* State 1: Loading / Processing */}
        {isLoading ? (
          <div className="w-full max-w-md flex flex-col items-center py-4 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Executing Inference Engine
              </h3>
              <p className="text-xs text-sage-400">
                Running LightGBM late-delivery scoring & telemetry analysis...
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-2 rounded-full bg-obsidian-800 border border-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 rounded-full animate-[radar_2s_ease-in-out_infinite] w-3/4" />
              </div>
              <div className="flex items-center justify-between text-xs text-sage-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Processing Telemetry
                </span>
                <span>{elapsedTime}s elapsed</span>
              </div>
            </div>
          </div>
        ) : selectedFile ? (
          /* State 2: File Uploaded & Active */
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-base truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Telemetry Ready
                  </span>
                </div>
                <p className="text-xs text-sage-400 mt-1 font-mono">
                  {formatFileSize(selectedFile.size)} • CSV Dataset
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 text-xs font-medium text-sage-200 bg-obsidian-800 hover:bg-obsidian-700 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-sage-400" />
                Change File
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors flex items-center gap-1.5"
                title="Clear current dataset"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Ready for Drop / Selection */
          <div className="space-y-4 py-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-obsidian-800/80 border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-500/40 transition-transform">
              <Upload className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Upload Supply Chain Orders CSV
              </h3>
              <p className="text-xs text-sage-400 max-w-sm mx-auto">
                Drag and drop your raw shipment telemetry or{' '}
                <span className="text-emerald-400 font-medium hover:underline">
                  browse local files
                </span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-sage-400">
              <span className="px-2 py-0.5 rounded bg-obsidian-800 border border-white/5 font-mono">
                .CSV only
              </span>
              <span>•</span>
              <span>Up to 50 MB</span>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSampleClick}
                disabled={isSampleLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all shadow-glow-emerald"
              >
                {isSampleLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Load Sample Dataset (100 orders)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert Banner */}
      {activeError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-200 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-300">File Error: </span>
            <span>{activeError}</span>
          </div>
          <button
            type="button"
            onClick={() => setInternalError(null)}
            className="text-rose-400 hover:text-rose-200 p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

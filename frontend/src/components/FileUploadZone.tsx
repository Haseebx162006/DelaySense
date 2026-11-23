'use client';

import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCw, X, Clock } from 'lucide-react';
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

  const activeError = externalError || internalError;

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
    const isCsvName = file.name.toLowerCase().endsWith('.csv');
    const isCsvType =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/csv' ||
      file.type === '';

    if (!isCsvName && !isCsvType) {
      setInternalError(`"${file.name}" is not a valid CSV file. Please upload a file with .csv format.`);
      return;
    }

    const maxSizeInBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setInternalError('File size exceeds 50 MB limit. Please slice the dataset.');
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
      setInternalError('Could not load sample dataset. Please upload a manual CSV.');
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'relative rounded-xl border p-8 flex flex-col items-center justify-center text-center transition-colors duration-150',
          selectedFile ? 'cursor-default' : 'cursor-pointer',
          isDragOver
            ? 'border-cherry-500 bg-smoke-900/90'
            : selectedFile
            ? 'border-smoke-700 bg-jet-900'
            : 'border-smoke-800 bg-jet-900/60 hover:border-smoke-700 hover:bg-jet-850'
        )}
      >
        {isLoading ? (
          <div className="w-full max-w-sm flex flex-col items-center py-4 space-y-4">
            <RefreshCw className="w-8 h-8 text-cherry-500 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Running ensemble inference</h3>
              <p className="text-xs text-smoke-400">
                Evaluating records across LightGBM, XGBoost, and CatBoost models...
              </p>
            </div>
            <div className="w-full bg-smoke-900 h-1.5 rounded-full overflow-hidden border border-smoke-800">
              <div className="bg-cherry-600 h-full w-2/3 rounded-full" />
            </div>
            <span className="font-mono text-xs tabular-nums text-smoke-400">
              {elapsedTime}s elapsed
            </span>
          </div>
        ) : selectedFile ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 rounded-lg bg-smoke-850 border border-smoke-700 text-smoke-300">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </span>
                  <span className="text-[11px] font-medium text-smoke-300 bg-smoke-800 border border-smoke-700 px-2 py-0.5 rounded">
                    Uploaded
                  </span>
                </div>
                <p className="text-xs text-smoke-400 mt-0.5 font-mono tabular-nums">
                  {formatFileSize(selectedFile.size)} · CSV manifest
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
              >
                <span>Replace file</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-lg border border-smoke-700 bg-smoke-850 text-smoke-400 hover:text-white hover:bg-smoke-800 transition-colors"
                title="Clear current file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-smoke-850 border border-smoke-700 flex items-center justify-center text-smoke-300">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Upload shipment manifest CSV
              </h3>
              <p className="text-xs text-smoke-400 max-w-sm mx-auto">
                Drag and drop your raw manifest file here, or{' '}
                <span className="text-cherry-400 hover:underline">browse files</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSampleClick}
                disabled={isSampleLoading}
                className="btn-cherry-sm"
              >
                {isSampleLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Load sample manifest (100 orders)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {activeError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-cherry-950/40 border border-cherry-800 text-cherry-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-cherry-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-cherry-300">Error: </span>
            <span>{activeError}</span>
          </div>
          <button
            type="button"
            onClick={() => setInternalError(null)}
            className="text-cherry-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

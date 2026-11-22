'use client';

import React, { useState } from 'react';
import { Download, Check, FileSpreadsheet } from 'lucide-react';
import { SingleOrderResponse } from '@/types/prediction';
import { cn } from '@/lib/utils';

export interface ExportButtonProps {
  orders: SingleOrderResponse[];
  filename?: string;
  className?: string;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  orders,
  filename = 'delaysense_predictions',
  className,
  disabled = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const hasData = orders && orders.length > 0;
  const isButtonDisabled = disabled || !hasData || isExporting;

  const handleExportCsv = () => {
    if (!hasData) return;

    setIsExporting(true);

    try {
      // CSV Column Headers
      const headers = [
        'Order ID',
        'Delay Status',
        'Late Delivery Risk (0/1)',
        'Delay Probability',
        'Risk Level',
        'Customer City',
        'Shipping Mode',
        'Order Date',
        'Order Region',
      ];

      // Format Rows
      const rows = orders.map((order) => {
        const isDelayedText = order.is_delayed === 1 ? 'Delayed' : 'On-Time';
        const probFormatted = `${(order.delay_probability * 100).toFixed(1)}%`;
        const city = (order.customer_city || '').replace(/"/g, '""');
        const mode = (order.shipping_mode || '').replace(/"/g, '""');
        const date = order.order_date || '';
        const region = (order.order_region || '').replace(/"/g, '""');

        return [
          order.order_id,
          `"${isDelayedText}"`,
          order.is_delayed,
          `"${probFormatted}"`,
          `"${order.risk_level}"`,
          `"${city}"`,
          `"${mode}"`,
          `"${date}"`,
          `"${region}"`,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\r\n');

      // Create Blob with UTF-8 BOM for Microsoft Excel compatibility
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasExported(true);
      setTimeout(() => {
        setHasExported(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportCsv}
      disabled={isButtonDisabled}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 select-none',
        hasExported
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
          : hasData
          ? 'bg-obsidian-800 text-white border-white/10 hover:bg-obsidian-700 hover:border-emerald-500/30 hover:text-emerald-300 shadow-sm'
          : 'bg-obsidian-900/40 text-sage-500 border-white/5 cursor-not-allowed opacity-50',
        className
      )}
      title={hasData ? `Export ${orders.length} predictions to CSV` : 'No predictions available to export'}
    >
      {hasExported ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exported CSV</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Results to CSV</span>
          {hasData && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-obsidian-950 font-mono text-sage-400">
              {orders.length}
            </span>
          )}
        </>
      )}
    </button>
  );
};

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
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 select-none',
        hasExported
          ? 'bg-smoke-800 text-smoke-100 border-smoke-600'
          : hasData
          ? 'bg-smoke-900 text-smoke-200 border-smoke-750 hover:bg-smoke-800 hover:text-white'
          : 'bg-jet-900 text-smoke-500 border-smoke-850 cursor-not-allowed opacity-50',
        className
      )}
      title={hasData ? `Export ${orders.length} predictions to CSV` : 'No predictions available'}
    >
      {hasExported ? (
        <>
          <Check className="w-3.5 h-3.5 text-smoke-200" />
          <span>Exported CSV</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-smoke-400" />
          <span>Export CSV</span>
          {hasData && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-smoke-800 font-mono text-smoke-300">
              {orders.length}
            </span>
          )}
        </>
      )}
    </button>
  );
};

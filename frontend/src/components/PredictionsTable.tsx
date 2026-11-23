'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { SingleOrderResponse, RiskLevel } from '@/types/prediction';
import { cn, formatPercent } from '@/lib/utils';

export interface PredictionsTableProps {
  orders: SingleOrderResponse[];
  isLoading?: boolean;
  className?: string;
  onSelectOrder?: (order: SingleOrderResponse) => void;
}

type SortField = 'delay_probability' | 'order_id' | 'risk_level';
type SortDirection = 'asc' | 'desc';

export const PredictionsTable: React.FC<PredictionsTableProps> = ({
  orders,
  isLoading = false,
  className,
  onSelectOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | RiskLevel>('All');
  const [sortField, setSortField] = useState<SortField>('delay_probability');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedRiskFilter !== 'All' && order.risk_level !== selectedRiskFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const idMatch = String(order.order_id).includes(query);
        const cityMatch = order.customer_city?.toLowerCase().includes(query) ?? false;
        const modeMatch = order.shipping_mode?.toLowerCase().includes(query) ?? false;
        return idMatch || cityMatch || modeMatch;
      }
      return true;
    });
  }, [orders, selectedRiskFilter, searchQuery]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'delay_probability') {
        comparison = a.delay_probability - b.delay_probability;
      } else if (sortField === 'order_id') {
        comparison = a.order_id - b.order_id;
      } else if (sortField === 'risk_level') {
        const weight: Record<RiskLevel, number> = { High: 3, Medium: 2, Low: 1 };
        comparison = weight[a.risk_level] - weight[b.risk_level];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredOrders, sortField, sortDirection]);

  const totalItems = sortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return sortedOrders.slice(startIndex, startIndex + pageSize);
  }, [sortedOrders, validCurrentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const riskCounts = useMemo(() => {
    const counts = { All: orders.length, High: 0, Medium: 0, Low: 0 };
    orders.forEach((o) => {
      if (counts[o.risk_level] !== undefined) {
        counts[o.risk_level]++;
      }
    });
    return counts;
  }, [orders]);

  if (isLoading) {
    return (
      <div className={cn('panel-jet p-6 space-y-4', className)}>
        <div className="h-8 bg-smoke-850 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-smoke-900 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('panel-jet overflow-hidden flex flex-col', className)}>
      {/* Table Filter Bar */}
      <div className="p-4 border-b border-smoke-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Risk Filter Segmented Control */}
        <div className="segmented-control self-start">
          <button
            type="button"
            onClick={() => {
              setSelectedRiskFilter('All');
              setCurrentPage(1);
            }}
            className={selectedRiskFilter === 'All' ? 'segmented-item-active' : 'segmented-item-inactive'}
          >
            All ({riskCounts.All})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRiskFilter('High');
              setCurrentPage(1);
            }}
            className={selectedRiskFilter === 'High' ? 'segmented-item-active text-cherry-300' : 'segmented-item-inactive'}
          >
            High risk ({riskCounts.High})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRiskFilter('Medium');
              setCurrentPage(1);
            }}
            className={selectedRiskFilter === 'Medium' ? 'segmented-item-active text-amber-300' : 'segmented-item-inactive'}
          >
            Medium risk ({riskCounts.Medium})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRiskFilter('Low');
              setCurrentPage(1);
            }}
            className={selectedRiskFilter === 'Low' ? 'segmented-item-active' : 'segmented-item-inactive'}
          >
            Low risk ({riskCounts.Low})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-smoke-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search order ID, city, mode..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-smoke-900 border border-smoke-800 text-xs text-white placeholder-smoke-500 focus:outline-none focus:border-smoke-600 transition-colors"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-smoke-300">
          <thead className="bg-smoke-900/60 text-smoke-400 border-b border-smoke-800 select-none">
            <tr>
              <th
                onClick={() => handleSort('order_id')}
                className="py-3 px-4 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3 text-smoke-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Destination city</th>
              <th className="py-3 px-4 font-medium">Shipping mode</th>
              <th
                onClick={() => handleSort('delay_probability')}
                className="py-3 px-4 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Delay probability</span>
                  <ArrowUpDown className="w-3 h-3 text-smoke-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('risk_level')}
                className="py-3 px-4 font-medium cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span>Risk tier</span>
                  <ArrowUpDown className="w-3 h-3 text-smoke-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-right">Predicted status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-smoke-850">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-smoke-500">
                  <Inbox className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <span>No orders matched your search criteria.</span>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const isLate = order.is_delayed === 1;
                return (
                  <tr
                    key={order.order_id}
                    onClick={() => onSelectOrder?.(order)}
                    className="hover:bg-smoke-850/40 transition-colors duration-100"
                  >
                    <td className="py-3 px-4 font-mono text-white font-medium tabular-nums">
                      #{order.order_id}
                    </td>
                    <td className="py-3 px-4 text-smoke-200">
                      {order.customer_city || '—'}
                    </td>
                    <td className="py-3 px-4 text-smoke-300">
                      {order.shipping_mode || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-smoke-900 h-1.5 rounded-full overflow-hidden border border-smoke-800">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              isLate ? 'bg-cherry-500' : 'bg-smoke-400'
                            )}
                            style={{ width: `${Math.round(order.delay_probability * 100)}%` }}
                          />
                        </div>
                        <span className={isLate ? 'text-cherry-300 font-semibold' : 'text-smoke-200'}>
                          {formatPercent(order.delay_probability * 100, false, 1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {order.risk_level === 'High' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cherry-300 bg-cherry-950/60 border border-cherry-800/80 px-2 py-0.5 rounded">
                          High
                        </span>
                      ) : order.risk_level === 'Medium' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                          Medium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-smoke-300 bg-smoke-800 border border-smoke-700 px-2 py-0.5 rounded">
                          Low
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isLate ? (
                        <span className="text-cherry-400 font-medium">Late delivery</span>
                      ) : (
                        <span className="text-smoke-400">On time</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar */}
      <div className="p-3 border-t border-smoke-800 flex items-center justify-between text-xs text-smoke-400 bg-smoke-900/30">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-smoke-900 border border-smoke-800 text-smoke-200 rounded px-2 py-1 text-xs focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="hidden sm:inline font-mono tabular-nums">
            Showing {(validCurrentPage - 1) * pageSize + 1}–{Math.min(validCurrentPage * pageSize, totalItems)} of {totalItems}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className="p-1.5 rounded border border-smoke-800 text-smoke-400 hover:text-white hover:bg-smoke-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono tabular-nums">
            {validCurrentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="p-1.5 rounded border border-smoke-800 text-smoke-400 hover:text-white hover:bg-smoke-800 disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  CheckCircle,
  Filter,
  Inbox,
  Clock,
  MapPin,
  Truck,
} from 'lucide-react';
import { SingleOrderResponse, RiskLevel } from '@/types/prediction';
import { cn, getRiskBadgeClass, formatPercent } from '@/lib/utils';

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

  // Filter & Search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Risk Level Tab Filter
      if (selectedRiskFilter !== 'All' && order.risk_level !== selectedRiskFilter) {
        return false;
      }

      // Search Filter (matches Order ID, City, Shipping Mode)
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

  // Sorting logic
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

  // Pagination calculation
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
      setSortDirection('desc'); // default to descending for risk/prob
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
      <div className={cn('rounded-2xl border border-white/10 bg-obsidian-900/60 p-6 space-y-4', className)}>
        <div className="flex justify-between items-center animate-pulse">
          <div className="w-48 h-8 bg-obsidian-800 rounded-lg" />
          <div className="w-32 h-8 bg-obsidian-800 rounded-lg" />
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-obsidian-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur-md overflow-hidden flex flex-col shadow-glow-card',
        className
      )}
    >
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Risk Level Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-800/80 border border-white/5 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedRiskFilter('All');
                setCurrentPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                selectedRiskFilter === 'All'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-sage-400 hover:text-white'
              )}
            >
              <span>All Orders</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-obsidian-900/80 font-mono">
                {riskCounts.All}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRiskFilter('High');
                setCurrentPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                selectedRiskFilter === 'High'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-sage-400 hover:text-rose-300'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>High Risk</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/10 font-mono text-rose-300">
                {riskCounts.High}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRiskFilter('Medium');
                setCurrentPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                selectedRiskFilter === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-sage-400 hover:text-amber-300'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Medium Risk</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 font-mono text-amber-300">
                {riskCounts.Medium}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRiskFilter('Low');
                setCurrentPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                selectedRiskFilter === 'Low'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-sage-400 hover:text-emerald-300'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Low Risk</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 font-mono text-emerald-300">
                {riskCounts.Low}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Order ID, City..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-800/80 border border-white/10 text-xs text-white placeholder-sage-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {paginatedOrders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-obsidian-800 border border-white/5 flex items-center justify-center mb-3">
              <Inbox className="w-7 h-7 text-sage-400" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Matching Orders Found</h4>
            <p className="text-xs text-sage-400 max-w-xs mt-1">
              {searchQuery
                ? `No orders match query "${searchQuery}". Try a different term or clear filter.`
                : 'No orders available in this risk category.'}
            </p>
            {(searchQuery || selectedRiskFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRiskFilter('All');
                }}
                className="mt-4 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-semibold text-sage-400 uppercase tracking-wider bg-obsidian-950/40">
                <th
                  scope="col"
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('order_id')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Order ID</span>
                    {sortField === 'order_id' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-sage-500" />
                    )}
                  </div>
                </th>

                <th scope="col" className="py-3 px-4">
                  <span>Delay Status</span>
                </th>

                <th
                  scope="col"
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('delay_probability')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Delay Probability</span>
                    {sortField === 'delay_probability' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-sage-500" />
                    )}
                  </div>
                </th>

                <th
                  scope="col"
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('risk_level')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Risk Level</span>
                    {sortField === 'risk_level' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-sage-500" />
                    )}
                  </div>
                </th>

                <th scope="col" className="py-3 px-4 hidden md:table-cell">
                  <span>Routing Telemetry</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {paginatedOrders.map((order) => {
                const isDelayed = order.is_delayed === 1;
                const probPercent = Math.round(order.delay_probability * 100);

                return (
                  <tr
                    key={order.order_id}
                    onClick={() => onSelectOrder?.(order)}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-white group-hover:text-emerald-300 transition-colors">
                      #{order.order_id}
                    </td>

                    {/* Delay Status */}
                    <td className="py-3.5 px-4">
                      {isDelayed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-300 bg-rose-500/15 border border-rose-500/25 px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          Late Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          On-Time
                        </span>
                      )}
                    </td>

                    {/* Delay Probability with Mini Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-12 font-mono font-medium text-white text-right">
                          {formatPercent(order.delay_probability, true, 0)}
                        </span>
                        <div className="w-24 h-2 rounded-full bg-obsidian-800 border border-white/5 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              order.risk_level === 'High'
                                ? 'bg-gradient-to-r from-rose-500 to-red-400'
                                : order.risk_level === 'Medium'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            )}
                            style={{ width: `${Math.min(100, Math.max(5, probPercent))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border tracking-wide uppercase',
                          getRiskBadgeClass(order.risk_level)
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            order.risk_level === 'High'
                              ? 'bg-rose-400'
                              : order.risk_level === 'Medium'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          )}
                        />
                        {order.risk_level} Risk
                      </span>
                    </td>

                    {/* Routing Telemetry (City & Mode) */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-sage-400">
                      <div className="flex items-center gap-3 text-[11px]">
                        {order.customer_city && (
                          <span className="flex items-center gap-1 truncate max-w-[140px]" title={order.customer_city}>
                            <MapPin className="w-3 h-3 text-sage-500 shrink-0" />
                            {order.customer_city}
                          </span>
                        )}
                        {order.shipping_mode && (
                          <span className="flex items-center gap-1 truncate max-w-[140px] text-sage-300 font-medium">
                            <Truck className="w-3 h-3 text-emerald-500/70 shrink-0" />
                            {order.shipping_mode}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination & Footer Controls */}
      <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sage-400">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="font-medium text-white font-mono">
            {totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1} -{' '}
            {Math.min(validCurrentPage * pageSize, totalItems)}
          </span>
          <span>of</span>
          <span className="font-medium text-white font-mono">{totalItems}</span>
          <span>orders</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-obsidian-800 border border-white/10 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg bg-obsidian-800 border border-white/10 text-sage-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg bg-obsidian-800 border border-white/10 text-sage-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-white text-xs">
              {validCurrentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg bg-obsidian-800 border border-white/10 text-sage-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg bg-obsidian-800 border border-white/10 text-sage-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

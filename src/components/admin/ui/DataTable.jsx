import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function DataTable({ 
  headers = [], 
  data = [], 
  loading = false, 
  pagination = null, 
  emptyMessage = 'Kayıt bulunamadı.' 
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto w-full border border-slate-800 rounded-xl bg-slate-900/10">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase text-slate-400 bg-slate-900/50 border-b border-slate-800">
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 font-semibold ${header.className || ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              // Loading skeletons
              [...Array(5)].map((_, rowIdx) => (
                <tr key={rowIdx} className="animate-pulse">
                  {headers.map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {headers.map((header, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-6 py-4 ${header.className || ''}`}
                    >
                      {header.render ? header.render(row) : (row[header.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 opacity-40 text-slate-400" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-400">
            Sayfa <span className="font-semibold text-white">{pagination.page}</span> / <span className="font-semibold text-white">{pagination.totalPages}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

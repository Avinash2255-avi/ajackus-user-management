import React from 'react'

export default function Pagination({ total, page, pageSize, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="pagination">
      <div>
        Page {page} / {totalPages}
      </div>
      <div>
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
      </div>
      <div>
        <select value={pageSize} onChange={e => { onPageSize(Number(e.target.value)); onPage(1) }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  )
}

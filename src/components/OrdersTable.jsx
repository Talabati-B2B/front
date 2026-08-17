import { useState, useMemo } from 'react'
import {
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

import { IoIosSearch } from "react-icons/io";
import { orders, STOCK_STATUS } from '../services/order/order'

const COLUMNS = [
  'رقم الطلب',
  'اسم المتجر',
  'تاريخ الطلب',
  'القيمة الإجمالية',
  'حالة الطلب',
  'إجراءات',
]

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none flex items-center gap-8 rounded-lg border border-[#C4C6D0] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#6B7280] transition-colors hover:bg-gray-50 outline-none pr-10"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" strokeWidth={2} />
    </div>
  )
}

function ActionButton({ onClick , icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00000033] text-[#747780] transition-colors hover:bg-gray-50 hover:text-heading"
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  )
}

function PageButton({ children, active, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        active
          ? 'flex h-9 min-w-9 items-center justify-center rounded-lg bg-navy px-2 text-sm font-bold text-white'
          : 'flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-white px-2 text-sm font-semibold text-heading transition-colors hover:bg-gray-50'
      }
    >
      {children}
    </button>
  )
}

export default function OrdersTable() {
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  const stockOptions = Object.entries(STOCK_STATUS).map(([value, s]) => ({
    value,
    label: s.label,
  }))

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        search.trim() === '' ||
        order.storeName.includes(search) ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase())

      const matchesStock = stockFilter === '' || order.status === stockFilter

      return matchesSearch && matchesStock
    })
  }, [search, stockFilter])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-[#C4C6D0] bg-white px-4 py-2.5">
          <IoIosSearch className="h-4 w-4 shrink-0 text-body" strokeWidth={2} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المنتج أو SKU..."
            className="w-full bg-transparent text-[12px] text-[#6B7280] outline-none placeholder:text-body/70"
          />
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-body" strokeWidth={2} />
        </div>
        <div className="flex gap-5">
          <FilterSelect
            label="كل الفئات"
            className="text-[#191C1D]"
            value=""
            options={[]}
            onChange={() => {}}
          />
          <FilterSelect
            label="حالة المخزون"
            value={stockFilter}
            options={stockOptions}
            onChange={setStockFilter}
          />
        </div>
      </div>

      <div>
        <div className="overflow-hidden rounded-t-xl border border-[#C4C6D0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-navy text-white">
                {COLUMNS.map((col) => (
                  <th key={col} className="whitespace-nowrap text-center px-6 py-4 text-sm font-bold bg-[#062454]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-6 py-10 text-center text-sm text-body">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = STOCK_STATUS[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-[#747780]" dir="ltr">
                        {order.orderNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#000000]">
                        {order.storeName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-[#64748B]" dir="ltr">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#000000]">
                        <span className="flex items-center gap-2.5">
                          {order.total}
                          <span className="text-[#000000BA] text-[22px]">₪</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2">
                          <ActionButton onClick={() => {
                            alert ('hello')
                          }} icon={Eye} label={`عرض الطلب ${order.orderNumber}`} />
                          <ActionButton icon={Pencil} label={`تعديل الطلب ${order.orderNumber}`} />
                          <ActionButton icon={Trash2} label={`حذف الطلب ${order.orderNumber}`} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-xl border border-[#C4C6D0] bg-[#F3F4F5] px-6 py-3 shadow-sm">
        <span className="text-sm text-body">عرض 1 إلى 5 من أصل 1,284 طلب</span>
        <div className="flex items-center gap-2">
          <PageButton label="الصفحة السابقة">
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </PageButton>
          <PageButton active>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <span className="px-1 text-sm text-body">...</span>
          <PageButton>312</PageButton>
          <PageButton label="الصفحة التالية">
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </PageButton>
        </div>
      </div>
      </div>
    </section>
  )
}

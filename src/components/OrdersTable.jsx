import { useState, useMemo } from 'react'
import {
  SlidersHorizontal,
  ChevronDown,
  Eye,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

import { IoIosSearch } from "react-icons/io";
import { orders } from '../services/order/order'

const COLUMNS = [
  'رقم الطلب',
  'اسم المتجر',
  'تاريخ الطلب',
  'القيمة الإجمالية',
  'حالة الطلب',
  'إجراءات',
]

const ITEMS_PER_PAGE = 5

function FilterSelect({ label, value, options, onChange, disabled = false }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none flex items-center gap-8 rounded-lg border border-[#C4C6D0] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#6B7280] transition-colors hover:bg-gray-50 outline-none pr-10 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
        strokeWidth={2}
      />
    </div>
  )
}

function ActionButton({ onClick, icon: Icon, label, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00000033] text-[#747780] transition-colors hover:bg-gray-50 hover:text-heading disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#747780]"
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  )
}

function PageButton({
  children,
  active = false,
  label,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={
        active
          ? 'flex h-9 min-w-9 items-center justify-center rounded-lg bg-navy px-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70'
          : 'flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-white px-2 text-sm font-semibold text-heading transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
      }
    >
      {children}
    </button>
  )
}

export default function OrdersTable() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (normalizedSearch === '') {
      return orders
    }

    return orders.filter((order) => {
      return (
        order.storeName.toLowerCase().includes(normalizedSearch) ||
        order.orderNumber.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [search])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  )

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const firstVisibleItem =
    filteredOrders.length === 0 ? 0 : startIndex + 1

  const lastVisibleItem =
    filteredOrders.length === 0
      ? 0
      : Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-[#C4C6D0] bg-white px-4 py-2.5">
          <IoIosSearch
            className="h-4 w-4 shrink-0 text-body"
            strokeWidth={2}
          />

          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="ابحث برقم الطلب أو اسم المتجر..."
            className="w-full bg-transparent text-[12px] text-[#6B7280] outline-none placeholder:text-body/70"
          />

          <SlidersHorizontal
            className="h-4 w-4 shrink-0 text-body"
            strokeWidth={2}
          />
        </div>

        <div className="flex gap-5">
          <FilterSelect
            label="حالة الطلب"
            value=""
            options={[]}
            onChange={() => {}}
            disabled
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
                    <th
                      key={col}
                      className="whitespace-nowrap text-center px-6 py-4 text-sm font-bold bg-[#062454]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="px-6 py-10 text-center text-sm text-body"
                    >
                      لا توجد نتائج مطابقة
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td
                        className="whitespace-nowrap px-6 py-5 text-sm text-[#747780]"
                        dir="ltr"
                      >
                        {order.orderNumber}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#000000]">
                        {order.storeName}
                      </td>

                      <td
                        className="whitespace-nowrap px-6 py-5 text-sm text-[#64748B]"
                        dir="ltr"
                      >
                        {order.date}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#000000]">
                        <span className="flex items-center gap-2.5">
                          {order.total}
                          <span className="text-[#000000BA] text-[22px]">
                            ₪
                          </span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center text-sm text-[#747780]">
                        —
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon={Eye}
                            label={`عرض الطلب ${order.orderNumber}`}
                            disabled
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-xl border border-[#C4C6D0] bg-[#F3F4F5] px-6 py-3 shadow-sm">
          <span className="text-sm text-body">
            عرض {firstVisibleItem} إلى {lastVisibleItem} من أصل{' '}
            {filteredOrders.length} سجل متاح
          </span>

          <div className="flex items-center gap-2">
            <PageButton
              label="الصفحة السابقة"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </PageButton>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1

              return (
                <PageButton
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  label={`الصفحة ${pageNumber}`}
                  onClick={() => setCurrentPage(pageNumber)}
                  disabled={totalPages === 1}
                >
                  {pageNumber}
                </PageButton>
              )
            })}

            <PageButton
              label="الصفحة التالية"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </PageButton>
          </div>
        </div>
      </div>
    </section>
  )
}
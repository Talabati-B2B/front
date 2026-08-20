export default function Pagination({
  currentPage = 1,
  totalItems,
  itemsPerPage = 5,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    onPageChange(page);
  };

  const next = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Prev */}
      <button
        onClick={prev}
        className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => goToPage(num)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === num
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={next}
        className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

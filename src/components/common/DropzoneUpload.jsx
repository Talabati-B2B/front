import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiCheck } from "react-icons/fi";

export default function DropzoneUpload({ file, onChange, error }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onChange(accepted[0]);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div dir="rtl" className="flex flex-col gap-1.5">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition
          ${
            isDragActive
              ? "border-orange-400 bg-orange-50"
              : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"
          }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="text-green-500" size={20} strokeWidth={3} />
            </div>
            <p className="text-sm text-green-600 font-medium">{file.name}</p>
            <p className="text-xs text-gray-400"> اضغط للتغيير </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUploadCloud className="text-gray-400" size={20} />
            </div>
            <p className="text-sm text-gray-500"> اسحب وأفلت الملف هنا أو </p>
            <span className="text-xs bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg inline-flex items-center gap-1">
              <FiUploadCloud size={13} />
              اختر ملفاً من جهازك
            </span>
            <p className="text-xs text-gray-400">
              الملفات المسموح بها: PNG،JPG،PDF (الحد الأقصى 5MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

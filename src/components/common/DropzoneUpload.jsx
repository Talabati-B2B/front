import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiCheck } from "react-icons/fi";

const MAX_SIZE = 5 * 1024 * 1024;

const REJECTION_MESSAGES = {
  "file-too-large": "حجم الملف أكبر من 5MB",
  "file-invalid-type": "نوع الملف غير مدعوم، المسموح PNG أو JPG أو PDF",
  "too-many-files": "يمكن رفع ملف واحد فقط",
};

export default function DropzoneUpload({ file, onChange, error }) {
  // الملفات المرفوضة كانت تُهمل بصمت، فيظن المستخدم أن الرفع نجح
  const [rejectionError, setRejectionError] = useState("");

  const onDrop = useCallback(
    (accepted, rejected) => {
      if (accepted.length > 0) {
        setRejectionError("");
        onChange(accepted[0]);
        return;
      }

      const code = rejected?.[0]?.errors?.[0]?.code;
      setRejectionError(REJECTION_MESSAGES[code] ?? "تعذّر رفع هذا الملف");
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
    maxSize: MAX_SIZE,
  });

  const visibleError = rejectionError || error;

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
      {visibleError && (
        <p className="text-xs text-red-500 font-medium">{visibleError}</p>
      )}
    </div>
  );
}

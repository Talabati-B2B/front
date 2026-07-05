import Button from "../../../../components/common/Button";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function NavigationBtns({
  onNext,
  onBack,
  nextLabel = " التالي ",
  showBack = true,
  nextDisabled = false,
  isSubmit = false,
}) {
  return (
    <div
      className={`flex flex-row-reverse gap-3 mt-6 ${showBack ? "justify-between" : "justify-center"}`}
    >
      <Button
        type={isSubmit ? "submit" : "button"}
        onClick={onNext}
        disabled={nextDisabled}
        variant="primary"
        fullWidth
      >
        {nextLabel}
        <FiArrowLeft size={15} />
      </Button>

      {showBack && (
        <Button type="button" onClick={onBack} variant="outline" fullWidth>
          <FiArrowRight size={15} />
          رجوع
        </Button>
      )}
    </div>
  );
}

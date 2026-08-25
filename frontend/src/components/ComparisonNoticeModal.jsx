import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TriangleAlert } from "lucide-react";
import ButtonComponent from "./ButtonComponent";
import { clearNotice } from "../features/plans/comparedPlansSlice";

const ComparisonNoticeModal = () => {
  const dispatch = useDispatch();
  const notice = useSelector((state) => state.comparedPlans.notice);

  // Escape dismisses, matching the backdrop click.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") dispatch(clearNotice());
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  if (!notice) return null;

  return (
    <div
      className="notice-modal p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="comparison-notice-title"
      aria-describedby="comparison-notice-body"
    >
      <div className="notice-modal-icon">
        <TriangleAlert size={26} strokeWidth={2.25} />
      </div>
      <h2 id="comparison-notice-title" className="notice-modal-title">
        {notice.title}
      </h2>
      <p id="comparison-notice-body" className="notice-modal-body">
        {notice.msg}
      </p>
      <p className="notice-modal-hint">
        Remove a plan from your comparison to make room for another one.
      </p>
      {/* autoFocus lands keyboard and screen reader users inside the dialog */}
      <ButtonComponent
        autoFocus
        styling="bg-brand h-11 w-full mt-1"
        text="Got it"
        onPress={() => dispatch(clearNotice())}
      />
    </div>
  );
};

export default ComparisonNoticeModal;

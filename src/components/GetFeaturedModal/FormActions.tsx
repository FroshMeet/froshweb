
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 border-0"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

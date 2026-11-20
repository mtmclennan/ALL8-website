"use client";

import type { ButtonProps } from "./ui/Button";

import { useLeadModal } from "./LeadModalProvider";
import Button from "./ui/Button";

export default function LeadReviewButton(
  props: Pick<ButtonProps, "children" | "size">,
) {
  const { openModal } = useLeadModal();

  return <Button {...props} onClick={openModal} />;
}

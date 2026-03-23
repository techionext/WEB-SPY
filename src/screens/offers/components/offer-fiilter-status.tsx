import { ConnectForm } from "@/components/connect-form/connect-form";
import PopoverFilterWrapper from "@/components/popover-filter-wrapper.tsx/popover-filter-wrapper";
import TagGroupItem from "@/components/tag-group-item/tag-group-item";
import { useFilterByMultiSelect } from "@/hooks/useFilterByMultiSelect";

import { CheckboxGroup } from "@heroui/react";
import { Controller } from "react-hook-form";

export const StatusOfferFilter = () => {
  const { selectedValues: selectedStatus, onToggleValue: onToggleStatus } = useFilterByMultiSelect({
    queryKey: "affiliateStatus",
  });

  const STATUS_LABELS = {
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado",
    PENDING: "Pendente",
  };

  return (
    <PopoverFilterWrapper
      hasValue={selectedStatus.length > 0}
      title="Status da solicitação"
      buttonProps={{
        size: "md",
      }}
      classNameContent="max-w-[545px]"
      onChange={(data) => {
        onToggleStatus(data.status ?? "");
      }}
    >
      <ConnectForm>
        {({ control }) => (
          <Controller
            control={control}
            defaultValue={selectedStatus}
            name="affiliateStatus"
            render={({ field }) => (
              <CheckboxGroup {...field} className="gap-1" orientation="horizontal">
                {Object.keys(STATUS_LABELS).map((status) => (
                  <TagGroupItem key={status} value={status}>
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
                  </TagGroupItem>
                ))}
              </CheckboxGroup>
            )}
          />
        )}
      </ConnectForm>
    </PopoverFilterWrapper>
  );
};

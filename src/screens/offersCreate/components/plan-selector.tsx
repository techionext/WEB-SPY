import { Checkbox, Card, CardBody } from "@heroui/react";
import { useEffect } from "react";
import { IPlan } from "@/types/plan/plan.type";
import { Controller, useFormContext } from "react-hook-form";
import { formatCurrency } from "@/utils/formatCurrency";
import { Field } from "@/components/field/field";

interface PlanSelectorProps {
  plans: IPlan[];
  selectedPlans: Array<{ id: string; cpa: string }>;
  onPlansChange: (plans: Array<{ id: string; cpa: string }>) => void;
  error?: any;
}

export const PlanSelector = ({ plans, selectedPlans, onPlansChange, error }: PlanSelectorProps) => {
  const { control, watch, setValue, getValues } = useFormContext();
  const currency = watch("currency") || "BRL";

  useEffect(() => {
    const currentPlans = getValues("plans") || [];
    if (currentPlans) {
      currentPlans.forEach((plan: any, index: number) => {
        if (plan.cpa) {
          const rawValue = Number(plan.cpa.toString().replace(/[^0-9]/g, "")) || 0;
          setValue(`plans.${index}.cpa`, formatCurrency(rawValue, false, currency));
        }
      });
    }
  }, [currency, setValue, getValues]);

  const handleTogglePlan = (planId: string, isSelected: boolean) => {
    if (isSelected) {
      const newPlan = { id: planId, cpa: formatCurrency(0, false, currency) };
      onPlansChange([...selectedPlans, newPlan]);
    } else {
      onPlansChange(selectedPlans.filter((p) => p.id !== planId));
    }
  };

  const isPlanSelected = (planId: string) => {
    return selectedPlans.some((p) => p.id === planId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Planos Disponíveis</h3>
        <p className="text-sm text-default-500 mt-1">
          Selecione os planos que esta oferta terá acesso e configure o link de afiliação e CPA
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {plans.map((plan, index) => {
          const isSelected = isPlanSelected(plan.id);

          return (
            <Card key={plan.id} className="bg-default-50">
              <CardBody className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={(checked) => handleTogglePlan(plan.id, checked)}
                      classNames={{
                        base: "mt-1",
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{plan.title}</h4>
                      <p className="text-sm text-default-500 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                      <Controller
                        control={control}
                        name={`plans.${index}.cpa`}
                        render={({ field }) => (
                          <Field
                            errorMessage={error ? error[0]?.cpa?.message : ""}
                            isInvalid={!!error}
                            label="CPA"
                            labelPlacement="outside"
                            placeholder="0.00"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(
                                formatCurrency(
                                  Number(e?.target?.value?.replace(/[^0-9]/g, "")) || 0,
                                  false,
                                  currency,
                                ),
                              )
                            }
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

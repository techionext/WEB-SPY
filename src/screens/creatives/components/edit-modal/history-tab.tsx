import { Icon } from "@iconify/react";
import { Button, Input, Spinner, DatePicker } from "@heroui/react";
import { useState } from "react";
import {
  useHistoryCreativeQuery,
  useCreateHistoryCreativeMutation,
} from "@/services/creative/creative.service";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import dayjs from "dayjs";
import { parseDate } from "@internationalized/date";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface HistoryTabProps {
  creative: ILabsCreative;
}

export const HistoryTab = ({ creative }: HistoryTabProps) => {
  const { data: history, isLoading } = useHistoryCreativeQuery({ id: creative.id });
  const [createHistory, { isLoading: isUpdating }] = useCreateHistoryCreativeMutation();

  const [newDate, setNewDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [newQuantity, setNewQuantity] = useState("0");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");

  const handleAdd = async () => {
    await createHistory({
      id: creative.id,
      day: newDate,
      quantity: Number(newQuantity),
    }).unwrap();
    setNewQuantity("0");
  };

  const handleUpdate = async (day: string) => {
    await createHistory({
      id: creative.id,
      day,
      quantity: Number(editQuantity),
    }).unwrap();
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-content2/30 p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-default-400">
          <Icon icon="solar:add-circle-outline" width={16} />
          <span className="text-xs font-bold tracking-widest uppercase">Novo Registro</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label={
              <div className="flex items-center gap-2 text-default-400">
                <Icon icon="solar:calendar-minimalistic-linear" width={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Data</span>
              </div>
            }
            labelPlacement="outside"
            value={parseDate(newDate)}
            onChange={(date) => date && setNewDate(date.toString())}
            showMonthAndYearPickers
          />
          <Input
            type="number"
            label={
              <div className="flex items-center gap-2 text-default-400">
                <Icon icon="solar:bill-list-linear" width={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Qtd. Anúncios</span>
              </div>
            }
            labelPlacement="outside"
            placeholder="0"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
        </div>

        <Button
          color="primary"
          variant="flat"
          className="bg-primary/10 text-primary font-bold h-12 rounded-xl"
          onPress={handleAdd}
          isLoading={isUpdating && !editingId}
          startContent={!isUpdating || editingId ? <Icon icon="solar:plus-bold" /> : null}
        >
          Adicionar registro
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-default-400">
          <Icon icon="solar:history-linear" width={16} />
          <span className="text-xs font-bold tracking-widest uppercase">
            Registros ({history?.length || 0})
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {history?.map((item) => (
            <div
              key={item.id}
              className="bg-content2/30 px-6 py-4 rounded-2xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon="solar:calendar-minimalistic-linear"
                  className="text-default-400 text-lg mb-1"
                />
                <span className="text-sm font-medium text-default-600">
                  {dayjs(item.day.split("T")[0]).format("DD [de] MMM [de] YYYY")}
                </span>
              </div>

              <div className="flex items-center gap-4 flex-1 justify-end max-w-[200px]">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      size="sm"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      variant="bordered"
                      className="text-sm font-bold"
                    />
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="success"
                        onPress={() => handleUpdate(item.day)}
                        isLoading={isUpdating && editingId === item.id}
                      >
                        <Icon icon="solar:check-read-bold" className="text-lg" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => setEditingId(null)}
                      >
                        <Icon icon="solar:close-circle-bold" className="text-lg" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3 items-center">
                      <span className="text-lg font-bold">{item.quantity}</span>
                      <span className="text-xs font-bold text-default-400 uppercase tracking-widest">
                        Anúncios
                      </span>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-default-400 hover:text-white"
                      onPress={() => {
                        setEditingId(item.id);
                        setEditQuantity(item.quantity.toString());
                      }}
                    >
                      <Icon icon="solar:pen-bold" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { options } from "@/lib/data";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
// import { useState } from "react";

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {

  return (
    <div className="flex justify-center mt-4">
      <Combobox 
        items={options}
        onValueChange={(option) => setDateQuery(option.value)}
      >
        <ComboboxInput
          placeholder={ dateQuery
            ? options.find((option) => option.value === dateQuery)?.label
            : options[0].label
          }
          className="bg-gradient-card border-2"
          readOnly
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )

}

export default DateTimeFilter


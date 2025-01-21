import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

export interface PhoneNumberEditorProps {
  value: string;
  height?: string;
  label?: string;
  onChange: (value: string) => void;
}

export default function PhoneNumberEditor(props: PhoneNumberEditorProps) {
  return (
    <PhoneInput
      country={"us"}
      value={props.value}
      specialLabel={props.label || ""}
      onChange={props.onChange}
      inputProps={{
        name: "phone",
        required: true,
        autoFocus: true,
      }}
      dropdownStyle={{
        zIndex: 1000,
      }}
      placeholder="Il tuo numero di telefono"
      inputStyle={{
        width: "100%",
        height: props.height || undefined,
        borderRadius: "4px",
        borderColor: "#c4c4c4",
      }}
    />
  );
}

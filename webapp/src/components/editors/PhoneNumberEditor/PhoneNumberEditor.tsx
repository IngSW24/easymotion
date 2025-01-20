import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

export interface PhoneNumberEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneNumberEditor(props: PhoneNumberEditorProps) {
  return (
    <PhoneInput
      country={"us"}
      value={props.value}
      specialLabel=""
      onChange={props.onChange}
      inputProps={{
        name: "phone",
        required: true,
        autoFocus: true,
      }}
      placeholder="Il tuo numero di telefono"
      inputStyle={{
        width: "100%",
        height: "56px",
        borderRadius: "4px",
        borderColor: "#c4c4c4",
      }}
      containerStyle={{ marginBottom: "16px" }}
    />
  );
}

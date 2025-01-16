import FormComponent from "../components/ui/FormComponent/FormComponent";

export default function PersonalSignUpPageComp() {
  return (
    <FormComponent
      title="Benvenuto in Easymotion"
      description="Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ..."
      textFieldNumber={8}
      checkbox={true}
      buttonName="Registrati"
      flexDirectionParam="column"
      fieldName={[
        "nome",
        "secondo nome",
        "cognome",
        "telefono",
        "data di nascita",
        ]}
    ></FormComponent>
  );
}

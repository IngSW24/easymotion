import FormComponent from "../components/ui/FormComponent/FormComponent";
import { useNavigate } from "react-router";
//import { useAuth } from "../hooks/useAuth";
//import { useSnack } from "../hooks/useSnack";

interface TypeofPage {
  isLogin?: boolean;
  isSignup?: boolean;
  isPersonal?: boolean;
}

export default function LoginSignUpPage(prop: TypeofPage) {
  const { isLogin = false, isSignup = false, isPersonal = false } = prop;
  const navigate = useNavigate();

  //   const { apiClient, isAuthenticated, isPhysiotherapist, isFinalUser } = useAuth();
  //   const snack = useSnack()
  //   const navigation = useNavigate()
  //   const onSave = () => {
  //     const api = getn instance api client
  //     try {
  //       api.login(...,...,..)
  //       navigation("/")
  //     } catch (e) {
  //       snack.showError(e)
  //     }
  //   }

  //   const { user, isAuthenticated = true, login } = useAuth();
  //   const snack = useSnack()

  //   const handleSignupClick = () => {
  //     navigate("/personal_information");
  //     try {
  //             login("","")
  //         } catch (e) {
  //             snack.showError(e)
  //         }
  //   };
  const handleSignupClick = () => {
    navigate("/personal_information");
  };

  return (
    <>
      {isLogin && (
        <FormComponent
          title="Bentornato in EasyMotion"
          description="Inserisci i tuoi dati per accedere al sito"
          textFieldNumber={2}
          checkbox={true}
          buttonName="Accedi"
          fieldName={["email", "password"]}
          checkboxName={"Resta Connesso"}
        />
      )}
      {isSignup && (
        <FormComponent
          title="Benvenuto in EasyMotion"
          description="Ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito"
          textFieldNumber={3}
          checkbox={true}
          buttonName="Registrati"
          fieldName={["email", "password", "ripeti la password"]}
          checkboxName="Accetto i termini e le condizioni"
          onSubmit={handleSignupClick}
        />
      )}
      {isPersonal && (
        <FormComponent
          title="Benvenuto in EasyMotion"
          description="Bene, ora che hai completato la parte più sensibile, parlaci un po' di te ..."
          textFieldNumber={8}
          buttonName="Completa la registrazione"
          fieldName={[
            "nome",
            "secondo nome",
            "cognome",
            "telefono",
            "data di nascita",
          ]}
        ></FormComponent>
      )}
    </>
  );
}

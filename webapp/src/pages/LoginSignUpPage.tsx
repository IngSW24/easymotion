// import { useNavigate } from "react-router";
import FormComponent from "../components/ui/FormComponent/FormComponent";
// import { useAuth } from "../hooks/useAuth";
// import { useSnack } from "../hooks/useSnack";

interface TypeofPage {
    isLogin?: boolean;
    isSignup?: boolean;
}

export default function LoginSignUpPage(prop: TypeofPage) {
    const {isLogin = false, isSignup = false} = prop;

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

//   //const { apiClient, isAuthenticated, isPhysiotherapist, isFinalUser } = useAuth();
//   const { user, isAuthenticated = true, login } = useAuth();
//   const snack = useSnack()
//   const navigation = useNavigate()

//   const onSave = () => {
//     try {
//         login("","")
//         navigation("/PersonalSignUpPage")
//     } catch (e) {
//         snack.showError(e)
//     }
//   }

  return (
    <>
      {isLogin && (
        <FormComponent
        title="Bentornato in EasyMotion"
        description="Inserisci i tuoi dati per accedere al sito"
        textFieldNumber={2}
        checkbox={true}
        buttonName="Login"
        flexDirectionParam="column"
        fieldName={["email", "password"]}
        checkboxName={"Resta Connesso"}
        />
      )}
      {isSignup && (
        <FormComponent
          title="Benvenuto in Easymotion"
          description="Ora ti chiediamo di inserire i dati che utilizzerai per accedere al nostro sito"
          textFieldNumber={3}
          checkbox={true}
          buttonName="Registrati"
          flexDirectionParam="column"
          fieldName={["email", "password", "ripeti la password"]}
          checkboxName="Accetto i termini e le condizioni"
        />
      )}
    </>
  );
}
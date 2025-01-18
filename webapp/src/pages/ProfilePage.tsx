import { Button, Container } from "@mui/material";
import ProfileImage from "../components/ProfileImage/ProfileImageDefault.jpg";
import TextBoxes from "../components/atoms/DescriptionBoxes/TextBoxes";
import ModeEdit from "@mui/icons-material/ModeEdit";

export interface ProfileProps {
  name: string;
  secondName: string;
  surname: string;
  userType: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  specialization: string;
  publicPhoneNumber: string;
}

export default function ProfilePage(props: ProfileProps) {
  const {
    name,
    secondName,
    surname,
    userType,
    phoneNumber,
    email,
    birthDate,
    specialization,
    publicPhoneNumber,
  } = props;

  /*
  const name: string = "Homer";
  const secondName: string = "J.";
  const surname: string = "Simpson";
  const userType: string = "Fisioterapista";
  const phoneNumber: string = "";
  const email: string = "ti.ho@fregato.it";
  const birthDate: = "21/12/2012";
  const specialization: string = "Non esiste, non ha mai fatto l'università";
  const publicPhoneNumber: string = "912";
    */

  return (
    <>
      <Container sx={{ fontFamily: "sans-serif" }}>
        <div style={{ background: "#e3e3e3", borderRadius: 25 }}>
          <h1 style={{ padding: 20, textAlign: "center" }}>Il tuo profilo</h1>
        </div>

        <div
          style={{ background: "#e3e3e3", height: "auto", borderRadius: 25 }}
        >
          <div style={{ float: "left", padding: 30, width: "25%" }}>
            <img
              src={ProfileImage}
              style={{ borderRadius: "50%", width: "90%" }}
            />
          </div>

          <div style={{ padding: 50, width: "70%", marginLeft: "25%" }}>
            <TextBoxes descriptionTitle="Nome" description={name} />

            {secondName != "" && secondName != undefined ? (
              <TextBoxes
                descriptionTitle="Secondo Nome"
                description={secondName}
              />
            ) : (
              <></>
            )}

            <TextBoxes descriptionTitle="Cognome" description={surname} />

            <TextBoxes
              descriptionTitle="Tipo di Cliente"
              description={userType}
            />

            {phoneNumber != "" && phoneNumber != undefined ? (
              <TextBoxes
                descriptionTitle="Numero di telefono"
                description={phoneNumber}
              />
            ) : (
              <></>
            )}

            <TextBoxes descriptionTitle="Email" description={email} />

            <TextBoxes
              descriptionTitle="Data di nascita"
              description={birthDate}
            />

            {userType == "Fisioterapista" ? (
              <div>
                <TextBoxes
                  descriptionTitle="Specializzazione"
                  description={specialization}
                />

                {publicPhoneNumber != "" && publicPhoneNumber != undefined ? (
                  <TextBoxes
                    descriptionTitle="Numero del telefono pubblico"
                    description={publicPhoneNumber}
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div style={{ float: "left", margin: 20 }}>
          <Button
            variant="outlined"
            style={{ background: "#48D1CC", color: "white", padding: 10 }}
          >
            <ModeEdit />
            Modifica profilo
          </Button>
        </div>

        <div style={{ float: "right", margin: 20 }}>
          <Button
            variant="outlined"
            style={{ borderColor: "#8B0000", color: "#8B0000", padding: 10 }}
          >
            Esci dal profilo
          </Button>
          <Button
            variant="outlined"
            style={{ background: "#8B0000", color: "white", padding: 10 }}
          >
            Elimina profilo
          </Button>
        </div>
      </Container>
    </>
  );
}

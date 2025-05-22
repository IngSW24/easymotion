import { Container, Grid } from "@mui/material";
import { useProfile } from "../hooks/useProfile";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import GeneralProfileSettings from "../components/auth/ProfileSettings/GeneralProfileSettings";
import EmailUpdate from "../components/auth/ProfileSettings/EmailUpdate";
import PasswordUpdate from "../components/auth/ProfileSettings/PasswordUpdate";
import PhysiotherapistSettings from "../components/auth/ProfileSettings/PhysiotherapistSettings";
import PatientSettings from "../components/auth/ProfileSettings/Patient/PatientSettings";
import Fade from "../components/animations/Fade";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <Fade>
      <Container
        maxWidth="lg"
        sx={{
          padding: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {profile.get.isLoading && <LoadingSpinner />}
        {profile.get.isError && <div>Errore</div>}
        {profile.get.isSuccess && (
          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12 }}>
              <GeneralProfileSettings
                user={profile.get.data}
                onProfileSave={(updatedProfile) =>
                  profile.update.mutate(updatedProfile)
                }
              />
            </Grid>

            {profile.get.data.role === "PHYSIOTHERAPIST" && (
              <Grid size={{ xs: 12 }}>
                <PhysiotherapistSettings
                  physiotherapist={profile.get.data.physiotherapist ?? null}
                  onProfileSave={(updatedProfile) =>
                    profile.updatePhysiotherapist.mutate(
                      updatedProfile.physiotherapist
                    )
                  }
                />
              </Grid>
            )}

            {profile.get.data.role === "USER" && (
              <Grid size={{ xs: 12 }}>
                <PatientSettings
                  patient={profile.get.data.patient ?? null}
                  onSave={(updatedPatient) =>
                    profile.updatePatient.mutate(updatedPatient.patient)
                  }
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <EmailUpdate />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <PasswordUpdate />
            </Grid>
          </Grid>
        )}
      </Container>
    </Fade>
  );
}

import { Container } from "@mui/material";
import { useProfile } from "../hooks/useProfile";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import GeneralProfileSettings from "../components/profile/ProfileSettings/GeneralProfileSettings";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <Container
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
        <GeneralProfileSettings
          user={profile.get.data}
          onProfileSave={(updatedProfile) =>
            profile.update.mutate(updatedProfile)
          }
        />
      )}
    </Container>
  );
}

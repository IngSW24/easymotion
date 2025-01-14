import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";

export default function TestAuthPage() {
  const auth = useAuth();
  const { apiClient } = useApiClient();

  const [profileResponse, setProfileResponse] = useState<unknown | null>(null);
  const [authInfo, setAuthInfo] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  useEffect(() => {
    apiClient.auth.authControllerGetUserProfile().then((response) => {
      if (response.ok) {
        setProfileResponse(response.data);
      }
    });
  }, [apiClient.auth, auth.isAuthenticated]);

  const login = async () => {
    await auth.login(authInfo.email, authInfo.password);
  };

  return (
    <Box sx={{ p: 3, maxWidth: "300px" }}>
      <Typography variant="h3">Test</Typography>
      <Stack spacing={3} sx={{ mt: 3 }}>
        <TextField
          label="Email"
          value={authInfo.email}
          onChange={(e) =>
            setAuthInfo((d) => ({ ...d, email: e.target.value }))
          }
        />
        <TextField
          label="Password"
          type="password"
          value={authInfo.password}
          onChange={(e) =>
            setAuthInfo((d) => ({ ...d, password: e.target.value }))
          }
        />
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => login()}
            disabled={
              auth.isAuthenticated || !authInfo.email || !authInfo.password
            }
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!auth.isAuthenticated}
            onClick={async () => await auth.logout()}
          >
            Logout
          </Button>
        </Stack>
        {auth.isAuthenticated && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4">Profile</Typography>
            <pre>{JSON.stringify(profileResponse, null, 2)}</pre>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

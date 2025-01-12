import { Typography } from "@mui/material";

interface LoginPageProps {
  logout?: boolean;
}

export default function LoginPage({ logout = false }: LoginPageProps) {
  return (
    <Typography>
      Login page for all user types (customer and physiotherapist): logout flag:{" "}
      {logout ? "YES" : "NO"}
    </Typography>
  );
}

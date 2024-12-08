import { useState } from "react";
import { Box, Button, Link, Typography } from "@mui/material";

/**
 * Demonstrative homepage for the application
 * @returns a react component
 */
const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2" display="inline">
        Hello{" "}
        <Typography
          variant="h2"
          component="span"
          color="primary"
          display="inline"
        >
          EasyMotion
        </Typography>
        !
      </Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>
        With{" "}
        <Link
          color="secondary"
          href="https://mui.com/material-ui/getting-started/"
        >
          Material UI
        </Link>
      </Typography>

      <Button
        variant="contained"
        onClick={() => setCount((count) => count + 1)}
        sx={{ mt: 5 }}
      >
        Count is {count}
      </Button>
    </Box>
  );
};

export default Home;

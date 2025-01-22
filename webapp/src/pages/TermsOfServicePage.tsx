import { marked } from "marked";
import termsAndConditions from "../legal/terms-of-service.md";
import { Container, Typography } from "@mui/material";

const parsedPageContent = marked.parse(termsAndConditions);

const typographyStyles = {
  "& h1": {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  "& h2, & h3": {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "0.8rem",
    color: "#34495e",
  },
  "& p, & li": {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  "& ul": {
    paddingLeft: "1.5rem",
    listStyleType: "disc",
  },
  "& a": {
    color: "#3498db",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  "& blockquote": {
    fontStyle: "italic",
    paddingLeft: "1rem",
    borderLeft: "4px solid #3498db",
    color: "#7f8c8d",
  },
  "& code": {
    backgroundColor: "#f4f4f4",
    padding: "0.2rem 0.4rem",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
};

export default function TermsOfServicePage() {
  return (
    <Container sx={{ p: 5 }}>
      <Typography
        component="div"
        sx={typographyStyles}
        dangerouslySetInnerHTML={{ __html: parsedPageContent }}
      />
    </Container>
  );
}

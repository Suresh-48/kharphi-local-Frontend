import WizardForm from "./WizardForm";
import { CssBaseline, Container, Paper, Box } from "@material-ui/core";

function TeacherApplication() {
  return (
    <>
      <CssBaseline />
      <Container component={Box} p={4}>
        <WizardForm />
      </Container>
    </>
  );
}

export default TeacherApplication;

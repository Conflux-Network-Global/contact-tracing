import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const HealthPage = () => {
  const [healthy, setHealthy] = React.useState("--");
  const [status, setStatus] = React.useState("--");

  const colorPicker = (value) => {
    return value === "No" || value === "Infected Contact" ? "error" : "inherit";
  };

  const toggleHealth = () => {
    setHealthy("No");
  };

  const checkContacts = () => {
    setStatus("Infected Contact");
  };

  return (
    <React.Fragment>
      <Box pb={3}>
        <Typography variant="caption">
          Please report any updates to your health:
        </Typography>
        <Typography variant="h6" color={colorPicker(healthy)}>
          Healthy: {healthy}
        </Typography>
        <Button
          variant="contained"
          size="large"
          className="Button"
          onClick={toggleHealth}
          color="primary"
        >
          Toggle Health
        </Button>
      </Box>
      <Box>
        <Typography variant="caption">
          Check if contact has been infected:{" "}
        </Typography>
        <Typography variant="h6" color={colorPicker(status)}>
          Status: {status}
        </Typography>
        <Button
          variant="contained"
          size="large"
          className="Button"
          onClick={checkContacts}
          color="primary"
        >
          Check Contacts
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default HealthPage;

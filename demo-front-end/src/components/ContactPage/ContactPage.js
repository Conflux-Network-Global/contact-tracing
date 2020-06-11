import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import "./ContactPage.css";

const ContactPage = () => {
  const [registered, setRegistered] = React.useState(false);
  const [personal, setPersonal] = React.useState("");
  const [contact, setContact] = React.useState("");

  const registerClick = () => {
    setRegistered(true);
  }

  const personalClick = () => {

  }

  const contactClick = () => {

  }

  return (
    <React.Fragment>
      <Typography variant="caption">
        New users: Please register below.{" "}
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="large"
        className="Button"
        disabled={registered}
        onClick={registerClick}
      >
        Register User
      </Button>
      <Box my={1}>
        <Typography variant="caption">
          Use the following to register personal payloads:{" "}
        </Typography>
        <Box className="ContactPage-Box">
          <TextField
            label="Personal Payload"
            variant="outlined"
            onChange={(event) => setPersonal(event.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            className="Button"
            disabled={!registered}
            onClick={personalClick}
          >
            Register Payload
          </Button>
        </Box>
      </Box>
      <Typography variant="caption">
        Use the following to track contact payloads:{" "}
      </Typography>
      <Box className="ContactPage-Box">
        <TextField
          label="Contact Payload"
          variant="outlined"
          onChange={(event) => setContact(event.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          size="large"
          className="Button"
          disabled={!registered}
          onClick={contactClick}
        >
          Report Contact
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default ContactPage;

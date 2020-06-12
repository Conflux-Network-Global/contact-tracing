import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import "./ContactPage.css";
import { util } from "js-conflux-sdk";
const abi = require("../../assets/individual-abi.json");

const ContactPage = ({ reg, ind }) => {
  const [registered, setRegistered] = React.useState(!!ind.contractObj);
  const [initial, setInitial] = React.useState(true);
  const [personal, setPersonal] = React.useState("");
  const [contact, setContact] = React.useState("");

  React.useEffect(() => {
    if (!ind.contractObj) {
      reg.getIndividual()
        .call({ from: window.conflux.selectedAddress })
        .then((res) => {
          console.log(res);
          // console.log(util.format.hex(Buffer.from("abcdefghijklmnopqrsasdfasgawevasdfaevasefasvawegags tv")));
          if (res !== "0x0000000000000000000000000000000000000000") {
            const contract = window.confluxJS.Contract({
              abi: abi,
              address: res,
            });
            ind.setContract(contract);
            setRegistered(true);
          }
          setInitial(false);
        });
    }
  }, [reg, ind]);

  const registerClick = async () => {
    const data = reg.newRegistration().data;
    console.log(data);

    const tx = {
      to: reg.address,
      from: window.conflux.selectedAddress,
      data,
      gas: util.format.hex(2000000),
      gasPrice: util.unit.fromGDripToDrip(0.0000001),
      storageLimit: util.format.hex(3000)
    };
    const res = await window.conflux.send("cfx_sendTransaction", [tx]);
    // const res = await window.conflux.send("cfx_getTransactionByHash", ["0x45dde1ec907e3d2e896ba98c07b5b01c463e8a493ba986db878ccc2f54e20d8a"]);
    console.log(res);
    // setRegistered(true);
  };

  const personalClick = () => {
    //need to store tokens locally
    //interact with registration contract
  };

  const contactClick = () => {
    //need to store tokens locally
    //interact with personal contract
  };

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
        disabled={registered || initial}
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

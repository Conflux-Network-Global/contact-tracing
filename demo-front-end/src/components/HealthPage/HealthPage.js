import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { util } from "js-conflux-sdk";

const HealthPage = ({ reg, ind }) => {
  const [healthy, setHealthy] = React.useState("--");
  const [status, setStatus] = React.useState("--");
  const [trigger, setTrigger] = React.useState(false);

  React.useEffect(() => {
    ind
      .getStatus()
      .call({ from: window.conflux.selectedAddress })
      .then((res) => {
        const health = res ? "Yes" : "No";
        setHealthy(health);
      });
  }, [ind, trigger]);

  const colorPicker = (value) => {
    return value === "No" || value === "Infected Contact" ? "error" : "inherit";
  };

  const toggleHealth = async () => {
    const data = ind.toggleHealth().data;
    console.log(data);
    const estimate = await ind.toggleHealth().estimateGasAndCollateral();
    console.log(estimate);

    const tx = {
      to: ind.address,
      from: window.conflux.selectedAddress,
      data,
      gas: util.format.hex(2000000),
      gasPrice: util.unit.fromGDripToDrip(0.0000001),
      // storageLimit: util.format.hex(3000)
    };
    const res = await window.conflux.send("cfx_sendTransaction", [tx]);
    // const res = await window.conflux.send("cfx_getTransactionByHash", ["0x45dde1ec907e3d2e896ba98c07b5b01c463e8a493ba986db878ccc2f54e20d8a"]);
    console.log(res);
    setTimeout(() => setTrigger(!trigger), 10000);
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

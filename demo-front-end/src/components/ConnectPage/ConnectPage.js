import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const ConnectPage = ({set}) => {
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    // console.log(window.conflux);
    setInstalled(!!window.conflux);
  }, []);

  const install = () => {
    window.open("https://portal.conflux-chain.org/");
  };

  const connect = async () => {
    await window.conflux.enable();
    set(window['conflux']);
  }

  return (
    <React.Fragment>
      <Typography variant="h6">
        To get started please {installed ? "connect to " : "install "}
        ConfluxPortal
      </Typography>
      {installed ? (
        <Button
          color="primary"
          variant="contained"
          size="large"
          className="Button"
          onClick={connect}
        >
          Connect
        </Button>
      ) : (
        <Button
          color="primary"
          variant="contained"
          size="large"
          className="Button"
          onClick={install}
        >
          Install ConfluxPortal
        </Button>
      )}
    </React.Fragment>
  );
};

export default ConnectPage;

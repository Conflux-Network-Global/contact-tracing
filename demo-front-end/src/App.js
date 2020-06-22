import React from "react";
import "./App.css";
import CardContainer from "./components/CardContainer/CardContainer";
import ConnectPage from "./components/ConnectPage/ConnectPage";
import ContactPage from "./components/ContactPage/ContactPage";
import HealthPage from "./components/HealthPage/HealthPage";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
const abi = require("./assets/registration-abi.json");
const addresses = require("./assets/addresses.json");
const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  const [state, set] = React.useState(0);
  const page = { state, set };
  const [provider, setProvider] = React.useState();
  const [regContract, setRegContract] = React.useState();
  const [contractObj, setContract] = React.useState();
  const indContract = { contractObj, setContract };

  //checking if conflux portal is installed
  React.useEffect(() => {
    if (!!provider) {
      set(1);
      const contract = window.confluxJS.Contract({
        abi,
        address: addresses.registration,
      });
      setRegContract(contract);
    }
  }, [provider]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CardContainer page={page} ind={contractObj}>
          {page.state === 0 && (
            <ConnectPage set={setProvider}/>
          )}
          {page.state === 1 && <ContactPage reg={regContract} ind={indContract}/>}
          {page.state === 2 && <HealthPage reg={regContract} ind={contractObj}/>}
        </CardContainer>
      </div>
    </ThemeProvider>
  );
}

export default App;

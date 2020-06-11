import React from "react";
import "./App.css";
import CardContainer from "./components/CardContainer/CardContainer";
import ConnectPage from "./components/ConnectPage/ConnectPage";
import ContactPage from "./components/ContactPage/ContactPage";
import HealthPage from "./components/HealthPage/HealthPage";
const abi = require("./assets/registration-abi.json");
const addresses = require("./assets/addresses.json");

function App() {
  const [state, set] = React.useState(0);
  const page = { state, set };
  const [provider, setProvider] = React.useState();

  React.useEffect(() => {
    if (!!provider) {
      set(1);
      const contract = window.confluxJS.Contract({
        abi,
        address: addresses.registration,
      });
      contract.getIndividual.call().then((res) => console.log(res));
    }
  }, [provider]);

  return (
    <div className="App">
      <CardContainer page={page}>
        {page.state === 0 && <ConnectPage set={setProvider} />}
        {page.state === 1 && <ContactPage />}
        {page.state === 2 && <HealthPage />}
      </CardContainer>
    </div>
  );
}

export default App;

import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./ContactPage.css";
import { util } from "js-conflux-sdk";
import Web3 from "web3";
const abi = require("../../assets/individual-abi.json");
const abiReg = require("../../assets/registration-abi.json");
const web3 = new Web3();

const txParams = {
  gas: util.format.hex(2000000),
  gasPrice: util.unit.fromGDripToDrip(0.0000001),
};

const ContactPage = ({ reg, ind }) => {
  const [registered, setRegistered] = React.useState(!!ind.contractObj);
  const [initial, setInitial] = React.useState(true);
  const [personal, setPersonal] = React.useState({
    text: "",
    hash: "",
    tx: false,
  });
  const [contact, setContact] = React.useState({
    text: "",
    hash: "",
    tx: false,
  });

  //initialize getting individual contract or button for registration
  React.useEffect(() => {
    if (!ind.contractObj) {
      reg
        .getIndividual()
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

  //save payload addresses to local storage
  React.useEffect(() => {
    let data = window.localStorage.getItem("contactTracing");
    data = JSON.parse(data);
    console.log(data);

    //if no personal hash is present, and there is a stored one in localstorage, use that
    if (!personal.hash && !!data) {
      setPersonal(prev => {return {...prev, hash: data[data.length-1].personal}})
    }

    //if both are set, store the pair and timestamp
    if (!!personal.hash && !!contact.hash) {
      const payload = {personal: personal.hash, contact: contact.hash, timestamp: new Date()};
      if (!data) {
        data = [payload];
      } else {
        data.push(payload)
      }
      window.localStorage.setItem("contactTracing", JSON.stringify(data))
    }
  }, [personal.hash, contact.hash])

  //registration button click + transaction parameters
  const registerClick = async () => {
    const data = reg.newRegistration().data;
    console.log(data);

    const tx = {
      ...txParams,
      from: window.conflux.selectedAddress,
      to: reg.address,
      data,
      storageLimit: util.format.hex(3000),
    };
    const res = await window.conflux.send("cfx_sendTransaction", [tx]);
    // const res = await window.conflux.send("cfx_getTransactionByHash", ["0x45dde1ec907e3d2e896ba98c07b5b01c463e8a493ba986db878ccc2f54e20d8a"]);
    console.log(res);
    setRegistered(true);
  };

  //generalized handler for payload registration (personal + contact)
  const buttonClick = async (
    obj,
    setObj,
    functionCall,
    contractABI,
    contractInst
  ) => {
    //empty check
    if (obj.text === "") {
      return
    }

    setObj((prev) => {
      return { ...prev, tx: true };
    });

    const inputHex = util.format.hex(Buffer.from(obj.text));
    const data = web3.eth.abi.encodeFunctionCall(
      contractABI.filter((func) => func.name === functionCall)[0],
      [inputHex]
    );

    const tx = {
      ...txParams,
      from: window.conflux.selectedAddress,
      to: contractInst.address,
      data,
      storageLimit: util.format.hex(100),
    };

    try {
      const res = await window.conflux.send("cfx_sendTransaction", [tx]);
      console.log(res);

      setTimeout(async () => {
        const receipt = await window.conflux.send("cfx_getTransactionReceipt", [
          res,
        ]);
        console.log(receipt);
        const hash = contractInst.abi.decodeLog(receipt.logs[0]).array[0];
        console.log(hash);
        if (!!receipt) {
          setObj({ text: "", hash, tx: false });
        }
      }, 10000);
    } catch (e) {
      setObj((prev) => {
        return { ...prev, tx: false };
      });
    }
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
            onChange={(event) => {
              const input = event.target.value;
              setPersonal((prev) => {
                return { ...prev, text: input };
              });
            }}
            value={personal.text}
            disabled={personal.tx}
          />
          {personal.tx ? (
            <Box className="Button" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Button
              color="primary"
              variant="contained"
              size="large"
              className="Button"
              disabled={!registered}
              onClick={() =>
                buttonClick(
                  personal,
                  setPersonal,
                  "registerPayload",
                  abiReg,
                  reg
                )
              }
            >
              Register Payload
            </Button>
          )}
        </Box>
      </Box>
      <Typography variant="caption">
        Use the following to track contact payloads:{" "}
      </Typography>
      <Box className="ContactPage-Box">
        <TextField
          label="Contact Payload"
          variant="outlined"
          onChange={(event) => {
            const input = event.target.value;
            setContact((prev) => {
              return { ...prev, text: input };
            });
          }}
          value={contact.text}
          disabled={contact.tx}
        />
        {contact.tx ? (
          <Box className="Button" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Button
            color="primary"
            variant="contained"
            size="large"
            className="Button"
            disabled={!registered || !personal.hash}
            onClick={() =>
              buttonClick(
                contact,
                setContact,
                "contact",
                abi,
                ind.contractObj
              )
            }
          >
            Report Contact
          </Button>
        )}
      </Box>
    </React.Fragment>
  );
};

export default ContactPage;

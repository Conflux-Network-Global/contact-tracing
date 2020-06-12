/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
    defaultGasPrice: 100,
    defaultGas: 2000000,
    logger: console,
  });

  console.log(cfx.defaultGasPrice); // 100
  console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account(PRIVATE_KEY); // create account instance
  console.log(account.address);

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('../demo-front-end/src/assets/registration-abi.json'), //can be copied from remix
    address: "0x8fec5d693f1ac411a56204d0ac8ba987788a6efe"
  });

  // const receipt = await contract.newRegistration().sendTransaction({from: account}).confirmed();
  // console.log(receipt);

  const indAddress = await contract.getIndividual().call({from: account});
  console.log(indAddress);

  const indContract = cfx.Contract({
    abi: require('../demo-front-end/src/assets/individual-abi.json'), //can be copied from remix
    address: indAddress
  })

  const receipt = await indContract.toggleHealth().sendTransaction({from: account})
  console.log(receipt);

  //testnet address: 0x87618fe9114449057de3f185d018ddf433bb808c (having issues with ConfluxPortal on testnet)
  //mainnet address: 0x8fec5d693f1ac411a56204d0ac8ba987788a6efe
}

main().catch(e => console.error(e));

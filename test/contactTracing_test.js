const truffleAssert = require("truffle-assertions");
const BN = require("bn.js");

const Registration = artifacts.require("Registration");
const Individual = artifacts.require("Individual");

contract("Contact tracing flow", async (accounts) => {
  let reg;
  let ind0;
  let ind1;

  const ind0Payload = ["0x0", "0x1"];
  const ind1Payload = ["0x2", "0x3"];
  let ind0Hash = [];
  let ind1Hash = [];
  const user0 = { from: accounts[0] };
  const user1 = { from: accounts[1] };

  before(async () => {
    reg = await Registration.deployed();
    reg.send(web3.utils.toWei("10", "ether"), { from: accounts[6] });
    ind0 = await getIndividualContract(user0);
    ind1 = await getIndividualContract(user1);
  });

  const getIndividualContract = async (user) => {
    await reg.newRegistration.sendTransaction(user);
    const indAddress = await reg.getIndividual.call(user);
    return Individual.at(indAddress);
  };

  it("Registration + 2 Individual Contracts successfully deployed", async () => {
    expect(reg.address).to.not.equal(undefined);
    expect(ind0.address).to.not.equal(undefined);
    expect(ind1.address).to.not.equal(undefined);

    expect(reg.address).to.not.equal(ind0.address);
    expect(ind0.address).to.not.equal(ind1.address);
    expect(ind1.address).to.not.equal(reg.address);
  });

  // it("registerPayload provides reward on first payload registration", async () => {
  //   const balance_prev = await web3.eth.getBalance(user0.from);
  //   const output = await reg.registerPayload(ind0Payload[0], user0);
  //   const balance_after = await web3.eth.getBalance(user0.from);
  //   ind0Hash.push(output.logs[0].args.payload);
  //
  //   console.log(
  //     new BN(balance_after).add(
  //       web3.utils.toWei(new BN(output.receipt.gasUsed)),
  //       "gwei"
  //     ),
  //     new BN(balance_prev)
  //   );
  //   const check = new BN(balance_after).add(
  //     web3.utils.toWei(new BN(output.receipt.gasUsed), "gwei")
  //   );
  //   expect(check.gt(new BN(balance_prev))).to.be.true;
  // });
  //
  // it("registerPayload does not provide reward on second payload registration", async () => {
  //   const balance_prev = await web3.eth.getBalance(user0.from);
  //   const output = await reg.registerPayload(ind0Payload[1], user0);
  //   const balance_after = await web3.eth.getBalance(user0.from);
  //   ind0Hash.push(output.logs[0].args.payload);
  //
  //   const check = new BN(balance_after).add(
  //     web3.utils.toWei(new BN(output.receipt.gasUsed), "gwei")
  //   );
  //   expect(check.eq(new BN(balance_prev))).to.be.true;
  //
  //   //register other payloads
  //   const output0 = await reg.registerPayload(ind1Payload[0], user1);
  //   const output1 = await reg.registerPayload(ind1Payload[1], user1);
  //   ind1Hash = [output0, output1];
  // });
});

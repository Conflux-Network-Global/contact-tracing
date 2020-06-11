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
  const gasPrice = new BN(web3.utils.toWei("20", "gwei"));

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

  it("registerPayload provides reward on first payload registration", async () => {
    const balance_prev = await web3.eth.getBalance(user0.from);
    const output = await reg.registerPayload(ind0Payload[0], user0);
    const balance_after = await web3.eth.getBalance(user0.from);
    ind0Hash.push(output.logs[0].args.payload);

    const check = new BN(balance_after).add(
      gasPrice.mul(new BN(output.receipt.gasUsed))
    );
    expect(check.gt(new BN(balance_prev))).to.be.true;
  });

  it("registerPayload does not provide reward on second payload registration", async () => {
    const balance_prev = await web3.eth.getBalance(user0.from);
    const output = await reg.registerPayload(ind0Payload[1], user0);
    const balance_after = await web3.eth.getBalance(user0.from);
    ind0Hash.push(output.logs[0].args.payload);

    const check = new BN(balance_after).add(
      gasPrice.mul(new BN(output.receipt.gasUsed))
    );
    expect(check.eq(new BN(balance_prev))).to.be.true;

    //register other payloads
    const output0 = await reg.registerPayload(ind1Payload[0], user1);
    const output1 = await reg.registerPayload(ind1Payload[1], user1);
    ind1Hash = [output0.logs[0].args.payload, output1.logs[0].args.payload];
  });

  it("registerPayload reverts if payload is already registered", async () => {
    await truffleAssert.reverts(reg.registerPayload(ind1Payload[0], user1));
    await truffleAssert.reverts(reg.registerPayload(ind1Payload[0], user0));
  });

  it("registerPayload reverts if user is not registerd", async () => {
    await truffleAssert.reverts(
      reg.registerPayload("0x5", { from: accounts[5] })
    );
  });

  it("contact function returns correct contact address", async () => {
    const output0 = await ind0.contact(ind1Payload[0], user0);
    const output1 = await ind1.contact(ind0Payload[0], user1);

    assert(
      output0.logs[0].args.contact == ind1Hash[0],
      "returned address does not match registered address"
    );
    assert(
      output1.logs[0].args.contact == ind0Hash[0],
      "returned address does not match registered address"
    );
  });

  it("checkStatus reverts when not called by registration contract", async () => {
    await truffleAssert.reverts(ind0.checkStatus(ind0Hash[0]));
  });

  it("toggleHealth works without reverting when called correctly", async () => {
      await truffleAssert.passes(ind1.toggleHealth(user1));
  })

  it("toggleHealth reverts when not called by owner", async () => {
    await truffleAssert.reverts(ind0.toggleHealth(user1));
  })

  it("checkHealth returns health status for individual when matching payloads are submitted", async () => {

    const health1 = await reg.checkHealth.call(ind0Hash[0], ind1Hash[0], user0);
    const health0 = await reg.checkHealth.call(ind1Hash[0], ind0Hash[0], user1);

    expect(health1).to.not.be.true;
    expect(health0).to.be.true;
  });

  it("checkHealth reverts with incorrect inputs", async () => {
    await truffleAssert.reverts(
      reg.checkHealth.call(ind0Hash[0], reg.address, user0)
    ); //invalid contact address
    await truffleAssert.reverts(
      reg.checkHealth.call(ind1Hash[0], ind1Hash[0], user0)
    ); //invalid personal payload address
    await truffleAssert.reverts(
      reg.checkHealth.call(ind0Hash[1], ind1Hash[0], user0)
    ); //contact did not recieve users token (does not return health)
  });
});

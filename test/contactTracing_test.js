const Registration = artifacts.require("Registration");

contract("Registration Test", async accounts => {
  it("Registration contract successfully deploys", async () => {
    let instance = await Registration.deployed();
    let individual0 = await instance.newRegistration.sendTransaction();
    console.log(individual0.address);
  });
});

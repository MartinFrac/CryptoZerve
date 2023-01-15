const SystemVenue = artifacts.require("SystemVenue");
const Venue = artifacts.require("Venue");
const { toBN } = web3.utils;

describe("SystemVenue", () => {
  let sv, accounts;

  beforeEach("Contract setup for testing", async () => {
    sv = await SystemVenue.new();
    accounts = await web3.eth.getAccounts();
  });

  it("SystemVenue should be created", async () => {
    assert.isDefined(sv, "Should be defined");
    assert.isDefined(accounts, "accounts should be defined");
  })

  it("Should create a venue with correct parameters", async () => {
    const name = "venue name";
    const location = "venue location";
    const callNewVenue = await sv.createVenue.call(name, location);
    const txNewVenue = await sv.createVenue(name, location, {from: accounts[0]});
    const addressVenue = await sv.getVenue.call(0);
    const instanceVenue = await Venue.at(addressVenue);
    const _name = await instanceVenue.name.call();
    const _location = await instanceVenue.location.call();
    const owner = await instanceVenue.owner.call();
    assert.equal(name, _name);
    assert.equal(location, _location);
    assert.equal(accounts[0], owner);
  })
})
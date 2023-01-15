const SystemVenueGenerator = artifacts.require("SystemVenueGenerator");
const VenueBookingGenerator = artifacts.require("VenueBookingGenerator");
const { toBN } = web3.utils;

describe("SystemVenueGenerator", () => {
  let svg, accounts;

  beforeEach("Contract setup for testing", async () => {
    svg = await SystemVenueGenerator.new();
    accounts = await web3.eth.getAccounts();
  });

  it("SystemVenue should be created", async () => {
    assert.isDefined(svg, "Should be defined");
    assert.isDefined(accounts, "accounts should be defined");
  })

  it("Should create a venue with correct parameters", async () => {
    const name = "venue name";
    const location = "venue location";
    const callNewVenue = await svg.createVenue.call(name, location);
    const txNewVenue = await svg.createVenue(name, location, {from: accounts[0]});
    const addressVenue = await svg.getVenue.call(0);
    const instanceVenue = await VenueBookingGenerator.at(addressVenue);
    const _name = await instanceVenue.name.call();
    const _location = await instanceVenue.location.call();
    const owner = await instanceVenue.owner.call();
    assert.equal(name, _name);
    assert.equal(location, _location);
    assert.equal(accounts[0], owner);
  })
})
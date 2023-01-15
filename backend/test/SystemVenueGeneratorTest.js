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
    await checkParams("name", "location", accounts[0], 0);
  })

  const checkParams = async (name, location, owner, counter) => {
    const callNewVenue = await svg.createVenue.call(name, location);
    const txNewVenue = await svg.createVenue(name, location, {from: owner});
    const addressVenue = await svg.getVenue.call(counter);
    const instanceVenue = await VenueBookingGenerator.at(addressVenue);
    const _name = await instanceVenue.name.call();
    const _location = await instanceVenue.location.call();
    const _owner = await instanceVenue.owner.call();
    assert.equal(name, _name);
    assert.equal(location, _location);
    assert.equal(owner, _owner);
  }

  it("Should create multiple venues", async () => {
    await checkParams("name1", "location1", accounts[0], 0);
    await checkParams("name2", "location2", accounts[1], 1);
    await checkParams("name3", "location3", accounts[2], 2);
  })
})
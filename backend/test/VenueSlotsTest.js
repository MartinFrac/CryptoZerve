const VenueSlots = artifacts.require("VenueSlots");
const { toBN } = web3.utils;

contract("VenueSlots", (accounts) => {
  let venue;
  const name = "name";
  const location = "location";
  const dayOfTheYear = 1;
  const year = 2023;
  const daysRule = 10; //1010
  const slotsRule = 100;
  const noSlots = 30;

  beforeEach("Contract setup for testing", async () => {
    venue = await VenueSlots.new(
      name,
      location,
      dayOfTheYear,
      year,
      daysRule,
      slotsRule,
      noSlots
    );
  });

  it("Should create a contract with parameters", async () => {
    const _name = await venue.name();
    const _location = await venue.location();
    const _dayOfTheYear = await venue.startDayOfTheContract();
    const _year = await venue.startDayYear();
    assert.equal(name, _name);
    assert.equal(location, _location);
    assert.equal(dayOfTheYear, _dayOfTheYear);
    assert.equal(year, _year);
    assert.isDefined(venue, "contract should be defined");
  });

  it("Should not let book when outside of contract expiration", async () => {
    let error;
    try {
      await venue.book(190, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("booking day is not within contract constraints", error.data.reason);
  });

  it("Should not let book when before contract start", async () => {
    let error;
    try {
      await venue.book(0, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("booking day is not within contract constraints", error.data.reason);
  });

  it("Should throw when day is not available", async () => {
    let error;
    try {
      await venue.book(16, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("Day needs to be available for the venue", error.data.reason);
  })

  it("Should throw when not enough room for all the units", async () => {
    let error;
    try {
      await venue.book(2, 1, 1, 40);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("not enough room for the units", error.data.reason);
  })

  it("Should let book when meets all the rules", async () => {
    await venue.book(2, 1, 1, 1);
  })
});


const VenueSlots = artifacts.require("VenueSlots");
const { toBN } = web3.utils;

contract("VenueSlots", (accounts) => {
  let venue;
  let instance = {
    name: "name",
    location: "location",
    dayOfTheYear: 1,
    year: 2023,
    daysRule: 10, //1010
    slotsRule: 100, //0111;
    noSlots: 30,
  }

  const setup = async ({name = instance.name, location = instance.location, dayOfTheYear = instance.dayOfTheYear, year = instance.year, daysRule = instance.daysRule, slotsRule = instance.slotsRule, noSlots = instance.noSlots}={}) => {
    venue = await VenueSlots.new(
      name,
      location,
      dayOfTheYear,
      year,
      daysRule,
      slotsRule,
      noSlots
    );
  }

  it("Should create a contract with parameters", async () => {
    await setup();
    const _name = await venue.name();
    const _location = await venue.location();
    const _dayOfTheYear = await venue.startDayOfTheContract();
    const _year = await venue.startDayYear();
    assert.equal(instance.name, _name);
    assert.equal(instance.location, _location);
    assert.equal(instance.dayOfTheYear, _dayOfTheYear);
    assert.equal(instance.year, _year);
    assert.isDefined(venue, "contract should be defined");
  });

  it("Should not let book when outside of contract expiration", async () => {
    const startDay = 20;
    const bookDay = startDay + 190;
    await setup({dayOfTheYear: startDay})
    let error;
    try {
      await venue.book(bookDay, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("booking day is not within contract constraints", error.data.reason);
  });

  it("Should not let book when before contract start", async () => {
    const startDay = 5;
    const bookDay = startDay - 1;
    await setup({dayOfTheYear: 5})
    let error;
    try {
      await venue.book(bookDay, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("booking day is not within contract constraints", error.data.reason);
  });

  it("Should throw when day is not available", async () => {
    await setup({dayOfTheYear: 1, daysRule: 10}); //daysRule: 1010
    let error;
    try {
      await venue.book(1, 1, 1, 1);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("Day needs to be available for the venue", error.data.reason);
  })

  it("Should throw when not enough room for all the units", async () => {
    await setup({slotsRule: 0b111111});
    let error;
    try {
      await venue.book(2, 1, 1, 40);
    } catch (err) {
      error = err;
    }
    assert(error, "should throw an error");
    assert.equal("not enough room for the units", error.data.reason);
  })

  it("Should throw an error when half hour slots are not available", async () => {

  })

  it("Should let book when meets all the rules", async () => {
    await venue.book(2, 1, 1, 1);
  })
});


const VenueBookingGenerator = artifacts.require("VenueBookingGenerator");
const Booking = artifacts.require("Booking");
const { toBN } = web3.utils;

contract("VenueBookingGenerator", function(accounts) {
  let vbn;
  const name = "name";
  const location = "location";
  const valueSent = toBN(10 * 10 ** 18);

  beforeEach("Contract setup for testing", async () => {
    vbn = await VenueBookingGenerator.new(name, location);
    console.log("Value sent: " + valueSent);
  })

  it("Should create a booking with parameters", async () => {
    const name = "test";
    const start = "start";
    const end = "end";
    const location = "location";
    const createCall = await vbn.createBooking.call(name, start, end, location, {value: valueSent});
    const tx = await vbn.createBooking(name, start, end, location, {value: valueSent});
    const bookingAddress = await vbn.getBooking.call(createCall);
    const bookingInstance = await Booking.at(bookingAddress);
    const bookingPrice = await bookingInstance.priceInWei();
    const _name = await bookingInstance.name();
    const _start = await bookingInstance.start();
    const _end = await bookingInstance.end();
    const _location = await bookingInstance.location();
    assert.equal(valueSent.toString(), bookingPrice.toString());
    assert.equal(name, _name);
    assert.equal(start, _start);
    assert.equal(end, _end);
    assert.equal(location, _location);
  })
})
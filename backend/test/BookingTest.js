const Booking = artifacts.require("Booking");
const { toBN } = web3.utils;

contract("Booking", function (accounts) {
  let booking;
  const valueSent = 10 * 10 ** 18;
  const name = "Booking1";
  const start = "2022-02-02";
  const end = "2022-02-05";
  const location = "LU13FA";

  beforeEach("Contract setup for testing", async () => {
    booking = await Booking.new(name, start, end, location, {value: valueSent});
  })

  it("Should create contract with 10 ether", async () => {
    const balance = await web3.eth.getBalance(booking.address);
    assert.equal(valueSent, balance);
  })

  it("Should have constructor parameters set", async () => {
    const _name = await booking.name();
    const _start = await booking.start();
    const _end = await booking.end();
    const _location = await booking.location();
    assert.equal(name, _name);
    assert.equal(start, _start);
    assert.equal(end, _end);
    assert.equal(location, _location);
  })

  it("When book with invalid value should revert", async () => {
    const bookRef = "123";
    const invalidValue = 100;
    const balanceBefore = toBN(await web3.eth.getBalance(accounts[1]));
    try {
      await booking.book(bookRef, {value: invalidValue, from: accounts[1]});
    } catch (err) {
      assert(err, "Should throw an error");
    }
    const balanceAfter = toBN(await web3.eth.getBalance(accounts[1]));
    assert.equal(balanceBefore.toString(), balanceAfter.toString());
  })
});
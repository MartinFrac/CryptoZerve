const Venue = artifacts.require("Venue");

contract("Venue", (accounts) => {
  const price = 20;
  const user = accounts[1];

  it("Should create an offer", async() => {
    const venue = await Venue.deployed();
    const offer = {
      numberOfPeople: 2,
      start: "",
      end: "",
      price: price,
      isConfirmed: false,
    }
    await venue.proposeOffer(user, offer);
    const offers = await venue.checkOffers({from: user});
    assert.equal(offers[0].price, price);
  });

  it("Accept offer should send money to the contract", async() => {
    const venue = await Venue.deployed();
    await venue.acceptOffer(0, {from: accounts[1], value: price});
  })
})
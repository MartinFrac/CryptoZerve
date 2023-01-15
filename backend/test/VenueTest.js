const Venue = artifacts.require("Venue");
const { toBN } = web3.utils;

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
    const tx = await venue.proposeOffer(user, offer);
    const offers = await venue.checkOffers({from: user});
    assert.equal(offers[0].price, price);
    assert.equal(tx.logs[0].event, "NewOffer");
    assert.equal(tx.logs[0].args[0], user);
  });

  it("accept offer should not take money if its wrong amount", async() => {
    const venue = await Venue.deployed();
    const wrongPrice = 1000;
    const balanceBefore = await web3.eth.getBalance(accounts[1]);
    
    try {
      await venue.acceptOffer(0, {from: accounts[1], value: wrongPrice});
    } catch(err) {
      assert(err, "should throw an error");
      assert(err.data.reason, "wrong amount");
    } 
    const balanceAfter = await web3.eth.getBalance(accounts[1]);
    assert.equal(balanceBefore, balanceAfter);
  })

  it("Check if only gas is used", async() => {
    const venue = await Venue.deployed();
    const balanceBefore = toBN(await web3.eth.getBalance(accounts[1]));
    const data = await venue.request(1, "","", {from:accounts[1]});
    const gasUsed = toBN(data.receipt.gasUsed);
    const gasPrice = toBN(data.receipt.effectiveGasPrice);
    const balanceAfter = toBN(await web3.eth.getBalance(accounts[1]));
    assert.equal(balanceBefore.toString(), balanceAfter.add(gasPrice.mul(gasUsed)).toString());
  })

  it("Accept offer should send money to the contract", async() => {
    const venue = await Venue.deployed();
    const balanceBefore = toBN(await web3.eth.getBalance(accounts[1]));
    const venueBalanceBefore = toBN(await web3.eth.getBalance(venue.address));

    const data = await venue.acceptOffer(0, {from: accounts[1], value: price});

    const balanceAfter = toBN(await web3.eth.getBalance(accounts[1]));
    const venueBalanceAfter = toBN(await web3.eth.getBalance(venue.address));
    const gasUsed = toBN(data.receipt.gasUsed);
    const gasPrice = toBN(data.receipt.effectiveGasPrice);
    assert.equal(data.logs[0].event, "OfferAccepted");
    assert.equal(data.logs[0].args[0], accounts[1]);
    assert.equal(balanceBefore.toString(), balanceAfter.add(toBN(price).add(gasUsed.mul(gasPrice))).toString());
    assert.equal(venueBalanceAfter.toString(), venueBalanceBefore.add(toBN(price)).toString());
  })
})

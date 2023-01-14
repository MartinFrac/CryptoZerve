const VenueBookingGenerator = artifacts.require("VenueBookingGenerator");
const Booking = artifacts.require("Booking");
const Venue = artifacts.require("Venue");
const { toBN } = web3.utils;

describe("VenueVsBooking", () => {
  let vbg, venue, accounts;
  beforeEach("Contract setup for testing", async () => {
    venue = await Venue.new("venue");
    vbg = await VenueBookingGenerator.new("vbg", "location");
    accounts = await web3.eth.getAccounts();
  });

  const sumVenueOffer = async (acc, price) => {
    const offer = {
      numberOfPeople: 2,
      start: "",
      end: "",
      price: price,
      isConfirmed: false,
    }
    const txVenueRequest = await venue.request(2, "", "");
    const txVenueDiscover = await venue.discoverRequest();
    const txVenueOffer = await venue.proposeOffer(acc, offer);
    const txVenueGasSum = txVenueRequest.receipt.gasUsed + txVenueOffer.receipt.gasUsed + txVenueOffer.receipt.gasUsed;
    return txVenueGasSum;
  }

  it("Should create contract instances", async () => {
    assert(vbg !== undefined);
    assert(venue !== undefined);
  })

  it("Should output gas cost for creating an offer", async () => {
    //venue
    const price = 1000;
    const txVenueGasSum = await sumVenueOffer(accounts[1], price);

    //booking
    const txVbgBooking = await vbg.createBooking("name", "", "", "location", {value: price});

    console.log("Venue gas: ".padStart(15, ' ') + txVenueGasSum);
    console.log("VBG gas: ".padStart(15, ' ') + txVbgBooking.receipt.gasUsed);
  })

  it("Should output gas for lifecycle of creating and booking an offer", async () => {
    //venue
    const price = 1000;
    const ref = "test";
    const txVenueGasOffer = await sumVenueOffer(accounts[1], price);
    const txVenueGasBook = await venue.acceptOffer(0, {from: accounts[1], value: price});
    //booking
    const createCall = await vbg.createBooking.call("name", "", "", "location");
    const txCreateBooking = await vbg.createBooking("name", "", "", "location", {from: accounts[0], value: price});
    const bookingAddress = await vbg.getBooking.call(createCall);
    const bookingInstance = await Booking.at(bookingAddress);
    const bookingRef = await bookingInstance.book.call(ref, {from:accounts[1], value: price});
    const txBookingBook = await bookingInstance.book(ref, {from:accounts[1], value: price});
    const txBookingConfirm = await bookingInstance.confirmAttendance(ref, {from: accounts[0]});

    const txVenueGasSum = txVenueGasOffer + txVenueGasBook.receipt.gasUsed;
    const txbookingGasSum = txCreateBooking.receipt.gasUsed + txBookingBook.receipt.gasUsed + txBookingConfirm.receipt.gasUsed;
    console.log("Venue gas: ".padStart(15, ' ') + txVenueGasSum);
    console.log("VBG gas: ".padStart(15, ' ') + txbookingGasSum);
  })
});

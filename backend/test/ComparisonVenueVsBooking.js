const VenueBookingGenerator = artifacts.require("VenueBookingGenerator");
const SystemVenueGenerator = artifacts.require("SystemVenueGenerator");
const Booking = artifacts.require("Booking");
const Venue = artifacts.require("Venue");
const VenueSlots = artifacts.require("VenueSlots");
const { toBN } = web3.utils;

describe("VenueVsBookingVsVenueSlots", () => {
  let svg, vbg, venue, venueSlots, accounts;
  beforeEach("Contract setup for testing", async () => {
    venue = await Venue.new("venue", "location");
    svg = await SystemVenueGenerator.new();
    vbg = await VenueBookingGenerator.new("vbg", "location");
    venueSlots = await VenueSlots.new(
      "Wigra",
      "33.454, 43.4325",
      3,
      2023,
      0b110011,
      0b111100001111,
      30,
      5000,
      { value: 20_000 }
    );
    accounts = await web3.eth.getAccounts();
  });

  const sumVenueOffer = async (acc, price) => {
    const offer = {
      numberOfPeople: 2,
      start: "",
      end: "",
      price: price,
      isConfirmed: false,
    };
    const txVenueRequest = await venue.request(2, "", "");
    const txVenueDiscover = await venue.discoverRequest();
    const txVenueOffer = await venue.proposeOffer(acc, offer);
    const txVenueGasSum =
      txVenueRequest.receipt.gasUsed +
      txVenueOffer.receipt.gasUsed +
      txVenueOffer.receipt.gasUsed;
    return txVenueGasSum;
  };

  it("Should create contract instances", async () => {
    assert(vbg !== undefined);
    assert(venue !== undefined);
    assert(venueSlots !== undefined);
  });

  it("Should output gas cost for creating a venue", async () => {
    //venue
    const txNewVenue = await svg.createVenue("name", "location", {
      from: accounts[0],
    });
    const txNewVS = await VenueSlots.new(
      "Wigra",
      "33.454, 43.4325",
      3,
      2023,
      0b110011,
      0b111100001111,
      30,
      5000,
      { value: 20_000 }
    );

    const gasEstimate = await web3.eth.getTransactionReceipt(txNewVS.transactionHash);
    console.log("VS gas: ".padStart(20, " ") + gasEstimate.gasUsed);
    console.log("SVG gas: ".padStart(20, " ") + txNewVenue.receipt.gasUsed);
  });

  it("Should output gas cost for creating an offer", async () => {
    //venue
    const price = 1000;
    const txVenueGasSum = await sumVenueOffer(accounts[1], price);

    //booking
    const txVbgBooking = await vbg.createBooking("name", "", "", "location", {
      value: price,
    });

    //venueslots
    const txVSBooking = await venueSlots.book(1, 1, 1, 1, 1, { value: 5000 });

    console.log(
      "VenueSlots gas: ".padStart(20, " ") + txVSBooking.receipt.gasUsed
    );
    console.log("Venue gas: ".padStart(20, " ") + txVenueGasSum);
    console.log("VBG gas: ".padStart(20, " ") + txVbgBooking.receipt.gasUsed);
  });

  it("Should output gas for lifecycle of creating and booking an offer", async () => {
    //venue
    const price = 1000;
    const ref = "test";
    const txVenueGasOffer = await sumVenueOffer(accounts[1], price);
    const txVenueGasBook = await venue.acceptOffer(0, {
      from: accounts[1],
      value: price,
    });
    //booking
    const createCall = await vbg.createBooking.call("name", "", "", "location");
    const txCreateBooking = await vbg.createBooking(
      "name",
      "",
      "",
      "location",
      { from: accounts[0], value: price }
    );
    const bookingAddress = await vbg.getBooking.call(createCall);
    const bookingInstance = await Booking.at(bookingAddress);
    const bookingRef = await bookingInstance.book.call(ref, {
      from: accounts[1],
      value: price,
    });
    const txBookingBook = await bookingInstance.book(ref, {
      from: accounts[1],
      value: price,
    });
    const txBookingConfirm = await bookingInstance.confirmAttendance(ref, {
      from: accounts[0],
    });

    //venueslots
    const day = 1;
    const pin = 1;
    const addressEnd = 0xa1;
    const txVSBooking = await venueSlots.book(day, 1, 1, 1, pin, {
      value: 5000,
    });
    const txVSConfirm = await venueSlots.confirmAttendance(
      day,
      addressEnd,
      pin + 1,
      { from: accounts[0] }
    );

    const txVSGasSum =
      txVSBooking.receipt.gasUsed + txVSConfirm.receipt.gasUsed;
    const txVenueGasSum = txVenueGasOffer + txVenueGasBook.receipt.gasUsed;
    const txbookingGasSum =
      txCreateBooking.receipt.gasUsed +
      txBookingBook.receipt.gasUsed +
      txBookingConfirm.receipt.gasUsed;
    console.log("VS gas: ".padStart(15, " ") + txVSGasSum);
    console.log("Venue gas: ".padStart(15, " ") + txVenueGasSum);
    console.log("VBG gas: ".padStart(15, " ") + txbookingGasSum);
  });
});

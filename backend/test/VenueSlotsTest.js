const VenueSlots = artifacts.require("VenueSlots");
const { toBN } = web3.utils;

contract("VenueSlots", (accounts) => {
  let venue;
  let instance = {
    name: "name",
    location: "location",
    dayOfTheYear: 1,
    year: 2023,
    daysRule: 0b1010,
    slotsRule: 0b0111,
    noSlots: 30,
    price: 500,
    payable: 10_000,
  }

  const setup = async ({ name = instance.name, location = instance.location, dayOfTheYear = instance.dayOfTheYear, year = instance.year, daysRule = instance.daysRule, slotsRule = instance.slotsRule, noSlots = instance.noSlots, price = instance.price, payable = instance.payable }={}) => {
    venue = await VenueSlots.new(
      name,
      location,
      dayOfTheYear,
      year,
      daysRule,
      slotsRule,
      noSlots,
      price,
      {value: payable}
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

  describe("Errors", async () => {
    it("Book should throw when outside of contract expiration", async () => {
      const startDay = 20;
      const bookDay = startDay + 190;
      await setup({dayOfTheYear: startDay})
      let error;
      try {
        await venue.book(bookDay, 1, 1, 1, 1);
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("booking day is not within contract constraints", error.data.reason);
    });

    it("Book should throw when before contract start", async () => {
      const startDay = 5;
      const bookDay = startDay - 1;
      await setup({dayOfTheYear: 5})
      let error;
      try {
        await venue.book(bookDay, 1, 1, 1, 1);
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("booking day is not within contract constraints", error.data.reason);
    });

    it("Book should throw when day is not available", async () => {
      await setup({dayOfTheYear: 1, daysRule: 0b1010});
      let error;
      try {
        await venue.book(1, 1, 1, 1, 1);
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("Day needs to be available for the venue", error.data.reason);
    })

    it("Book should throw when not enough room for all the units", async () => {
      await setup({slotsRule: 0b111111});
      let error;
      try {
        await venue.book(2, 1, 1, 40, 1);
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("not enough room for the units", error.data.reason);
    })

    const testArraySlotsUnavailable = [[1,3], [2, 4], [3,3], [9,9]];
    testArraySlotsUnavailable.forEach(async (slots) => {
      it(`Args: ${slots}| Book should throw when half hour slots are not available`, async () => {
        await setup({slotsRule: 0b11000011}) 
        let error;
        try {
          await venue.book(2, slots[0], slots[1], 1, 1);
        } catch (err) {
          error = err;
        }
        assert(error, "should throw an error");
        assert.equal("Slots needs to be available for the venue", error.data.reason);
      })
    })

    it("Book should throw an error when price is not matched", async () => {
      await setup();
      let error;
      try {
        await venue.book(2,1,1,1,1, {value:instance.price + 1});
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("the price is not matched", error.data.reason);
    })

    it("Book should throw when slots not payed", async () => {
      await setup({payable: 0});
      let error;
      try {
        await venue.book(2,1,1,1,1, {value: instance.price});
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("not enough slots are covered", error.data.reason);
    })

    it("Book should throw when slots already taken", async () => {
      await setup({noSlots: 10});
      let error;
      await venue.book(2,1,1,10,1, {value: instance.price * 10});
      try {
        await venue.book(2,1,1,1,1, {value: instance.price});
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("not enough room for the units", error.data.reason);
    })

    it("Confirm should throw when wrong ref", async () => {
      await setup();
      let error;
      const day = 2;
      const bookCall = await venue.book.call(day,1,1,1,1, {value: instance.price});
      const bookTx = await venue.book(day,1,1,1,1, {value: instance.price});
      try {
        await venue.confirmAttendance(day, 0xC1, bookCall.add(toBN(1)));
      } catch (err) {
        error = err;
      }
      assert(error, "should throw an error");
      assert.equal("wrong ref", error.data.reason);
    })
  });

  //Happy path
  
  const testArraySlotsAvailable = [[1,1], [4,6], [8,9]];
  testArraySlotsAvailable.forEach(async (slots) => {
    const price = instance.price * (slots[1]-slots[0]+1)
    it(`Args: ${slots}| Book should book when slots available`, async () => {
      await setup({slotsRule: 0b110111001})
      await venue.book(2, slots[0], slots[1], 1, 1, {value: price});
    })
  })

  it("Should change state of contract when booked", async () => {
    await setup();
    const daySlot = 2;
    const startSlot = 1;
    const endSlot = 1;
    const units = 1;
    const price = instance.price;
    const bookCall = await venue.book.call(daySlot, startSlot, endSlot, units, 1, {value: price, from: accounts[1]});
    const bookTx = await venue.book(daySlot, startSlot, endSlot, units, 1, {value: price, from: accounts[1]});
    const bookings = await venue.getBookings.call(accounts[1]);
    const booking = await venue.getBooking(daySlot, 0xF0, bookCall);
    const unitsLeft = await venue.getNOFreeSlotUnits(daySlot, startSlot);
    assert.equal(daySlot, bookings[0].daySlot);
    assert.equal(startSlot, bookings[0].startHalfHourSlot);
    assert.equal(endSlot, bookings[0].endHalfHourSlot);
    assert.equal(units, bookings[0].units);
    assert.equal(price, bookings[0].price);
    assert.equal(instance.noSlots - units, unitsLeft.toString());
  })

  it("Should create correct reference when booked", async () => {
    await setup();
    const day = 2;
    const ref = await venue.book.call(day,1,1,1,1, {value: instance.price});
    const bookTx = await venue.book(day,1,1,1,1, {value: instance.price});
    const bookings = await venue.getBookings();
    const booking = await venue.getBooking.call(day, 0xC1, ref);
    assert.equal(bookings[0].ref, booking.ref);
  })

  it("Confirm should convert ref correctly", async () => {
    await setup();
    const day = 2;
    const addressEnd = 0xF0;
    let pin;
    const bookCall = toBN(await venue.book.call(day,1,1,1,1, {value: instance.price, from: accounts[1]}));
    pin = bookCall;
    const bookTx = await venue.book(day,1,1,1,1, {value: instance.price, from: accounts[1]});
    const confirmCall = await venue.confirmAttendance.call(day, addressEnd, pin);
    const confirmTx = await venue.confirmAttendance(day, addressEnd, pin);
  })

  it("Confirm should transfer correct amount", async () => {
    await setup();
    let pin;
    const day = 2;
    const addressEnd = 0xF0;
    const price = toBN(instance.price);
    const bookCall = toBN(await venue.book.call(day,1,1,1,1, {value: price, from: accounts[1]}));
    pin = bookCall;
    const bookTx = await venue.book(day,1,1,1,1, {value: price, from: accounts[1]});
    const bookings = await venue.getBookings(accounts[1]);

    const ownerBalanceBefore = toBN(await web3.eth.getBalance(accounts[0]));
    const confirmCall = toBN(await venue.confirmAttendance.call(day, addressEnd, pin));
    const confirmTx = await venue.confirmAttendance(day, addressEnd, pin);
    const ownerBalanceAfter = toBN(await web3.eth.getBalance(accounts[0]));
    const gasUsed = toBN(confirmTx.receipt.gasUsed);
    const gasPrice = toBN(confirmTx.receipt.effectiveGasPrice);
    const gasSum = gasUsed.add(gasPrice);
    const mulPrice = price.mul(toBN(2));
    const subGas = ownerBalanceBefore.sub(gasSum);
    const expected = subGas.add(mulPrice);
    assert.equal(expected.toString(), ownerBalanceAfter.toString());
  })

  it("test", async () => {

  })

  it("Should let book when meets all the rules", async () => {
    await venue.book(2, 1, 1, 1, 1, {value: instance.price});
  })
});


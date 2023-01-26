// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
//ideas:
//let enter hours and minutes instead of slots

contract VenueSlots {
  string public name;
  string public location;
  uint256 public price;
  address payable public owner;
  uint16 public startDayOfTheContract;
  //day in the year i.e. 32 == 1st of February
  uint16 public startDayYear;
  //what year i.e. 2025

  uint256 private _payedSlots;
  mapping(uint32 => Booking) private _refToBooking;
  mapping(address => Booking[]) private _bookings;
  uint16 private _afterExpire;
  //for now 6 months, 180 days - what days were made available to book
  uint256 private _slotsDaysRule;
  //what days in the year are available
  uint64 private _slotsHalfHourRule;
  //what hours in the day are available
  uint64 private _nOSlotsPerHalfHour;
  //how many units are available per slot
  mapping(uint256 => uint64) private _halfHourSlotToUnits;
  //day and half hour slot to number of units available (counter of units available). i.e. 24/30. Schema: day + slot = 3 + 24 (third day, 24th slot)

  //=====GETTERS=====

  function getNOFreeSlotUnits(uint16 day, uint8 slot) external view returns(uint64) {
    return _nOSlotsPerHalfHour - _halfHourSlotToUnits[convertToDayPlusHalfHourMap(day, slot)];
  }

  function getBookings(address user) external view onlyOwner returns(Booking[] memory) {
    return _bookings[user];
  }

  function getBookings() external view returns(Booking[] memory) {
    return _bookings[msg.sender];
  }

  function getBooking(uint8 day, uint8 addressEnd, uint16 pin) external view onlyOwner returns(Booking memory) {
    Booking memory booking = _refToBooking[convertToRef(day, addressEnd, pin)];
    require(booking.daySlot != 0, "wrong ref");
    return booking;
  }

  constructor(string memory _name, string memory _location, uint16 _startDayOfTheContract, uint16 _startDayYear, uint256 slotsDaysRule, uint64 slotsHalfHourRule, uint64 nOSlotsPerHalfHour, uint256 _price) payable {
    name = _name;
    location = _location;
    require(_startDayOfTheContract > 0 && _startDayOfTheContract <= 366, "Start day needs to be within a year cycle");
    startDayOfTheContract = _startDayOfTheContract;
    startDayYear = _startDayYear;
    owner = payable(msg.sender);
    _slotsDaysRule = slotsDaysRule;
    _slotsHalfHourRule = slotsHalfHourRule;
    _nOSlotsPerHalfHour = nOSlotsPerHalfHour;
    price = _price;
    _payedSlots += msg.value / price;
    _afterExpire = 180;
  }

  struct Booking {
    uint256 daySlot;
    uint64 startHalfHourSlot;
    uint64 endHalfHourSlot;
    uint8 units;
    uint256 price;
    uint32 ref;
  }

  //=====EVENTS=====
  event Test(uint256 test);

  //=====MODIFIERS=====
  modifier onlyOwner() {
    require(msg.sender == owner, "only owner");
    _;
  }

  //=====ONLY OWNER=====
  function changeOwner(address newOwner) external onlyOwner {
    owner = payable(newOwner);
  }

  function confirmAttendance(uint8 day, uint8 addressEnd, uint16 pin) external onlyOwner returns(uint256) {
    uint32 ref = convertToRef(day, addressEnd, pin); 
    Booking memory booking = _refToBooking[ref];
    require(booking.daySlot != 0, "wrong ref");
    uint256 payback = booking.price * 2;
    owner.transfer(payback);
    return payback;
  }

  function topUp() external onlyOwner payable {
    _payedSlots += msg.value / price;
  }
  
  //=====PUBLIC=====

  function book(uint8 day, uint8 startSlot, uint8 endSlot, uint8 units, uint16 pin) external payable returns(uint16) {
    uint256 _price = (endSlot - startSlot + 1) * units * price;
    checkRules(day, startSlot, endSlot, units, _price);
    uint32 ref = createRef(day, msg.sender, pin); 
    createBooking(day, startSlot, endSlot, units, _price, ref);
    fillSlots(endSlot - startSlot + 1, day, startSlot, units);
    _payedSlots -= (endSlot - startSlot + 1) * units;
    emit Test(uint16(ref));
    return uint16(ref);
  }

  //=====PRIVATE=====

  //=====STATE=====
  function fillSlots(uint64 numberOfSlots, uint8 day, uint8 startSlot, uint8 units) private {
    for (uint8 i = 0; i < numberOfSlots; i++) {
      _halfHourSlotToUnits[convertToDayPlusHalfHourMap(day, startSlot + i)] += units;
    }
  }

  function createBooking(uint8 day, uint8 startSlot, uint8 endSlot, uint8 units, uint256 _price, uint32 ref) private {
    Booking memory booking = Booking(day, startSlot, endSlot, units, _price, ref);
    _bookings[msg.sender].push(booking);
    _refToBooking[ref] = booking;
  }

  //======VIEWS======

  //ref = date + address(2) + random
  //123 1f 0547
  //[8], [8], [16]
  //within a day there is 15**2 * 10_000 permutations = 2_250_000 different references available
  function createRef(uint8 day, address user, uint16 pin) private view returns(uint32) {
    //encode day
    uint32 ref = day * 2 ** 24;
    //encode address last 2 chars
    uint8 last2 = getLast2(user);
    ref |= last2 * 2 ** 16;
    //encode random number
    ref |= createRandom(ref, pin);
    return ref;
  }

  function createRandom(uint32 ref, uint16 pin) private view returns(uint16) {
    bool isUnique = false;
    while (!isUnique) {
      if (pin >= 9999) {
        pin = 0;
      }
      pin += 1;
      uint32 newRef = ref | pin;
      Booking memory oldBooking = _refToBooking[newRef];
      if (oldBooking.daySlot == 0) {
        isUnique = true;
      }
    }
    return pin;
  }

  function checkRules(uint16 day, uint8 startSlot, uint8 endSlot, uint8 units, uint256 _price) view private returns(bool) {
    //check day against contract expiration
    require(day < (startDayOfTheContract + _afterExpire) && day >= startDayOfTheContract, "booking day is not within contract constraints");
    //check day against day rule bit
    uint256 isDayMatched = _slotsDaysRule & (1 << (day - 1));
    require(isDayMatched > 0, "Day needs to be available for the venue");
    uint8 slotsCount = endSlot - startSlot + 1;
    //check half hour slots against half hour rule bit
    uint64 slotsBitmap = (uint64(2) ** slotsCount) - 1;
    slotsBitmap = slotsBitmap * uint64(2) ** (startSlot - 1);
    uint64 slotsResult = slotsBitmap & _slotsHalfHourRule;
    require(slotsResult == slotsBitmap, "Slots needs to be available for the venue");
    //check if start slot and end slot cover bits in half hour slots for each person
    for (uint8 i = 0; i < slotsCount; i++) {
      uint256 dayPlusHalfHourMapSlot = convertToDayPlusHalfHourMap(day, startSlot + i);
      uint64 unitsPerSlot = _halfHourSlotToUnits[dayPlusHalfHourMapSlot];
      require(_nOSlotsPerHalfHour - unitsPerSlot >= units, "not enough room for the units");
    }
    require(_payedSlots >= (endSlot - startSlot + 1) * units, "not enough slots are covered");
    require(msg.value == _price, "the price is not matched");
    return true;
  }

  function getLast2(address user) private pure returns(uint8) {
    bytes memory b = abi.encodePacked(user);
    bytes1 lastByte = b[19];
    uint8 convert = uint8(lastByte);
    return convert;
  }

  function convertToDayPlusHalfHourMap(uint16 day, uint8 halfHourSlot) pure private returns(uint256) {
    return (day * 100) + halfHourSlot;
  }

  function convertToRef(uint8 day, uint8 addressEnd, uint16 pin) private pure returns(uint32) {
    uint32 ref = day * 2 ** 24;
    ref |= addressEnd * 2 ** 16;
    ref |= pin;
    return ref;
  }
}
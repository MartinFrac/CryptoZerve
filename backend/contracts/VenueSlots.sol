// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
//ideas:
//add description of rules
//let enter hours and minutes instead of slots

contract VenueSlots {
  string public name;
  string public location;
  //day in the year i.e. 32 == 1st of February
  uint16 public startDayOfTheContract;
  //what year i.e. 2025
  uint16 public startDayYear;
  address payable public owner;
  uint256 public price;

  mapping(uint32 => Booking) private _refToBooking;
  mapping(address => Booking[]) private _bookings;
  //for now 6 months, 180 days - what days were made available to book
  uint16 private _afterExpire;
  uint256 private _slotsDaysRule;
  //what hours in the day are available
  uint64 private _slotsHalfHourRule;
  //how many units are available per slot
  uint64 private _nOSlotsPerHalfHour;
  //day and half hour slot to number of units available (counter of units available). i.e. 24/30. Schema: day + slot = 3 + 24 (third day, 24th slot)
  mapping(uint256 => uint64) private _halfHourSlotToUnits;

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

  function getBooking(uint8 day, uint16 addressEnd, uint16 pin) external view onlyOwner returns(Booking memory) {
    return _refToBooking[convertToRef(day, addressEnd, pin)];
  }

  constructor(string memory _name, string memory _location, uint16 _startDayOfTheContract, uint16 _startDayYear, uint256 slotsDaysRule, uint64 slotsHalfHourRule, uint64 nOSlotsPerHalfHour, uint256 _price) {
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

  function confirmAttendance(string memory ref) external onlyOwner {

    // require(keccak256(abi.encodePacked(ref1)) == keccak256(abi.encodePacked(ref2)), "wrong ref");
  }
  
  //=====PUBLIC=====
  function book(uint8 day, uint8 startSlot, uint8 endSlot, uint8 units) external payable returns(uint16) {
    //require empty slot
    checkRules(day, startSlot, endSlot, units);
    uint256 _price = (endSlot - startSlot + 1) * units * price;
    uint32 ref = createRef(day); 
    //book
    Booking memory booking = Booking(day, startSlot, endSlot, units, _price, ref);
    _bookings[msg.sender].push(booking);
    _refToBooking[ref] = booking;
    // _addressToBookingsMapByRef[msg.sender][ref] = booking;
    for (uint8 i = 0; i < endSlot - startSlot + 1; i++) {
      _halfHourSlotToUnits[convertToDayPlusHalfHourMap(day, startSlot + i)] += units;
    }
    return uint16(ref);
  }

  //=====PRIVATE=====

  //ref = date + address(2) + random
  //123 1f 0547
  //[8], [8], [16]
  //within a day there is 15**2 * 10_000 permutations = 2_250_000 different references available
  function createRef(uint8 day) private view returns(uint32) {
    //encode day
    uint32 ref = day * 2 ** 24;
    //encode address last 2 chars
    uint8 last2 = getLast2(msg.sender);
    ref += last2 * 2 ** 16;
    //encode random number
    ref = createRandom(ref);
    return ref;
  }

  function createRandom(uint32 ref) private view returns(uint32) {
    uint32 random;
    bool isUnique = false;
    random = uint32(block.timestamp % 10_000);
    while (!isUnique) {
      if (random == 9999) {
        random = 0;
      }
      random += 1;
      ref += random;
      Booking memory oldBooking = _refToBooking[ref];
      if (oldBooking.daySlot == 0) {
        isUnique = true;
      }
    }
    return ref;
  }

  function checkRules(uint16 day, uint8 startSlot, uint8 endSlot, uint8 units) view private returns(bool) {
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

  function convertToRef(uint8 day, uint16 addressEnd, uint16 pin) private pure returns(uint32) {
    uint32 ref = day * 2 ** 24;
    ref += addressEnd * 2 ** 16;
    ref += pin;
    return ref;
  }
}
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
  mapping(address => Booking) private _bookings;
  //for now 6 months, 180 days - what days were made available to book
  uint16 private _afterExpire;
  uint256 private _slotsDaysRule;
  //what hours in the day are available
  uint64 private _slotsHalfHourRule;
  //how many units are available per slot
  uint64 private _nOSlotsPerHalfHour;
  //day and half hour slot to number of units available (counter of units available). i.e. 24/30. Schema: day + slot = 3 + 24 (third day, 24th slot)
  mapping(uint256 => uint64) private _halfHourSlotToUnits;

  constructor(string memory _name, string memory _location, uint16 _startDayOfTheContract, uint16 _startDayYear, uint256 slotsDaysRule, uint64 slotsHalfHourRule, uint64 nOSlotsPerHalfHour) {
    name = _name;
    location = _location;
    startDayOfTheContract = _startDayOfTheContract;
    startDayYear = _startDayYear;
    owner = payable(msg.sender);
    _slotsDaysRule = slotsDaysRule;
    _slotsHalfHourRule = slotsHalfHourRule;
    _nOSlotsPerHalfHour = nOSlotsPerHalfHour;
    _afterExpire = 180;
  }

  struct Booking {
    uint256 daySlot;
    uint64 startHalfHourSlot;
    uint64 endHalfHourSlot;
    uint8 units;
  }

  event Test(uint256 test);

  modifier onlyOwner() {
    require(msg.sender == owner, "only owner");
    _;
  }

  function changeOwner(address newOwner) external onlyOwner {
    owner = payable(newOwner);
  }

  function book(uint16 day, uint8 startSlot, uint8 endSlot, uint8 units) external payable {
    //require empty slot
    checkRules(day, startSlot, endSlot, units);
  }

  function confirmAttendance(string memory ref) external onlyOwner {

    // require(keccak256(abi.encodePacked(ref1)) == keccak256(abi.encodePacked(ref2)), "wrong ref");
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

  function convertToDayPlusHalfHourMap(uint16 day, uint8 halfHourSlot) pure private returns(uint256) {
    return (day * 100) + halfHourSlot;
  }
}
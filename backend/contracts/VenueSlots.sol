// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract VenueSlots {
  string public name;
  string public location;
  //day in the year i.e. 32 == 1st of February
  uint16 public startDayOfTheContract;
  //what year i.e. 2025
  uint16 public startDayYear;
  address payable public owner;
  mapping(address => Booking) private _bookings;
  //for now 6 months, 180 days
  uint256 private _slotsDays;
  //48 slots per day (every half an hour)
  mapping(uint8 => uint64) private _daySlotToHalfHour;

  constructor(string memory _name, string memory _location, uint16 _startDayOfTheContract, uint16 _startDayYear) {
    name = _name;
    location = _location;
    startDayOfTheContract = _startDayOfTheContract;
    startDayYear = _startDayYear;
    owner = payable(msg.sender);
  }

  struct Booking {
    uint256 daySlot;
    uint64 startHalfHourSlot;
    uint64 endHalfHourSlot;
    uint8 nOPeople;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "only owner");
    _;
  }

  function changeOwner(address newOwner) external onlyOwner {
    owner = payable(newOwner);
  }

  function book() external payable {

    // require(state1 == state2, "wrong state");
  }

  function confirmAttendance(string memory ref) external onlyOwner {

    // require(keccak256(abi.encodePacked(ref1)) == keccak256(abi.encodePacked(ref2)), "wrong ref");
  }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./Booking.sol";

contract VenueBookingGenerator {
  string public name;
  string public location;
  address payable public owner;
  mapping(uint256 => Booking) private bookings;
  uint256 private counter;

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
  }

  constructor(string memory name_, string memory location_) {
    owner = payable(msg.sender);
    name = name_;
    location = location_;
    counter = 0;
  }

  function createBooking(string memory name_, string memory start, string memory end, string memory location_) payable external onlyOwner returns(uint256) {
    Booking bookingContract = new Booking{value:msg.value}(name_, start, end, location_);
    bookingContract.changeOwner(msg.sender);
    bookings[counter] = bookingContract;
    counter++;
    return counter-1;
  }

  function getBooking(uint256 id) external view returns(Booking) {
    return bookings[id];
  }
}
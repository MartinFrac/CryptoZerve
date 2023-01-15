// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./VenueBookingGenerator.sol";

contract SystemVenueGenerator {
  mapping(uint256 => VenueBookingGenerator) private venues;
  uint256 private counter;

  constructor() {
    counter = 0;
  }

  function createVenue(string memory name, string memory location) external returns(uint256) {
    VenueBookingGenerator venueContract = new VenueBookingGenerator(name, location);
    venueContract.changeOwner(msg.sender);
    venues[counter] = venueContract;
    return counter++;
  }

  function getVenue(uint256 id) external view returns(VenueBookingGenerator) {
    return venues[id];
  } 
}
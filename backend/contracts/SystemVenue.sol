// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./Venue.sol";

contract SystemVenue {
  mapping(uint256 => Venue) private venues;
  uint256 private counter;

  constructor() {
    counter = 0;
  }

  function createVenue(string memory name, string memory location) external returns(uint256) {
    Venue venueContract = new Venue(name, location);
    venueContract.changeOwner(msg.sender);
    venues[counter] = venueContract;
    return counter++;
  }

  function getVenue(uint256 id) external view returns(Venue) {
    return venues[id];
  }
}

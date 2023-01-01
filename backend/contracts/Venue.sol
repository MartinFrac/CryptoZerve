// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Venue {
  string private name;
  uint8 private year;
  address private owner;
  Request[] private _requests;
  mapping(address => Offer[]) private _offers;

  struct Request {
    address user;
    uint8 numberOfPeople;
    string start;
    string end;
  }

  struct Offer {
    uint8 numberOfPeople;
    string start;
    string end;
    uint256 price;
    bool isConfirmed;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "only owner");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function request(uint8 numberOfPeople, string memory start, string memory end) public {
    _requests.push(Request(msg.sender, numberOfPeople, start, end));
  }

  function discoverRequest() public onlyOwner returns (Request memory) {
    Request memory data = _requests[_requests.length - 1];
    _requests.pop();
    return data;
  }

  function proposeOffer(address user, Offer memory offer) public onlyOwner {
    _offers[user].push(offer);
  }

  function checkOffers() public view returns (Offer[] memory) {
    return _offers[msg.sender];
  }

  function acceptOffer(uint8 id) public {
    _offers[msg.sender][id].isConfirmed = true;
  }
}

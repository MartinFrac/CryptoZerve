// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Venue {
  string public name;
  address public owner;
  Request[] private _requests;
  mapping(address => Offer[]) private _offers;

  event NewRequest(address);
  event NewOffer(address);
  event OfferAccepted(address);

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

  constructor(string memory name_) {
    owner = msg.sender;
    name = name_;
  }

  function changeOwner(address newOwner) external onlyOwner {
    owner = payable(newOwner);
  }

  function request(uint8 numberOfPeople, string memory start, string memory end) public {
    _requests.push(Request(msg.sender, numberOfPeople, start, end));
    emit NewRequest(msg.sender);
  }

  function discoverRequest() public onlyOwner returns (Request memory) {
    Request memory data = _requests[_requests.length - 1];
    _requests.pop();
    return data;
  }

  function proposeOffer(address user, Offer memory offer) public onlyOwner {
    _offers[user].push(offer);
    emit NewOffer(user);
  }

  function checkOffers() public view returns (Offer[] memory) {
    return _offers[msg.sender];
  }

  function acceptOffer(uint8 id) external payable {
    Offer memory offer = _offers[msg.sender][id];
    require(msg.value == offer.price, "wrong amount");
    _offers[msg.sender][id].isConfirmed = true;
    emit OfferAccepted(msg.sender);
  }
}

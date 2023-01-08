// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Booking {
  string public name;
  string public start;
  string public end;
  uint256 public priceInWei;
  string public location;
  string private ref;

  address payable public seller;
  address public buyer;

  State public state;

  enum State { Created, Locked, Release, Inactive }

  error OnlySeller();
  error InvalidState();
  error IncorrectRef();

  modifier correctRef(string memory ref_) {
    if (keccak256(abi.encodePacked(ref_)) != keccak256(abi.encodePacked(ref))) {
      revert IncorrectRef();
    }
    _;
  }

  modifier onlySeller() {
    if (msg.sender != seller) {
      revert OnlySeller();
    }
    _;
  }

  modifier inState(State state_) {
    if (state != state_) {
      revert InvalidState();
    }
    _;
  }

  modifier condition(bool condition_) {
    require(condition_, "condition not met");
    _;
  }

  event Aborted();
  event Booked();
  event AttendanceConfirmed();

  constructor(string memory name_, string memory start_, string memory end_, string memory location_) payable {
    seller = payable(msg.sender);
    priceInWei = msg.value;
    state = State.Created;
    name = name_;
    start = start_;
    end = end_;
    location = location_;
  }

  function abort() external onlySeller inState(State.Created) {
    emit Aborted();
    state = State.Inactive;
    seller.transfer(address(this).balance);
  }

  function book(string memory ref_) external inState(State.Created) condition(msg.value == priceInWei) payable {
    emit Booked();
    ref = ref_;
    buyer = msg.sender;
    state = State.Locked;
  }

  function confirmAttendance(string memory ref_) external correctRef(ref_) onlySeller inState(State.Locked) {
    emit AttendanceConfirmed();
    state = State.Release;
    seller.transfer(address(this).balance);
  }
}
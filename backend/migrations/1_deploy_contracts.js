const Venue = artifacts.require("Venue");
const Booking = artifacts.require("Booking");

module.exports = function(deployer) {
  deployer.deploy(Venue, "Venue1");
  deployer.deploy(Booking, "Booking1", "2022-02-02", "2022-02-05", "LU13FA");
};

const Venue = artifacts.require("Venue");
const Booking = artifacts.require("Booking");

module.exports = function(deployer) {
  deployer.deploy(Venue, "Venue1", "Location1");
};

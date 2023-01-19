const Venue = artifacts.require("Venue");
const Booking = artifacts.require("Booking");
const VenueSlots = artifacts.require("VenueSlots");

module.exports = function(deployer) {
  deployer.deploy(Venue, "Venue1", "Location1");
  deployer.deploy(VenueSlots, "name", "location", 1, 2023, 100, 100, 30);
};

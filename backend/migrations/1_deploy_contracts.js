const Venue = artifacts.require("Venue");
const Booking = artifacts.require("Booking");
const VenueSlots = artifacts.require("VenueSlots");

module.exports = function(deployer) {
  deployer.deploy(Venue, "Venue1", "Location1");
  deployer.deploy(VenueSlots, "Wigra", "33.454, 43.4325", 1, 2023, 100, 100, 30, 5000, {value: 10_000});
};

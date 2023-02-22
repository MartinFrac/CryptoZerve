const Venue = artifacts.require("Venue");
const Booking = artifacts.require("Booking");
const VenueSlots = artifacts.require("VenueSlots");

module.exports = function(deployer) {
  deployer.deploy(Venue, "Venue1", "Location1");
  deployer.deploy(VenueSlots, "Wigra", "33.454, 43.4325", 3, 2023, 0b110011, 0b111100001111, 30, 5000, {value: 20_000});
};

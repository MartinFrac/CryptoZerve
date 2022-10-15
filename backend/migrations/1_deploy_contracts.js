const Venue = artifacts.require("Venue");

module.exports = function(deployer) {
  deployer.deploy(Venue);
};

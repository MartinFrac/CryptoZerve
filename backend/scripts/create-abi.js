const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./build/contracts/VenueSlots.json', 'utf8'));

fs.writeFile('../client/abi/VenueSlots.json', JSON.stringify(contract.abi), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
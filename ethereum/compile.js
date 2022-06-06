const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
fs.ensureDirSync(buildPath);

const input = {
  language: "Solidity",
  sources: {
    Campaign: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var outputs = JSON.parse(solc.compile(JSON.stringify(input))).contracts.Campaign;

Object.keys(outputs).forEach((contract) => {
  console.log(contract);
  fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), outputs[contract]);
});

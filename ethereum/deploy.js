// deploy code will go here
require("dotenv").config({ path: `.env.local` });
const fs = require("fs-extra");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const path = require("path");
const compiledFactory = require("./build/CampaignFactory.json");
const deployPath = path.resolve(__dirname, "deploy");
fs.removeSync(deployPath);

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.RINKEBY_NODE);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account ${accounts[0]}`);

  const contract = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "3000000",
    });
  console.log("Contract deployed to", contract.options.address);
  // write contract address and abi to file
  const output = {
    address: contract.options.address,
    abi: compiledFactory.abi,
  };
  fs.ensureDirSync(deployPath);
  fs.writeJsonSync(path.resolve(deployPath, "CampaignFactory.json"), output);

  return contract;
};

deploy()
  .then(() => {
    console.log("Deployment complete");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });

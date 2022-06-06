import web3 from "./web3";
import { abi, address } from "./deploy/CampaignFactory.json";
const factoryInstance = new web3.eth.Contract(abi, address);

export default factoryInstance;

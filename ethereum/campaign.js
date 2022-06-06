import web3 from "./web3";
import compiledCampaign from "./build/Campaign.json";

const createCampaignInstance = async (address) => {
  const campaignInstance = await new web3.eth.Contract(compiledCampaign.abi, address);
  return campaignInstance;
};

export default createCampaignInstance;

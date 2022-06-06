// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimumAmmount) public {
        address newCampaign = address(new Campaign(minimumAmmount, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approverCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minContribution;
    mapping(address => bool) public approvers;
    uint256 public totalApprovers;

    constructor(uint256 minimum, address createdBy) {
        manager = createdBy;
        minContribution = minimum;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minContribution,
            address(this).balance,
            requests.length,
            totalApprovers,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    function contribute() public payable {
        require(msg.value > minContribution);
        require(!approvers[msg.sender]);
        approvers[msg.sender] = true;
        totalApprovers++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approverCount = 0;
    }

    function approveRequest(uint256 idx) public {
        require(idx < requests.length);
        Request storage currentRequest = requests[idx];
        require(approvers[msg.sender]);
        require(!currentRequest.approvals[msg.sender]);
        currentRequest.approvals[msg.sender] = true;
        currentRequest.approverCount++;
    }

    function finalizeRequest(uint256 idx) public restricted {
        require(idx < requests.length);
        Request storage currentRequest = requests[idx];
        require(!currentRequest.complete);
        require(currentRequest.approverCount > totalApprovers / 2);
        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}

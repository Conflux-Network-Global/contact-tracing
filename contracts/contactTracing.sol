pragma solidity ^0.6.0;

contract Registration {
    mapping(address => address) private individualContracts;
    mapping(address => address) private payloadMap;
    mapping(address => uint256) private rewardTimestamp;
    event NewPayload(address payload);

    constructor() public payable {} //payable constructor for initial funding

    function newRegistration() external {
        require(getIndividual() == address(0), "newRegistration: address is already registered");

        Individual newContract = new Individual(msg.sender);

        individualContracts[msg.sender] = address(newContract);
    }

    function registerPayload(bytes calldata _payload) external {
        require(getIndividual() != address(0), "registerPayload: unregistered address");

        //get address from payload
        bytes32 payload = keccak256(_payload);
        address user = address(bytes20(payload));
        require(payloadMap[user] == address(0), "registerPayload: payload address already taken");

        payloadMap[user] = individualContracts[msg.sender];
        reward();
        emit NewPayload(user);
    }

    function checkHealth(address personalPayload, address contactPayload) view external returns (bool) {
        require(payloadMap[personalPayload] == individualContracts[msg.sender], "checkHealth: invalid personalPayload");
        require(payloadMap[contactPayload] != address(0), "checkHealth: invalid contactPayload");

        address contractAddress = payloadMap[contactPayload];
        Individual indContract = Individual(contractAddress);
        return indContract.checkStatus(personalPayload);
    }

    function getIndividual() public view returns (address) {
        return individualContracts[msg.sender];
    }

    function reward() private {
        if (now > rewardTimestamp[msg.sender] + 1 days) {
            rewardTimestamp[msg.sender] = now;
            msg.sender.transfer(100000);
        }
    }

    //payable contract to be able to receive later funding
    receive () external payable {}
}

contract Individual {
    address private owner;
    mapping (address => uint256) private _balances;
    bool private healthy;
    address private registrationAddress;
    event NewContact(address contact);

    constructor(address _owner) public {
        owner = _owner;
        healthy = true;
        registrationAddress = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "not owner");
        _;
    }

    function contact(bytes calldata _payload) external onlyOwner {
        //get address from payload
        bytes32 payload = keccak256(_payload);
        address user = address(bytes20(payload));

        //safe addition check
        uint256 newBalance = _balances[user] + 1;
        require(newBalance > _balances[user], "contact: overflow error");

        //log contact
        _balances[user] = newBalance;
        emit NewContact(user);
    }

    function toggleHealth() external onlyOwner{
        healthy = !healthy;
    }

    function checkStatus(address _addressCheck) external view returns (bool) {
        require(msg.sender == registrationAddress, "checkStatus: not registration contract");
        require(_balances[_addressCheck] > 0, "checkStatus: no contact"); //does not return info if tokens not exchanged

        return healthy;
    }

    function getStatus() external view onlyOwner returns (bool) {
      return healthy;
    }
}

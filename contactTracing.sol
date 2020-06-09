pragma solidity ^0.6.0;

contract Registration {
    mapping(address => address) private individualContracts;
    mapping(address => address) private payloadMap;
    
    function newRegistration() external returns (address) {
        require(getIndividual() == address(0), "newRegistration: address is alredy registered");
        
        Individual newContract = new Individual(msg.sender);
        
        individualContracts[msg.sender] = address(newContract);
        return address(newContract);
    }
    
    function registerPayload(bytes memory _payload) external returns (address) {
        require(getIndividual() != address(0), "registerPayload: unregistered address");
        
        //get address from payload
        bytes32 payload = keccak256(_payload);
        address user = address(bytes20(payload));
        
        payloadMap[user] = individualContracts[msg.sender];
        
        return user;
    }
    
    function checkHealth(address personalPayload, address contactPayload) external view returns (bool) {
        require(payloadMap[personalPayload] == msg.sender, "checkHealth: invalid personalPayload");
        require(payloadMap[contactPayload] != address(0), "checkHealth: invalid contactPayload");
        
        address contractAddress = payloadMap[contactPayload];
        Individual indContract = Individual(contractAddress);
        return indContract.checkStatus(personalPayload);
        
    }
    
    function getIndividual() public view returns (address) {
        return individualContracts[msg.sender];
    } 
}

contract Individual {
    address private owner;
    mapping (address => uint256) private _balances;
    bool private healthy;
    address registrationAddress;
    
    constructor(address _owner) public {
        owner = _owner;
        healthy = true;
        registrationAddress = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "not owner");
        _;
    }
    
    function contact(bytes memory _payload) external onlyOwner returns (address) {
        //get address from payload
        bytes32 payload = keccak256(_payload);
        address user = address(bytes20(payload));
        
        //safe addition check
        uint256 newBalance = _balances[user] + 1;
        require(newBalance > _balances[user], "contact: overflow error");
        
        //log contact        
        _balances[user] = newBalance;
        return user;
    }
    
    function toggleHealth() external onlyOwner{
        healthy = !healthy;
    }
    
    function checkStatus(address _addressCheck) external view returns (bool) {
        require(msg.sender == registrationAddress, "checkStatus: not registration contract");
        require(_balances[_addressCheck] > 0, "checkStatus: no contact"); //does not return info if tokens not exchanged
        
        return healthy;
    }
}

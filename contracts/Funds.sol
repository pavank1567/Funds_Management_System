// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Funds {
    //Smart Contract owner will be the person who deploys the contract only he can authorize various roles like retailer, Manufacturer,etc
    address public Owner;

    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor() public{
        Owner = msg.sender;
    }

    //Modifier to restrict the access to owner
    modifier onlyOwner() {
        require(msg.sender == Owner);
        _;
    }


    //Structure which represents a Supplier
    struct Supplier{
        address addr;
        uint id;
        string name;
        string place;
    }

    //Mapping to maintain the record of suppliers
    mapping(address=>Supplier) public suppliers;

    //Structure which represents an Organization
    struct Organization{
        address addr;
        uint id;
        string name;
        string place;
    }
    
    //Mapping to maintain the record of Organizations
    mapping(address=>Organization) public orgs;

    struct Payment{//transactioin details
        address sender;
        address receiver;
        uint amt;
        uint timestamp;
        string message;
    }

    //Payment Array to store the records of payments
    Payment[] public payments;

    uint supCnt=0;
    uint orgCnt=0;
    uint transactionCount=0;

    //An event to be emitted when an organization is added.
    event AddOrg(address addr,uint id,string name,string place);

    //A function is used to add an organization
    function addOrganization(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyOwner(){
        orgCnt+=1;
        orgs[_address]=Organization(_address,orgCnt,_name,_place);
        emit AddOrg(_address,orgCnt,_name,_place);
    }

    //Event to be emitted when an organization is removed.
    event removeOrg(uint id, address addr, string name, string place);

    //A function which is used to remove an organization
    function removeOrganization(
        address _address
    ) public onlyOwner(){
        emit removeOrg(orgs[_address].id, orgs[_address].addr, orgs[_address].name, orgs[_address].place);
        delete orgs[_address];
    }

    //Function to get Organization details by it's account address
    function getOrganization(address _address) public view returns (Organization memory){
        return orgs[_address];
    }


    //Event which is to be emitted when a Supplier is added
    event AddSup(address addr,uint id,string name,string place);

    //Event which is to be emitted when a Supplier is removed
    event removeSup(uint id,address addr,string name,string place);

    //Function to add a Spplier
    function addSupplier(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyOwner(){
        supCnt+=1;
        suppliers[_address]=Supplier(_address,supCnt,_name,_place);
        emit AddSup(_address,orgCnt,_name,_place);
    }

    //Function to remove a supplier
    function removeSupplier(
        address _address
    ) public onlyOwner(){
        emit removeSup(suppliers[_address].id, suppliers[_address].addr, suppliers[_address].name, suppliers[_address].place);
        delete suppliers[_address];
    }

    //Function to get Supplier details by account address
    function getSuplier(address _address) public view returns(Supplier memory){
        return suppliers[_address];
    }

    //The Event to be emitted when payment is done
    event Pay(address from,address to, uint amount, uint time,string message);

    //Function to make a payment
    function pay(address rec,uint amount,string memory message) public{
        transactionCount+=1;
        payments.push(Payment(msg.sender,rec, amount, block.timestamp, message));
        emit Pay(msg.sender,rec, amount,block.timestamp, message);
    }

    //Function to get the record of all transactions available
    function getAllTransactions() public view returns(Payment[] memory){
        return payments;
    }

    struct Request{
        address sender;
        address receiver;
        uint amt;
        string message;
        uint timestamp;
    }

    //Array of requests
    Request[] public requests;

    //Event to be emitted when a request is made
    event Req(address from,address to,uint value,string message,uint time);

    //Function to request funds
    function requestFunds(
        address provider,
        uint amt,
        string memory message
    ) public{
        requests.push(Request(msg.sender,provider,amt,message, block.timestamp));
        emit Req(msg.sender,provider,amt,message,block.timestamp);
    }

    struct Confirmation{
        address sender;
        address receiver;
        uint timestamp;
        string message;
    }

    Confirmation[] confOrders;

    //Event to be emitted when the supplier confirms the payment of request for goods is received.
    event ConfirmOrder(address from, address to,uint timestamp,string message);
    
    //Function to confirm the order
    function confirmOrder(
        address receiver,
        string memory message
        ) public{
            confOrders.push(Confirmation(msg.sender, receiver, block.timestamp, message));
            emit ConfirmOrder(msg.sender, receiver, block.timestamp, message);
    }
}
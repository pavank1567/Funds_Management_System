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

    modifier onlyOwner() {
        require(msg.sender == Owner);
        _;
    }

    struct Supplier{
        address addr;
        uint id;
        string name;
        string place;
    }

    mapping(address=>Supplier) public suppliers;

    struct Organization{
        address addr;
        uint id;
        string name;
        string place;
    }
    
    mapping(address=>Organization) public orgs;

    struct Payment{//transactioin details
        address sender;
        address receiver;
        uint amt;
        uint timestamp;
        string message;
    }

    Payment[] public payments;

    uint supCnt=0;
    uint orgCnt=0;
    uint transactionCount=0;

    event AddOrg(address addr,uint id,string name,string place);

    function addOrganization(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyOwner(){
        orgCnt+=1;
        orgs[_address]=Organization(_address,orgCnt,_name,_place);
        emit AddOrg(_address,orgCnt,_name,_place);
    }

    event removeOrg(uint id, address addr, string name, string place);
    function removeOrganization(
        address _address
    ) public onlyOwner(){
        emit removeOrg(orgs[_address].id, orgs[_address].addr, orgs[_address].name, orgs[_address].place);
        delete orgs[_address];
    }
    function getOrganization(address _address) public view returns (Organization){
        return orgs[_address];
    }

    event AddSup(address addr,uint id,string name,string place);
    event removeSup(uint id,address addr,string name,string place);

    function addSupplier(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyOwner(){
        supCnt+=1;
        suppliers[supCnt]=Supplier(_address,supCnt,_name,_place);
        emit AddSup(_address,orgCnt,_name,_place);
    }
    function removeSupplier(
        address _address
    ) public onlyOwner(){
        emit removeSup(suppliers[_address].id, suppliers[_address].addr, suppliers[_address].name, suppliers[_address].place);
        delete suppliers[_address];
    }

    function getSuplier(address _address) public view returns(Supplier){
        return suppliers[_address];
    }

    event Pay(address from,address to, uint amount, uint time,string message);

    function pay(address rec,uint amount,string memory message) public{
        transactionCount+=1;
        payments.push(Payment(msg.sender,rec, amount, block.timestamp, message));
        // bool sent = rec.send(amount);
        // require(sent, "Failed to send Ether");
        emit Pay(msg.sender,rec, amount,block.timestamp, message);
    }

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
    Request[] public requests;


    event Req(address from,address to,uint value,string message,uint time);

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
    event ConfirmOrder(address from, address to,uint timestamp,string message);
    
    function confirmOrder(
        address receiver,
        string memory message
        ) public{
            confOrders.push(Confirmation(msg.sender, receiver, block.timestamp, message));
            emit ConfirmOrder(msg.sender, receiver, block.timestamp, message);
    }
}
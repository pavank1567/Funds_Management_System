// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
contract Funds {
    //Smart Contract owner will be the person who deploys the contract only he can authorize various roles like retailer, Manufacturer,etc
    address public Owner;

    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor() public {
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

    mapping(uint=>Supplier) public suppliers;

    struct Organization{
        address addr;
        uint id;
        string name;
        string place;
    }
    
    mapping(uint=>Organization) public orgs;

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
        orgs[orgCnt]=Organization(_address,orgCnt,_name,_place);
        emit AddOrg(_address,orgCnt,_name,_place);
    }

    event AddSup(address addr,uint id,string name,string place);

    function addSupplier(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyOwner(){
        supCnt+=1;
        suppliers[supCnt]=Supplier(_address,supCnt,_name,_place);
        emit AddSup(_address,orgCnt,_name,_place);
    }


    event Pay(address from,address to, uint amount, uint time,string message);

    function pay(address payable rec,uint amount,string memory message) public payable {
        transactionCount+=1;
        payments.push(Payment(msg.sender,rec, amount, block.timestamp, message));
        // bool sent = rec.send(msg.value);
        // require(sent, "Failed to send Ether");
        emit Pay(msg.sender,rec, amount,block.timestamp, message);
    }

    function getAllTransactions() public view returns (Payment[] memory){
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
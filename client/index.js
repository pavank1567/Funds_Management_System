import { ethers } from "./ethers-5.6.esm.min.js"
import { abi , contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect");

const sendButton = document.getElementById("sendButton");
const getBal=document.querySelector(".getBal");
const viewBal=document.querySelector(".viewBal");
const showBalance=document.querySelector(".showBalance")

const metAlert=document.querySelector(".metAlert");
const showAccount = document.querySelector('.showAccount');
const paymentContainer=document.getElementsByClassName('payment');

const alert=document.querySelector('.enable-alert');


connectButton.onclick = connect
sendButton.onclick = transfer

var currentAccount;
async function connect() {
  
  if(typeof window.ethereum !== "undefined"){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    currentAccount=account;
    showAccount.innerHTML = account;
  
    getBal.style.display="none";
    for(let i=0;i<paymentContainer.length;i++)
      paymentContainer[i].style.display="none";
  
    const act=document.querySelector('#account');
    if (act.style.display === "none") {
      act.style.display = "block";
    }
    alert.style.display="none";
  }
  else{
    metAlert.style.display="";
  }
}

viewBal.addEventListener('click', () => {
  getBalance();
});

async function getBalance(){
  
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(currentAccount)
      showBalance.innerHTML=ethers.utils.formatEther(balance)+" Ethers";
      if (getBal.style.display === "none") {
        getBal.style.display = "block";
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    metAlert.style.display="";
  }
}

const paymentButton=document.querySelector('.payment-btn');

paymentButton.addEventListener('click', () => {
  if(currentAccount){ 
    if(paymentContainer[0].style.display=="none"){
      for(let i=0;i<paymentContainer.length;i++)
        paymentContainer[i].style.display="";
    }
    else{
    for(let i=0;i<paymentContainer.length;i++)
      paymentContainer[i].style.display="none";
    }
  }
  else{
    alert.style.display="block";
  }
});

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress,abi, signer);

  return contract;
};


async function transfer() {
  const amount = document.querySelector(".amount").value;
  const receiver=document.querySelector(".rec").value;
  const message=document.querySelector(".message").value;
  console.log(`Transfering ${amount} ethers...`)
  if (typeof window.ethereum !== "undefined") {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const signer = provider.getSigner()
    // const contract = new ethers.Contract(contractAddress, abi, signer)
    const contract=createEthereumContract();

    console.log(contract);
    try {
      // const transactionResponse = await contract.pay(receiver,message,{
      //   value: ethers.utils.parseEther(amount),
      // })
      // console.log(currentAccount,receiver,amount);
      const parsedAmt=ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: receiver,
          value: parsedAmt._hex,
        }],
      });

      const transactionHash = await contract.pay(receiver, parsedAmt, message);

      var isLoading=true;
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      isLoading=false;

      // await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error)
    }
  } else {
    
  }
}

const getTran=document.querySelector('.getTran');
getTran.addEventListener('click', () => {
  getAllTransactions();
});

async function getAllTransactions(){
  console.log('Getting all transactions')
  if (typeof window.ethereum !== "undefined") {
    const contract=createEthereumContract();

    try {
      
      const availableTransactions = await contract.getAllTransactions();

      console.log(availableTransactions);

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        amount: parseInt(transaction.amt._hex) / (10 ** 18)
      }));

      console.log(structuredTransactions);

      // var isLoading=true;
      // console.log(`Loading - ${transactionHash.hash}`);
      // await transactionHash.wait();
      // console.log(`Success - ${transactionHash.hash}`);
      // isLoading=false;

      // await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error)
    }
  } else {
    
  }
}

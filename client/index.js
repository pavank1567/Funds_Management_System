
import {ethers} from "./ethers.js"
import { abi , contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect");

const sendButton = document.getElementById("sendButton");

const metAlert=document.querySelector(".metAlert");

const paymentContainer=document.getElementsByClassName('payment');

const alert=document.querySelector('.enable-alert');


connectButton.onclick = connect
sendButton.onclick = transfer

var currentAccount;
async function connect() {
  
  if(typeof window.ethereum !== "undefined"){

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    currentAccount=ethers.utils.getAddress(account);

    for(let i=0;i<paymentContainer.length;i++)
      paymentContainer[i].style.display="none";
  
    const act=document.querySelector('.account');
    const actAddress=document.querySelector('.actAddress');
    actAddress.innerHTML=currentAccount;


    const walletAmt=document.querySelector(".wallet-amt");
    const balance = await provider.getBalance(currentAccount);
    walletAmt.innerHTML=ethers.utils.formatEther(balance);

    if (act.style.display === "none") {
      act.style.display = "";
    }
    alert.style.display="none";
  }
  else{
    metAlert.style.display="";
  }
}

const paymentButton=document.querySelector('.payment-btn');

paymentButton.addEventListener('click', () => {
  if(currentAccount){ 

    localStorage.setItem("currentAccount",currentAccount);
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


async function transfer() {
  const amount = document.querySelector(".amount").value;
  const receiver=document.querySelector(".rec").value;
  const message=document.querySelector(".message").value;
  console.log(`Transfering ${amount} ethers...`)
  if (typeof window.ethereum !== "undefined") {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const parsedAmt=ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: receiver,
          value: parsedAmt._hex,
        }],
      });

      const transactionHash=await contract.pay(receiver,parsedAmt,message);

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

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

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // let userAddress = await signer.getAddress();
      // console.log(userAddress);

      const availableTransactions = await contract.getAllTransactions();
      console.log(availableTransactions);
      localStorage.setItem("availableTransactions",JSON.stringify(availableTransactions));
      location.href = "TransactionList.html";

    } catch (error) {
      console.log(error)
    }
  } else {
    
  }
}

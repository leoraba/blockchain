const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const Blockchain = require('./virtualcoin/blockchain')
const Transaction = require('./virtualcoin/transaction')

// private key goes here
const myKey = ec.keyFromPrivate('07b4070ba10517dfbae3f2523cb05af5717b1b3f7318772f6dbcd5693d2118ea')

// get public key aka wallet address
const myWalletAddress = myKey.getPublic('hex')
console.log(`my wallet address is: ${myWalletAddress}`)

// receiver address
const toAddress = '<receiver-address-goes-here>'

let virtualcoin = new Blockchain()

console.log(`~~~~~~start mining block 1`)
virtualcoin.minePendingTransactions(myWalletAddress)
console.log(`~~~~~~end mining block 1`)

// Adding new transaction
const depositAmount = 0.0001
console.log(`paying ${depositAmount} coins to ${toAddress}`)
const tx1 = new Transaction(myWalletAddress, toAddress, depositAmount)
tx1.signTransaction(myKey)
virtualcoin.addTransaction(tx1)

console.log(`~~~~~~start mining block 2`)
virtualcoin.minePendingTransactions(myWalletAddress)
console.log(`~~~~~~end mining block 2`)

const myBalance = virtualcoin.getBalanceOfAddress(myWalletAddress)
console.log(`My Balance is:  ${myBalance}`)

const allMyTransactions = virtualcoin.getAllTransactionsFromWallet(myWalletAddress)
console.log(`My Transactions: \n${JSON.stringify(allMyTransactions, null, 4)}`)



// My Private key: 07b4070ba10517dfbae3f2523cb05af5717b1b3f7318772f6dbcd5693d2118ea
// My Public key: 0491ac65264281775acf672cc1a5ebf3ce4a894586cf256feef4d87ce7e80d3eb6c635474aac5a7b2eb28f34c3881672d8294fd98e54ac206ede303db2785d1ac5
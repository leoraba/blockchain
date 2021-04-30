const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const Transaction = require('./transaction')
const Block = require('./block')

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4
        this.pendingTransactions = []
        this.miningReward = 6.25
    }

    createGenesisBlock(){
        // first block
        return new Block(Date.parse("2020-04-29"), [], "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress){
        // adding new transaction to pay the miner
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTx)

        console.log(`mining block with ${this.pendingTransactions.length} pending transactions ${JSON.stringify(this.pendingTransactions)}`)
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        // mined block added to blockchain
        this.chain.push(block)

        // cleaing up pending transactions
        this.pendingTransactions = []
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from an to address')
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain')
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
            throw new Error('Not enough balance');
        }

        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }
                
                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    getAllTransactionsFromWallet(address){
        const txs = []

        for(const block of this.chain){
            for(const tx of block.transactions){
                if(tx.fromAddress === address || tx.toAddress) {
                    txs.push(tx)
                }
            }
        }

        return txs
    }

    isChainValid(){
        // validate Genesis block
        const realGenesis = JSON.stringify(this.createGenesisBlock());
        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(!currentBlock.hasValidTransactions()){
                return false
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }
}

module.exports = Blockchain
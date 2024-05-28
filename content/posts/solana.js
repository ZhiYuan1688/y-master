const { Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');

// Solana RPC节点
const rpcUrl = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(rpcUrl, 'confirmed');

// 发送方账户私钥
const senderPrivateKey = Buffer.from('YOUR_SENDER_PRIVATE_KEY', 'hex');
const senderAccount = new Account(senderPrivateKey);

// 接收方地址列表
const recipientAddresses = [
    'RECIPIENT_ADDRESS_1',
    'RECIPIENT_ADDRESS_2',
    'RECIPIENT_ADDRESS_3',
    'RECIPIENT_ADDRESS_4',
    'RECIPIENT_ADDRESS_5'
];

// 金额（单位为lamports）
const amount = 1000000000;  // 1 SOL = 1,000,000,000 lamports

// 构建交易
const transaction = new Transaction();
recipientAddresses.forEach(recipientAddress => {
    transaction.add(SystemProgram.transfer({
        fromPubkey: senderAccount.publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amount
    }));
});

// 签名并发送交易
(async () => {
    const blockhash = (await connection.getRecentBlockhash('max')).blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.sign(senderAccount);

    const txid = await sendAndConfirmTransaction(connection, transaction);
    console.log(`Multisend transaction sent with TxID: ${txid}`);
})();

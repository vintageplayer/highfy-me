const Web3 = require('web3');

//Infura HttpProvider Endpoint
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/"+process.env.INFURA_ID));

export default async function handler(req, res) {
	const payload = req.query;
	const tx_hash = payload.tx_hash;
	let tx = "";

	if (tx_hash == "" || tx_hash == null) res.status(400).json({ error: 'Tx Hash is empty' });
	console.log('checking tx for tx_hash: '+tx_hash);
	try{
		tx = await web3.eth.getTransaction(tx_hash);
		console.log(tx);
	} catch(err) {
		console.log(err);
		res.status(400).json({ error: 'Tx Hash is empty' });
	}

	res.status(200).json({transaction: tx});
}
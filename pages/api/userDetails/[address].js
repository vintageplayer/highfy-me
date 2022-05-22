import {executeGraphQuery} from '../../../utils/serverUtils'

// /api/userDetails/0x3ca39cc540b972ef0e84dc67e4894aa745153eb3#
// {
//     "data": {
//         "account": {
//             "accountAddress": "0x13782baa7ddf58ecf4a0fd9f38fd003f9955b217",
//             "keyCID": "bafybeibg4hlpyosc7iswtzch5kjhdxss3r526r6ywvlykt2osynxjgjp5e",
//             "credits": "6",
//             "mailsSent": [
//                 {
//                     "id": "bafybeifh5lfmlv7mfkwzmf5blqg73hvwbxww47hmzarnpr2mnh24rbk7ii",
//                     "dataCID": "bafybeifh5lfmlv7mfkwzmf5blqg73hvwbxww47hmzarnpr2mnh24rbk7ii",
//                     "from": {
//                         "accountAddress": "0x13782baa7ddf58ecf4a0fd9f38fd003f9955b217"
//                     },
//                     "to": {
//                         "accountAddress": "0xe95c4707ecf588dfd8ab3b253e00f45339ac3054"
//                     },
//                     "blockTime": "1653160824",
//                     "credits": "1",
//                     "creditStatus": "PENDING"
//                 }
//             ],
//             "inbox": [
//                 {
//                     "id": "bafybeicq47nzoqh7dnojoplrcujcek6arkzbkadyicddo4lep5oooezfam",
//                     "dataCID": "bafybeicq47nzoqh7dnojoplrcujcek6arkzbkadyicddo4lep5oooezfam",
//                     "from": {
//                         "accountAddress": "0x64e34c1072e4fd20371f6a018fdd5733af59ab50"
//                     },
//                     "to": {
//                         "accountAddress": "0x13782baa7ddf58ecf4a0fd9f38fd003f9955b217"
//                     },
//                     "blockTime": "1653164853",
//                     "credits": "0",
//                     "creditStatus": "INVALID",
//                     "receiverLabel": "SPAM"
//                 },
//                 {
//                     "id": "bafybeide37p5hxgtbsgis4xjqs4kw323jvdztavl4kr4me6wokdeo3mlyi",
//                     "dataCID": "bafybeide37p5hxgtbsgis4xjqs4kw323jvdztavl4kr4me6wokdeo3mlyi",
//                     "from": {
//                         "accountAddress": "0x8e76dadfb21eee01be3b34f02bee5dee7f439066"
//                     },
//                     "to": {
//                         "accountAddress": "0x13782baa7ddf58ecf4a0fd9f38fd003f9955b217"
//                     },
//                     "blockTime": "1653164883",
//                     "credits": "2",
//                     "creditStatus": "COLLECTED",
//                     "receiverLabel": "INBOX"
//                 }
//             ]
//         }
//     }
// }

export default async function userMailDetailsHandler({ query: { address } }, res) {
   const queryString = `{
        account (id: "${address}") {
          accountAddress
          keyCID
          credits
          mailsSent {
            id
            dataCID
            from {
              accountAddress
            }
            to {
              accountAddress
            }
            blockTime
            credits
            creditStatus
          }
          inbox {
            id
            dataCID
            from {
              accountAddress
            }
            to {
              accountAddress
            }
            blockTime
            credits
            creditStatus
            receiverLabel
          }
        }
      }`;
  const userDataRes = await executeGraphQuery(queryString);
  const userData = await userDataRes.json();

  // User with id exists
  if (userData) {
    res.status(200).json(userData)
  } else {
    res.status(404).json({ message: `Profile for address: ${address} not found.` })
  }
}
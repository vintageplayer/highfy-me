import {executeGraphQuery} from '../../../utils/serverUtils'

// /api/userDetails/0x3ca39cc540b972ef0e84dc67e4894aa745153eb3#
// {
//     "data": {
//         "account": {
//             "accountAddress": "0x3ca39cc540b972ef0e84dc67e4894aa745153eb3",
//             "keyCID": "bafybeibqupf6bmba6jsxntm3p4ku7m733r6yt7lpdrefek2izryygepap4",
//             "mailsSent": [
//                 {
//                     "id": "bafybeiarsn776vugrevtxqxqoi4cr7enuznmz4fgkazap7x2kuatfyr42m"
//                 }
//             ],
//             "inbox": [
//                 {
//                     "id": "bafybeiedulgsmdad2yb2um6v3si7qsqkfad252ydrwy4p4hcvonne4ue2q"
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
          mailsSent {
            id
          }
          inbox {
            id
          }
        }
      }`;
  console.log(queryString);
  const userDataRes = await executeGraphQuery(queryString);
  const userData = await userDataRes.json();

  // User with id exists
  if (userData) {
    res.status(200).json(userData)
  } else {
    res.status(404).json({ message: `Profile for address: ${address} not found.` })
  }
}
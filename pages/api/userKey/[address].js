import {executeGraphQuery} from '../../../utils/serverUtils'
// /api/userKey/0x3ca39cc540b972ef0e84dc67e4894aa745153eb3
// {
//     "data": {
//         "account": {
//             "accountAddress": "0x3ca39cc540b972ef0e84dc67e4894aa745153eb3",
//             "keyCID": "bafybeibqupf6bmba6jsxntm3p4ku7m733r6yt7lpdrefek2izryygepap4"
//         }
//     }
// }

export default async function userPublicKeyHandler({ query: { address } }, res) {
  const queryString = `{
        account (id: "${address}") {
          accountAddress
          keyCID
        }
      }`;
  console.log(queryString);
  const userKeyRes = await executeGraphQuery(queryString);
  const userKeyCID = await userKeyRes.json()

  // User with id exists
  if (userKeyCID) {
    res.status(200).json(userKeyCID)
  } else {
    res.status(404).json({ message: `Profile for address: ${address} not found.` })
  }
}
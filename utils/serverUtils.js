export const executeGraphQuery = async (queryString) => {
  return await fetch(`https://api.thegraph.com/subgraphs/name/lazycoder1/dev_email` ,{
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: queryString
    })
  })

}
const { readIn, writeOut } = require('./src/read-write.js')
const { exec } = require('child_process')

main()
exec('zip -r ./out/source.zip index.js package.json test src')

async function main () {
  await example()
}

async function example () {
  const file = await readIn('example.in')
  const [head, ...lines] = file.trim().split('\n')
  const [R, C, F, N, B, T] = head.split(' ')
  const data = lines.map(line => {
    const arr = line.split(' ')
    return {
      rideFrom: arr.slice(0, 2),
      rideTo: arr.slice(2, 4),
      earliestStart: arr[4],
      latestFinish: arr[5]
    }
  })
  console.log(data)
}

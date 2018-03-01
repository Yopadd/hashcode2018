const { readIn, writeOut } = require('./src/read-write.js')
const { exec } = require('child_process')

main()
exec('zip -r ./out/source.zip index.js package.json test src')

async function main () {
  const file = await readIn('example.in')
  await writeOut('example.out', file)
}

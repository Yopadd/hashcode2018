const fs = require('fs')
const { resolve: resolvePath } = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function readIn (fileName) {
  const buff = await readFile(resolvePath(__dirname, '../in', fileName))
  return buff.toString()
}

function writeOut (fileName, data) {
  return writeFile(resolvePath(__dirname, '../out', fileName), data)
}

module.exports = {
  readIn,
  writeOut
}

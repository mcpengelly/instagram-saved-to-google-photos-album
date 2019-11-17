const fs = require('fs-extra')

async function clearDirectory(dirPath) {
  await fs.emptyDir(dirPath)
}

module.exports = {
  clearDirectory
}

const powerShellPutty = require('./lib/powerShellPutty.js');
//Main App
const platform = process.platform; //?
const args = process.argv;
const uName = args[2];
const uPassword =  args[3];
if (!uName || !uPassword) return console.log("Missing arugment: userName and userPassord required")
const winSputty = new powerShellPutty(uName,uPassword)
return winSputty.sPutty() //?
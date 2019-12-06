const spawn = require("child_process").spawn;
const {isIpV4Address} = require("nodeutilz");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


module.exports = class {
    constructor (uName,uPassword){
        this.uName = uName;
        this.uPassword = uPassword;
    }
    
    sPutty () {
        const askForIp = (stdinWrite) => {
            
            rl.question("\n\n\n Putty Connection =>>> ", function(name) {
                if (isIpV4Address([name])) {
                    stdinWrite.stdin.write(`\r\n sPutty ${name} \r\n`)
                    askForIp(stdinWrite)
                } else {
                    askForIp(stdinWrite)
                }

            });
        };
        const putty = `
        function global:sPutty {
                param($ipAddress)
                putty ${this.uName}@$ipAddress -pw '${ this.uPassword}'
                Write-Host "Atteping SSH Putty Connection: -- $ipAddress"
            }
        `;
        //console.log(putty)
        //const child = spawn('cmd.exe',['/c', `powershell.exe ${putty}`],{detached: true});
        //const child = spawn('powershell',[],{shell:true,detached: true})
        const child = spawn('powershell',[],{})
        child.stdin.write(putty)
        askForIp(child)
        // child.stdin.write("\n sPutty 10.16.31.230 \n")
        // child.stdin.write("\n sPutty 10.16.31.230 \n")
        child.stdout.on("data",function(data){
            
            console.log("Powershell Data: " + data);
        });
        child.stderr.on("data",function(data){
            console.log("Powershell Errors: " + data);
        });
        child.on("exit",function(){
            console.log("Powershell Script finished");
        });

    }

}
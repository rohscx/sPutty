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
        const history = new Set;
        const askForIp = (stdinWrite) => {
            
            rl.question("\n\n\n Putty Connection =>>> ", function(data) {
                    const trimedData = data.trim();
                if (isIpV4Address([trimedData])) {
                    stdinWrite.stdin.write(`\r\n sPutty ${trimedData} \r\n`);
                    history.add(trimedData);
                    return setTimeout(() => askForIp(stdinWrite), 2000);
                } else if (trimedData.toLowerCase() === 'history') {
                    stdinWrite.stdin.write(JSON.stringify(Array.from(history)));
                    return setTimeout(() => askForIp(stdinWrite), 2000);
                } else if (trimedData.toLowerCase() === 'exit') {
                    return stdinWrite.stdin.end();
                } else {
                    return askForIp(stdinWrite);
                }

            });
        };
        const putty = (uName,uPassword) => {
            const specialCharacters0 = new RegExp (/[$]/);
            if(uPassword.search(specialCharacters0) === 0) {
                return `
                function global:sPutty {
                        param($ipAddress)
                        putty ${uName}@$ipAddress -pw '${uPassword}'
                        Write-Host "Atteping SSH Putty Connection: -- $ipAddress"
                    }
                `;
            } else {
                return `
                function global:sPutty {
                        param($ipAddress)
                        putty ${uName}@$ipAddress -pw "${uPassword}"
                        Write-Host "Atteping SSH Putty Connection: -- $ipAddress"
                    }
                `
            }
        };
        //console.log(putty)
        //const child = spawn('cmd.exe',['/c', `powershell.exe ${putty}`],{detached: true});
        //const child = spawn('powershell',[],{shell:true,detached: true})
        const child = spawn('powershell',[],{})
        child.stdin.write(putty(this.uName,this.uPassword))
        setTimeout(()=> askForIp(child),3000); 
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
            return process.exit(22);
        });

    }

}
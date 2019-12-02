const spawn = require("child_process").spawn;


module.exports = class {
    constructor (uName,uPassword){
        this.uName = uName;
        this.uPassword = uPassword;
    }
    
    sPutty () {
        const putty = `
        function sPutty {
                param($ipAddress)
                putty ${this.uName}@$ipAddress -pw '${ this.uPassword}'
                Write-Host "I did something -- $ipAddress"
            }
        `;
        console.log(putty)
        //const child = spawn('cmd.exe',['/c', `powershell.exe ${putty}`],{detached: true});
        const child = spawn('powershell.exe',[putty],{detached: true})
        child.stdout.on("data",function(data){
            console.log("Powershell Data: " + data);
        });
        child.stderr.on("data",function(data){
            console.log("Powershell Errors: " + data);
        });
        child.on("exit",function(){
            console.log("Powershell Script finished");
        });
        return child.stdin.end(); //end input
    }

}
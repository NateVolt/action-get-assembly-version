const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')

try
{
    let filepath = core.getInput('file-path');
    let fileText = readTextFile(filepath);
    let versionString = getVersion(fileText);
    core.setOutput("version", versionString);
} 
catch (error)
{
    core.setFailed(error.message);
}

function readTextFile(file)
{
    try
    {
        console.log('trying to read in file ${file}')
        const data = fs.readFileSync(file, 'utf8');
        return data;
    } 
    catch (error)
    {
        console.log('failed to read in file ${file}');
        throw(error);
    }
}

function getVersion(fileText)
{
    try
    {
        let versionLineRegex = '(assembly: AssemblyVersion)';
        let getVersionStringRegex = '(?<=")[^"]+(?=")';
        let commentRegex = '\/{2}';
        let lines = fileText.toString().split('\r\n');
        
        for(line in lines)
        {
            let m;
            if ((m = commentRegex.exec(line)) !== null) 
            {
                // this is a comment line in the file. We should do nothing.
            }
            else if ((m = versionLineRegex.exec(line)) !== null)
            {
                return getVersionStringRegex.exec(line);
            }
            else
            {
                // this is not a line we care about.
            }
        }
    }
    catch (error)
    {
        console.log('failed to read version string');
        throw(error);
    }
}
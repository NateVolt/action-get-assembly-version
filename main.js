const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')

try
{
    let filepath = core.getInput('file-path');
    let fileText = readTextFile(filepath);
    let versionString = getVersion(fileText);
    ensureVersionIsValid(versionString);
    core.setOutput("version", versionString);
} 
catch (error)
{
    core.setFailed(error);
}

function readTextFile(file)
{
    try
    {
        console.log(`trying to read in file ${file}`);
        const data = fs.readFileSync(file, 'utf8');
        console.log(data);
        return data;
    } 
    catch (error)
    {
        console.log(`failed to read in file ${file}`);
        throw(error);
    }
}

function getVersion(fileText)
{
    try
    {
        let versionLineRegex = /(assembly: AssemblyVersion)/;
        let getVersionStringRegex = /(?<=")[^"]+(?=")/;
        let commentRegex = /\/{2}/;
        let lines = fileText.split(/\r?\n/);
        console.log('printing lines');
        console.log(lines);
        
        for(var i = 0; i < lines.length; i++)
        {
            let line = lines[i];
            let m;
            if ((m = commentRegex.exec(line)) !== null) 
            {
                // this is a comment line in the file. We should do nothing.
                console.log(`'${line}' is a comment line`);
            }
            else if ((m = versionLineRegex.exec(line)) !== null)
            {
                let versionString = getVersionStringRegex.exec(line).toString();
                console.log(`Found a version string '${versionString}' on line '${line}'`);
                return versionString;
            }
            else
            {
                // this is not a line we care about.
                console.log(`'${line}' is not a comment or a line we care about`);
            }
        }
    }
    catch (error)
    {
        console.log('failed to read version string');
        throw(error);
    }
}

function ensureVersionIsValid(versionNumber) {
    try
    {
        let splitVer = versionNumber.split('.');
        if (splitVer.length != 4)
        {
            throw `Version '${versionNumber}' should have 4 entries, but ${splitVer.length} were found.`;
        }
        for (var i = 0; i  < 4; i++)
        {
            if (isNaN(splitVer[i]))
            {
                throw `Version '${versionNumber}' index ${i} is not valid.`;
            }
        }
        var numOfSeperators = (versionNumber.match(/\./g) || []).length;
        if (numOfSeperators != 3)
        {
            throw `Version '${versionNumber}' has too many '.' seperators.`;
        }
    }
    catch (error)
    {
        console.log(error);
        throw(error);
    }
}
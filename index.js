const fs = require('fs/promises');

async function checkFileExists(file) {
  try {
    await fs.access(file, fs.constants.F_OK)
  } catch (error) {
    return false
  }
  return true;
}

async function checkIsValidJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}


const { argv } = process;
const relativeFilePath = argv[2];

async function checkIsValidArgsFile() {
  try {
    // Check argv length exceed 3
    if (argv.length > 3) {
      throw new Error('You have provided too many arguments just provide the file');
    }

    // Check they have provided an arguement
    if (!relativeFilePath) {
      throw new Error('You have not provided the json file you want to convert as an argument');
    }

    // Check the provided file is a json
    if (!relativeFilePath.endsWith('.json')) {
      throw new Error('Provided file is not a json file');
    }

    // Check if the provided file exists
    const doesJSONExist = await checkFileExists(relativeFilePath);
    if (!doesJSONExist) {
      throw new Error('Provided file does not exist');
    }

    // Check if json file is valid
    const jsonFile = await fs.readFile(relativeFilePath, 'utf-8');
    const isValidJson = await checkIsValidJson(jsonFile);
    if (!isValidJson) {
      throw new Error('Provided json file is invalid formatting');
    }

    return jsonFile;
  } catch (error) {
    console.error('ERROR - validateJSON():', error);
    throw error;
  }
}

async function init() {
  try {
    console.log('Checking if valid JSON');
    const jsonStr = await checkIsValidArgsFile();
    console.log('Validated json file');
    const jsonB64 = Buffer.from(jsonStr).toString('base64');
    await fs.writeFile(`./base64`, jsonB64)
    console.log('Converted to base64 check ./base64 file');
  } catch (e) {
    console.error('ERROR - init():', e);
    process.exit(1);
  }
};

init();

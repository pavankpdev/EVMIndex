import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import server from './server';
import EVMIndex from 'evmindex';
import {join} from "path";

// **** Run **** //

EVMIndex.init({
    mongoUri: 'mongodb://localhost:27017/evmindex',
    configFilePath: join(__dirname, '../config.yaml'),
    providerUrl: 'https://polygon-mumbai.g.alchemy.com/v2/e5X5TCL-0GBdm_iP9LnsNskTgeAHPHrS',
    ABIPath: `${__dirname}/abis`,
    handlerPath: `${__dirname}/handlers`
})

const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));

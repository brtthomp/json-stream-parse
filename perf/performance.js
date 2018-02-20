/* eslint-disable */

const Parser = require('../lib/index.js'),
    Parser2 = require('json-stream-parser'),
    now = require('performance-now');

const parser = new Parser(),
    parser2 = new Parser2(),
    noop = () => {};

const string1 = "[]",
    string2 = '{"test":"test"}',
    string3 = '{"type":"PUBLISH","subscriptionID":45,"element":"sampleData","status":"OK","value":[{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1427}]}',
    string4 = '{"type":"PUBLISH","subscriptionID":45,"element":"sampleData","status":"OK","value":[{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1427},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1428},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1429},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1430},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1431},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1432},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1433},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1434},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1435},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1436},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1437},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1438},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1439},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1440},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1441},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1442},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1443},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1444},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1445},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1446},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1447},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1448},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1449},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1450},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1451},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1452},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1453},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1454},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1455},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1456}]}',
    string5 = '{"type":"PUBLISH","subscriptionID":45,"element":"sampleData","status":"OK","value":[{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1427},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1428},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1429},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1430},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1431},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1432},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1433},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1434},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1435},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1436},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1437},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1438},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1439},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1440},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1441},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1442},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1443},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1444},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1445},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1446},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1447},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1448},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1449},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1450},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1451},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1452},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1453},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1454},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1455},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1456}]}{"type":"PUBLISH","subscriptionID":45,"element":"sampleData","status":"OK","value":[{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1427},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1428},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1429},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1430},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1431},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1432},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1433},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1434},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1435},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1436},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1437},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1438},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1439},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1440},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1441},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1442},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1443},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1444},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1445},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1446},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1447},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1448},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1449},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1450},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1451},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1452},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1453},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1454},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1455},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1456}]}',
    string6a = '{"type":"PUBLISH","subscriptionID":45,"element":"sampleData","status":"OK","value":[{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1427},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1428},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1429},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1430},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1431},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1432},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1433},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1434},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1435},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1436},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1437},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1438},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1439},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1440},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1441},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1442},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1443},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1444},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1445},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1446},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1447},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1448},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1449},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1450},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1451},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1452},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1453},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1454},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePressure_KP',
    string6b = 'a":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1455},{"Flow_sLPM":145.678,"Temperature_C":22.1294,"Humidity_Pct":42.9,"AbsolutePre'
    string6c = 'ssure_KPa":103.782,"LowPressure_cmH2O":4.8932,"Oxygen_Pct":21.3,"PktNum":1456}]}',
    string6Full = string6a + string6b + string6c;
    //string7 = JSON.stringify(require("../old/perf/CPC-900.json"));

const buf1 = Buffer.from(string1, 'utf8'),
    buf2 = Buffer.from(string2, 'utf8'),
    buf3 = Buffer.from(string3, 'utf8'),
    buf4 = Buffer.from(string4, 'utf8'),
    buf5 = Buffer.from(string5, 'utf8'),
    buf6a = Buffer.from(string6a, 'utf8'),
    buf6b = Buffer.from(string6b, 'utf8'),
    buf6c = Buffer.from(string6c, 'utf8');
    //buf7 = Buffer.from(string7, 'utf8');

const obj1 = JSON.parse(string1),
    obj2 = JSON.parse(string2),
    obj3 = JSON.parse(string3),
    obj4 = JSON.parse(string4),
    obj6 = JSON.parse(string6a + string6b + string6c);
    //obj7 = JSON.parse(string7);

const SOH = 0x01,
    EOT = 0x04;

const BEGIN_MARKER = String.fromCharCode(SOH),
    END_MARKER = String.fromCharCode(EOT);

const MAX = 10000;

let begin, end, avg = 0;

let overhead = 0;
// Get average time for getting time difference
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    end = now();
    overhead += end-begin;
}
overhead = overhead/MAX;
console.log(`Overhead is ${overhead}`);

let obj = [];
parser.on('json', (json) => {
    obj.push(json);
});

// //////// //
// STRING 1 //
// //////// //

console.log("Test on string 1");
console.log(`\tString: ${string1.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(string1)
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf1, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string1) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf1, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string1) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf1, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string1) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const buf = Buffer.concat([Buffer.from([SOH]), buf1, Buffer.from([EOT])]);
    parser.algorithm = 3;
    begin = now();
    parser._write(buf, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string1) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string1;
    begin = now();
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// /////////// //
// End String1 //
// /////////// //

// //////// //
// String 2 //
// //////// //

console.log("Test on string 2");
console.log(`\tString: ${string2.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(string2)
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf2, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string2) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf2, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string2) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf2, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string2) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const buf = Buffer.concat([Buffer.from([SOH]), buf2, Buffer.from([EOT])]);
    parser.algorithm = 3;
    begin = now();
    parser._write(buf, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string2) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string2;
    begin = now();
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 2 //
// //////////// //

// //////// //
// String 3 //
// //////// //

console.log("Test on string 3");
console.log(`\tString: ${string3.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(string3)
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf3, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string3) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf3, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string3) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf3, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string3) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const buf = Buffer.concat([Buffer.from([SOH]), buf3, Buffer.from([EOT])]);
    parser.algorithm = 3;
    begin = now();
    parser._write(buf, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string3) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string3;
    begin = now();
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 3 //
// //////////// //

// //////// //
// String 4 //
// //////// //

console.log("Test on string 4");
console.log(`\tString: ${string4.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(string4)
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf4, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf4, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf4, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const buf = Buffer.concat([Buffer.from([SOH]), buf4, Buffer.from([EOT])]);
    parser.algorithm = 3;
    begin = now();
    parser._write(buf, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string4;
    begin = now();
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 4 //
// //////////// //

// //////// //
// String 5 //
// //////// //

console.log("Test on string 5");
console.log(`\tString: ${string5.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(string4);//5.substr(0, string4.length));
    JSON.parse(string4);//5.substr(string4.length));
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf5, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4 || JSON.stringify(obj[1]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf5, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4 || JSON.stringify(obj[1]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf5, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4 || JSON.stringify(obj[1]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const buf = Buffer.concat([
        Buffer.from([SOH]),
        buf4,
        Buffer.from([EOT]),
        Buffer.from([SOH]),
        buf4,
        Buffer.from([EOT])
    ]);
    parser.algorithm = 3;
    begin = now();
    parser._write(buf, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string4 || JSON.stringify(obj[1]) !== string4) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string5;
    begin = now();
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 5 //
// //////////// //

// //////// //
// String 6 //
// //////// //

console.log("Test on string 6a/b/c");
console.log(`\tString: ${string6a.length}/${string6b.length}/${string6c.length} characters\n`);

console.log("\tJSON.parse:");
for(let i = 0; i < MAX; i += 1) {
    begin = now();
    JSON.parse(`${string6a}${string6b}${string6c}`);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 1;
    begin = now();
    parser._write(buf6a, null, noop);
    parser._write(buf6b, null, noop);
    parser._write(buf6c, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string6Full) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 1a");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 0;
    begin = now();
    parser._write(buf6a, null, noop);
    parser._write(buf6b, null, noop);
    parser._write(buf6c, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string6Full) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 2");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    parser.algorithm = 2;
    begin = now();
    parser._write(buf6a, null, noop);
    parser._write(buf6b, null, noop);
    parser._write(buf6c, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string6Full) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tAlgorithm 3");
for(let i = 0; i < MAX; i += 1) {
    obj = [];
    const bufs = Buffer.concat([Buffer.from([SOH]), buf6a]);
    const bufe = Buffer.concat([buf6c, Buffer.from([EOT])]);
    parser.algorithm = 3;
    begin = now();
    parser._write(bufs, null, noop);
    parser._write(buf6b, null, noop);
    parser._write(bufe, null, noop);
    end = now();
    if(JSON.stringify(obj[0]) !== string6Full) console.error("NO OBJECT!");
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

console.log("\tTSI-Inc/json-stream-parser");
for(let i = 0; i < MAX; i += 1) {
    parser2._buffer = string6a;
    begin = now();
    parser2._process(noop);
    parser2._buffer += string6b;
    parser2._process(noop);
    parser2._buffer += string6c;
    parser2._process(noop);
    end = now();
    avg += end - begin;
}
avg = avg/MAX;
console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 6 //
// //////////// //

// //////// //
// String 7 //
// //////// //

// console.log("Test on string 7");
// console.log(`\tString: ${string7.length} characters\n`);

// console.log("\tJSON.parse:");
// for(let i = 0; i < MAX; i += 1) {
//     begin = now();
//     JSON.parse(string7);
//     end = now();
//     avg += end - begin;
// }
// avg = avg/MAX;
// console.log(`\t\t${avg.toFixed(3)}ms`);

// console.log("\tAlgorithm 1");
// for(let i = 0; i < MAX; i += 1) {
//     obj = [];
//     parser.algorithm = 1;
//     begin = now();
//     parser._write(buf7, null, noop);
//     end = now();
//     if(JSON.stringify(obj[0]) !== string7) console.error("NO OBJECT!");
//     avg += end - begin;
// }
// avg = avg/MAX;
// console.log(`\t\t${avg.toFixed(3)}ms`);

// console.log("\tAlgorithm 2");
// for(let i = 0; i < MAX; i += 1) {
//     obj = [];
//     parser.algorithm = 2;
//     begin = now();
//     parser._write(buf7, null, noop);
//     end = now();
//     if(JSON.stringify(obj[0]) !== string7) console.error("NO OBJECT!");
//     avg += end - begin;
// }
// avg = avg/MAX;
// console.log(`\t\t${avg.toFixed(3)}ms`);

// console.log("\tAlgorithm 3");
// for(let i = 0; i < MAX; i += 1) {
//     obj = [];
//     const buf = Buffer.concat([Buffer.from([SOH]), buf7, Buffer.from([EOT])]);
//     parser.algorithm = 3;
//     begin = now();
//     parser._write(buf, null, noop);
//     end = now();
//     if(JSON.stringify(obj[0]) !== string7) console.error("NO OBJECT!");
//     avg += end - begin;
// }
// avg = avg/MAX;
// console.log(`\t\t${avg.toFixed(3)}ms`);

// console.log("\tTSI-Inc/json-stream-parser");
// for(let i = 0; i < MAX; i += 1) {
//     parser2._buffer = string7;
//     begin = now();
//     parser2._process(noop);
//     end = now();
//     avg += end - begin;
// }
// avg = avg/MAX;
// console.log(`\t\t${avg.toFixed(3)}ms`);

// //////////// //
// End String 7 //
// //////////// //
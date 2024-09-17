import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
const dependencyPart = String.raw `(?<dependencyPart>.*)`;
const ofDependencyPart = String.raw `of ${dependencyPart}`;
const ofDependencies = String.raw `^${ofDependencyPart}`;
const setLocalPropToSet = String.raw `^(.*)(s|S)et (?<localPropToSet>.*)`;
const onlyOfAndIf = String.raw `^(o|O)nly of (?<dependencyPart>(\@|\#|\|)[\w\:]+) and (?<mappings>.*)`;
const andSetFrom = String.raw `${setLocalPropToSet} from (?<dependencyPart>.*)`;
const andSetFromUnionOfDependencyPart = String.raw `${setLocalPropToSet} to the union ${ofDependencyPart}`;
const andSetFromSumOfDependencyPart = String.raw `${setLocalPropToSet} to the sum of ${ofDependencyPart}`;
const andSetFromProductOfDependencyPart = String.raw `${setLocalPropToSet} to the sum of ${ofDependencyPart}`;
const andSetFromObjectAssignmentOfDependencyParty = String.raw `${setLocalPropToSet} to an object structure by assigning ${dependencyPart}`;
const dssKeys = [['dependencyPart', 'remoteSpecifiers[]']];
export const emc = {
    base: 'be-observant',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                parsedStatements: [
                    {
                        regExp: andSetFromUnionOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Union'
                        },
                        dssKeys,
                    },
                    {
                        regExp: andSetFromSumOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Sum'
                        },
                        dssKeys,
                    },
                    {
                        regExp: andSetFromProductOfDependencyPart,
                        defaultVals: {
                            aggregateRemoteVals: 'Product'
                        },
                        dssKeys,
                    },
                    {
                        regExp: andSetFromObjectAssignmentOfDependencyParty,
                        defaultVals: {
                            aggregateRemoteVals: 'ObjectAssign'
                        },
                        dssKeys,
                    },
                    {
                        regExp: andSetFrom,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        },
                        dssKeys,
                    },
                    {
                        regExp: ofDependencies,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        },
                        dssKeys
                    },
                    {
                        regExp: onlyOfAndIf,
                        defaultVals: {
                            aggregateRemoteVals: 'Conjunction'
                        },
                        dssKeys,
                        //remoteSpecifiers: [],
                        statementPartParser: {
                            splitWord: 'and',
                            propMap: {
                                mappings: [
                                    {
                                        regExp: String.raw `^if (?<ifCondition>.*) pass (?<passValue>.*)`,
                                        defaultVals: {},
                                    },
                                    {
                                        regExp: String.raw `^otherwise pass (?<passValue>.*)`,
                                        defaultVals: {},
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
        }
    },
    enhPropKey: 'beObservant',
    importEnh: async () => {
        const { BeObservant } = await import('./be-observant.js');
        return BeObservant;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

import { AP, PAP } from './types';

export function prsOf(self: AP) : PAP {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    return {

    }
}
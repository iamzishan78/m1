import { hookstate, useHookstate } from '@hookstate/core';

export const hookStateApp = hookstate({ layers: [], universalLoader: false });

export const useHookStateApp = () => useHookstate(hookStateApp)


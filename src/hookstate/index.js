import { hookstate, useHookstate } from '@hookstate/core';

export const layerRefs = hookstate({});
export const useLayerRefs = () => useHookstate(layerRefs);

export const hookStateApp = hookstate({ layers: [], universalLoader: false });

export const useHookStateApp = () => useHookstate(hookStateApp)

export const resetESTableToggle = hookstate(false);

export const useResetESTableToggle = () => useHookstate(resetESTableToggle)

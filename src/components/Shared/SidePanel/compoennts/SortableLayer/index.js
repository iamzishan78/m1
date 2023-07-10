import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import FileTree from "./FileTree";
import { ContextProvider } from "react-sortly";
import { useHookstate } from '@hookstate/core';
import { hookStateApp } from "hookstate";
import { GET_LAYER_GROUPS } from "graphQL/useQueryLayerGroup";
import { useLazyQuery } from "@apollo/client";
import { Box, CircularProgress } from "@material-ui/core";

const getEmptyGroupAndLayer = (group, type) => {
  if (type === 'layer')
    return {
      emptyLayer: true,
      collapsed: true,
      groupName: group.name,
      groupId: group.groupId,
      visiable: true,
      showable: true,
      name: "",
      depth: 1,
      type: "layer",
      id: group.groupId + 'layer',
    }

  if (type === 'group')
    return {
      depth: 0,
      type: "group",
      collapsed: true,
      showable: true,
      visiable: true,
      name: group.name,
      id: group.groupId,
    }
}

const dnd = isMobile ? TouchBackend : HTML5Backend;
const SortableLayer = ({ mongoId, search }) => {
  const [layerMap, setLayerMap] = useState([])
  const [panelItems, setPanelItems] = useState([])
  const hookState = useHookstate(hookStateApp);
  const [getLayerGroups, { data: layerGroupData }] = useLazyQuery(GET_LAYER_GROUPS);

  useEffect(() => {
    getLayerGroups({ variables: { userId: mongoId } })
  }, [getLayerGroups])

  useEffect(() => {
    if (layerGroupData?.getLayerGroups) {
      const hookStateAppLayers = hookState.layers.get({ noproxy: true })
      const layerGroups = layerGroupData?.getLayerGroups
      const groupHandled = [];
      const layerAndGroups = [];
      hookStateAppLayers &&
        hookStateAppLayers.forEach((item) => {
          if (item.layerSettings) {
            if (item.groupId && !groupHandled.includes(item.groupId)) {
              groupHandled.push(item.groupId);
              const groups = hookStateAppLayers.filter((i) => i.groupId === item.groupId);
              const visiable = !!groups.find((i) => i.layerSettings.visiable);
              const showable = !!groups.find((i) => i.layerSettings.showable);
              layerAndGroups.push({
                depth: 0,
                type: "group",
                collapsed: true,
                showable,
                visiable,
                name: item.groupName,
                id: item.groupId,
              });
              groups.forEach((item) => {
                layerAndGroups.push({
                  ...item,
                  collapsed: true,
                  name: item.layerName,
                  showable: item.layerSettings.showable,
                  visiable: item.layerSettings.visiable,
                  depth: 1,
                  type: "layer",
                  id: item._id,
                });
              });
            }
            if (!item.groupId) {
              const showable = item.layerSettings.showable && item.identifier !== "Tracked Owners" && item.identifier !== "Agreement";
              layerAndGroups.push({
                ...item,
                visiable: item.layerSettings.visiable,
                showable,
                layerSettings: { ...item.layerSettings, showable },
                name: item.layerName === "Parcels" ? "Tracts" : item.layerName,
                depth: 0,
                type: "layer",
                id: item._id,
              });
            }
          }
        });

      if (layerAndGroups.length > 0) {
        const emptyGroups = layerGroups.filter((layerGroup) => !groupHandled.includes(layerGroup.groupId))
        emptyGroups.forEach((emptyGroup) => {
          if (!emptyGroup.above) {
            layerAndGroups.unshift(getEmptyGroupAndLayer(emptyGroup, 'layer'));
            layerAndGroups.unshift(getEmptyGroupAndLayer(emptyGroup, 'group'));
            return
          }
          if (!emptyGroup.below) {
            layerAndGroups.push(getEmptyGroupAndLayer(emptyGroup, 'group'));
            layerAndGroups.push(getEmptyGroupAndLayer(emptyGroup, 'layer'));
            return
          }

          const index = layerAndGroups.findIndex((layerAndGroup) => layerAndGroup.id === emptyGroup.above)
          if (index && layerAndGroups[index]?.type === 'layer') {
            layerAndGroups.splice(index + 1, 0, getEmptyGroupAndLayer(emptyGroup, 'group'));
            layerAndGroups.splice(index + 2, 0, getEmptyGroupAndLayer(emptyGroup, 'layer'));
            return
          }
          if (index && layerAndGroups[index]?.type === 'group') {
            layerAndGroups.splice(index + 2, 0, getEmptyGroupAndLayer(emptyGroup, 'group'));
            layerAndGroups.splice(index + 3, 0, getEmptyGroupAndLayer(emptyGroup, 'layer'));
            return
          }
        })
      }

      setPanelItems(layerAndGroups)
    }
  }, [hookState.layers, layerGroupData?.getLayerGroups])

  useEffect(() => {
    if (search)
      setLayerMap(panelItems.filter((i) => (i.layerName ?? i.name).toLowerCase().includes(search.toLowerCase())))
    else {
      setLayerMap(panelItems)
    }
  }, [panelItems, search])

  return (
    <>
      {
        (layerMap && layerMap[0]?.type ? (
          <DndProvider backend={dnd}>
            <ContextProvider>
              {layerMap.length > 0 && <FileTree layerMap={layerMap} panelItems={panelItems} />}
            </ContextProvider>
          </DndProvider>
        ) : (
          <Box height="calc(100vh - 50px - 122px)" bgcolor="#0e111a" display="flex" justifyContent="center">
            <CircularProgress style={{ top: "50%", position: "absolute" }} size={40} color="secondary" />
          </Box>
        )
        )
      }
    </>
  )
}

export default SortableLayer;

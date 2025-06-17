# Layer Management System Documentation

## Overview
The layer management system is a core component of our mapping application that handles different types of map layers (Wells, Data Layers, Heatmaps, etc.) and their visualization properties. This document explains the key components and how they work together.

## State Management

The layer system is managed through the `LayerStateController` class, which is responsible for:

1. **Layer State Management**
   - Maintaining the current state of all layers
   - Handling layer visibility and interactions
   - Managing layer updates and modifications

2. **Layer Operations**
   - Adding and removing layers
   - Updating layer properties
   - Handling layer interactions
   - Managing layer boundaries and zoom levels

3. **Layer Synchronization**
   - Coordinating between different layer types
   - Managing layer dependencies
   - Handling layer updates across the application

### LayerStateController Key Methods

```javascript
class LayerStateControllerHandler extends StateController {
    // Get layer metadata configuration
    getLayerMeta(dbLayer) { ... }

    // Get currently visible layers
    getShowableLayers() { ... }

    // Handle layer bounds and visibility
    handleBounds(layerId, defaultZoom, visible, layerBBox, polygonFilter) { ... }

    // Update layer properties
    updateLayer(layer, updatedState) { ... }

    // Remove layer from map
    removeLayer(layer, recalculate = false) { ... }

    // Handle mapbox specific layers
    handleMapBoxLayer(dbLayer) { ... }

    // Handle deck.gl specific layers
    handleDeckLayer(dbLayer, isUpdateTrigger) { ... }
}
```

### State Management Flow

1. **Layer Initialization**
   - Layer configuration is loaded from `LayerMeta`
   - Layer state is initialized in the controller
   - Layer is added to the map with appropriate properties

2. **Layer Updates**
   - State changes trigger layer updates
   - Layer properties are synchronized
   - Map is updated with new layer state

3. **Layer Cleanup**
   - Layers are properly removed
   - Resources are cleaned up
   - State is reset appropriately

### Integration with Other Components

1. **Map Controls**
   - Layer visibility toggles
   - Layer ordering
   - Layer style controls

2. **Data Management**
   - Layer data updates
   - Data filtering
   - Data synchronization

3. **User Interactions**
   - Layer selection
   - Layer interaction handling
   - Popup management

## LayerMeta Configuration

`LayerMeta` is a configuration object that defines the properties and behavior for different types of map layers. Each layer type has its own configuration that specifies:

- Default zoom levels
- Geographic field locations
- Filtering capabilities
- Visualization properties
- Layer-specific behaviors

### Common Layer Types

1. **Wells Layer**
   - Default zoom: 11
   - Uses GeoJSON for geometry
   - Supports filtering
   - Custom color handling through `getWellColor`
   - Optimized point and line rendering

2. **Data Layer**
   - Default zoom: 9
   - Uses `shapeJson.geometry` for geographic data
   - Supports text labels
   - Filterable
   - Standard point rendering

3. **Dynamic Data Layer**
   - Default zoom: 10
   - Uses `assetShape.shapeJson.geometry`
   - Supports text labels
   - Filterable
   - Real-time data updates

4. **File Layer**
   - Default zoom: 10
   - Uses `geometry` field
   - Supports filtering
   - File-based data source
   - Custom feature filtering

5. **Specialized Layers**
   - Hexagon Layer: For hexagonal grid visualization
   - Heatmap Layer: For density visualization
   - Grid Layer: For grid-based data visualization
   - Platform Parcels: For parcel visualization with custom styling

## getLayerMeta Function

The `getLayerMeta` function is a crucial part of the layer management system that determines the appropriate configuration for a given layer.

### Function Purpose
```javascript
getLayerMeta(dbLayer) {
    // Returns the appropriate layer configuration based on the layer's properties
}
```

### Key Features

1. **Layer Type Resolution**
   - Determines the base configuration using either the layer's identifier or type
   - Handles special cases for different layer types

2. **PlatformWells Special Handling**
   - Special logic for "PlatformWells - Point" layers
   - Different handling for aggregation vs. non-aggregation layers
   - Custom point data visualization for non-point layer types

3. **Configuration Inheritance**
   - Can combine properties from multiple layer types
   - Supports overriding specific properties while maintaining base configuration

### Usage Example
```javascript
const layerConfig = getLayerMeta({
    identifier: "PlatformWells - Point",
    layerType: "polygon"
});
```

## PlatformWells Implementation Details

### Special Handling in getLayerMeta

The `getLayerMeta` function includes special handling for PlatformWells layers, particularly for "PlatformWells - Point" layers. This special handling is required due to the complex nature of well data visualization and the need to support different layer types within the same well data.

### Implementation Details

```javascript
// Special handling for PlatformWells - Point layers
if (dbLayer?.identifier.startsWith('PlatformWells - Point')) {
    // Handle non-aggregation layers
    if (!aggregationLayers.includes(dbLayer?.layerType)) {
        // Special case for non-point layer types
        if (dbLayer?.layerType !== 'point') {
            // Create a hybrid metadata combining Wells base with specific layer type
            meta = copy(LayerMeta['Wells']);
            meta.layer = copy(LayerMeta[dbLayer?.layerType])?.layer;

            // Override getProps to handle point data visualization
            meta.layer.getProps = layerId => {
                return {
                    data: deckLayers[layerId].getData([]),
                    getPosition: d => d.geometry.geometries[0].coordinates,
                    parameters: {
                        depthTest: false,
                    },
                };
            };
            meta.propsFunc = LayerMeta[dbLayer?.layerType]?.propsFunc;
            meta.props = {};
            return meta;
        }
        return LayerMeta['Wells'];
    }
    // For aggregation layers
    meta.isFileDataSource = false;
    meta.geoField = 'geoJSON';
}
```

### Why Special Handling is Required

1. **Multiple Geometry Types**
   - PlatformWells can be represented in different geometries (points, polygons, lines)
   - Each geometry type requires different visualization properties
   - The special handling ensures proper rendering regardless of geometry type

2. **Data Structure Complexity**
   - Well data often contains complex nested geometries
   - The `getPosition` override ensures proper coordinate extraction
   - Handles the specific structure of well geometry data

3. **Aggregation vs. Non-Aggregation**
   - Different handling for aggregated and non-aggregated well data
   - Aggregated layers need different data source handling
   - Non-aggregated layers require specific visualization properties

### Layer Type Specifics

1. **Point Layers**
   - Use standard Wells metadata
   - Optimized for point visualization
   - Includes well-specific color handling

2. **Non-Point Layers**
   - Creates a hybrid configuration
   - Combines Wells base properties with layer-specific properties
   - Custom position handling for complex geometries

3. **Aggregated Layers**
   - Modified metadata properties
   - Different data source handling
   - Optimized for aggregated data visualization

### Example Use Cases

1. **Point Well Visualization**
```javascript
const pointWellLayer = {
    identifier: "PlatformWells - Point",
    layerType: "point"
};
// Returns standard Wells metadata
```

2. **Polygon Well Visualization**
```javascript
const polygonWellLayer = {
    identifier: "PlatformWells - Point",
    layerType: "polygon"
};
// Returns hybrid metadata with custom position handling
```

3. **Aggregated Well Data**
```javascript
const aggregatedWellLayer = {
    identifier: "PlatformWells - Point",
    layerType: "aggregated"
};
// Returns modified metadata for aggregated data
```

### Performance Considerations

1. **Data Processing**
   - Efficient geometry extraction
   - Optimized position calculation
   - Proper data structure handling

2. **Rendering Optimization**
   - Appropriate depth testing
   - Efficient coordinate handling
   - Optimized layer properties

3. **Memory Management**
   - Proper copying of metadata
   - Efficient property inheritance
   - Clean object structure

### Common Issues and Solutions

1. **Geometry Extraction Issues**
   - Problem: Incorrect coordinate extraction
   - Solution: Verify geometry structure and adjust getPosition function

2. **Rendering Problems**
   - Problem: Incorrect layer visualization
   - Solution: Check layer type and metadata combination

3. **Performance Issues**
   - Problem: Slow rendering with large datasets
   - Solution: Optimize data processing and rendering properties

## Layer Properties

Each layer configuration includes:

1. **Basic Properties**
   - `defaultZoom`: Initial zoom level
   - `geoField`: Location of geographic data
   - `isFilterable`: Whether the layer supports filtering

2. **Visualization Properties**
   - Point/line rendering settings
   - Color configurations
   - Opacity and pattern settings

3. **Interactive Properties**
   - Hover behaviors
   - Click handlers
   - Popup configurations

## Best Practices

1. **Adding New Layer Types**
   - Define all required properties in `LayerMeta`
   - Include proper documentation
   - Test with different data types

2. **Modifying Existing Layers**
   - Maintain backward compatibility
   - Update documentation
   - Test with existing data

3. **Performance Considerations**
   - Use appropriate zoom levels
   - Implement proper data filtering
   - Optimize rendering properties

## Common Use Cases

1. **Adding a New Well Layer**
```javascript
const wellLayer = {
    identifier: "New Wells",
    layerType: "point"
};
const config = getLayerMeta(wellLayer);
```

2. **Customizing Layer Properties**
```javascript
const customLayer = {
    ...baseConfig,
    layer: {
        ...baseConfig.layer,
        getProps: customPropsFunction
    }
};
```

## Troubleshooting

Common issues and solutions:

1. **Layer Not Displaying**
   - Check layer configuration
   - Verify data format
   - Confirm zoom levels

2. **Performance Issues**
   - Review data filtering
   - Check rendering properties
   - Verify zoom level settings

3. **Visualization Problems**
   - Check color configurations
   - Verify geometry data
   - Review layer properties

## Future Considerations

1. **Planned Improvements**
   - Enhanced layer type support
   - Better performance optimization
   - More flexible configuration options

2. **Known Limitations**
   - Current zoom level restrictions
   - Limited layer type combinations
   - Performance with large datasets

## Support

For additional support:
- Check the codebase documentation
- Review layer-specific examples
- Contact the development team 

export interface GraphStyle {
  nodeRadius: number;
  nodeGap: number;
  levelWidth: number;
  arrowLength: number;
  arrowOffset: number;
}

const DEFAULTS = {
  NODE_RADIUS: 15,
  NODE_GAP: 10,
  LEVEL_WIDTH: 100,
  ARROW_LENGTH: 10,
  ARROW_OFFSET: 2,
};

const CSS_VARS = {
  NODE_RADIUS: "--ag-node-radius",
  NODE_GAP: "--ag-node-gap",
  LEVEL_WIDTH: "--ag-level-width",
  ARROW_LENGTH: "--ag-arrow-length",
  ARROW_OFFSET: "--ag-arrow-offset",
};

export function parseGraphStyle(): GraphStyle {
  const computed = getComputedStyle(document.body);

  const getVar = (name: string, defaultVal: number): number => {
    const val = computed.getPropertyValue(name).trim();
    return val ? parseFloat(val) : defaultVal;
  };

  return {
    nodeRadius: getVar(CSS_VARS.NODE_RADIUS, DEFAULTS.NODE_RADIUS),
    nodeGap: getVar(CSS_VARS.NODE_GAP, DEFAULTS.NODE_GAP),
    levelWidth: getVar(CSS_VARS.LEVEL_WIDTH, DEFAULTS.LEVEL_WIDTH),
    arrowLength: getVar(CSS_VARS.ARROW_LENGTH, DEFAULTS.ARROW_LENGTH),
    arrowOffset: getVar(CSS_VARS.ARROW_OFFSET, DEFAULTS.ARROW_OFFSET),
  };
}

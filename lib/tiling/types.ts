export type TileType = 'home' | 'projects' | 'project-detail' | 'contact' | 'about' | 'blog';

export interface Tile {
  id: string;
  type: TileType;
  title: string;
  focused: boolean;
  data?: any;
}

export interface TileNode {
  id: string;
  tile?: Tile;
  split?: 'horizontal' | 'vertical';
  splitRatio?: number;
  left?: TileNode;
  right?: TileNode;
  parent?: TileNode;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TileLayout {
  tileId: string;
  rect: Rectangle;
  tile: Tile;
}

export interface TilingConfig {
  gap: number;
  minTileWidth: number;
  minTileHeight: number;
  defaultSplitRatio: number;
}
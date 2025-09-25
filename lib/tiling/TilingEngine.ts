import { Tile, TileNode, Rectangle, TileLayout, TilingConfig } from './types';

export class TilingEngine {
  private root: TileNode | null = null;
  private tiles: Map<string, Tile> = new Map();
  private config: TilingConfig = {
    gap: 8,
    minTileWidth: 300,
    minTileHeight: 200,
    defaultSplitRatio: 0.5,
  };

  constructor(config?: Partial<TilingConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  addTile(tile: Tile): void {
    this.tiles.set(tile.id, tile);

    if (!this.root) {
      this.root = {
        id: tile.id,
        tile,
      };
    } else {
      const targetNode = this.findNodeToSplit(this.root);
      this.splitNode(targetNode, tile);
    }
  }

  removeTile(tileId: string): void {
    const node = this.findNodeById(this.root, tileId);
    if (!node || !node.parent) {
      if (this.root?.id === tileId) {
        this.root = null;
      }
      this.tiles.delete(tileId);
      return;
    }

    const parent = node.parent;
    const sibling = parent.left?.id === tileId ? parent.right : parent.left;

    if (sibling && parent.parent) {
      const grandParent = parent.parent;
      if (grandParent.left === parent) {
        grandParent.left = sibling;
      } else {
        grandParent.right = sibling;
      }
      sibling.parent = grandParent;
    } else if (sibling) {
      this.root = sibling;
      sibling.parent = undefined;
    }

    this.tiles.delete(tileId);
  }

  focusTile(tileId: string): void {
    this.tiles.forEach((tile) => {
      tile.focused = tile.id === tileId;
    });
  }

  calculateLayouts(containerRect: Rectangle): TileLayout[] {
    if (!this.root) return [];

    const layouts: TileLayout[] = [];
    this.calculateNodeLayout(this.root, containerRect, layouts);
    return layouts;
  }

  private findNodeToSplit(node: TileNode): TileNode {
    if (!node.left && !node.right && node.tile) {
      return node;
    }

    if (node.left) {
      const leftCandidate = this.findNodeToSplit(node.left);
      if (leftCandidate.tile) return leftCandidate;
    }

    if (node.right) {
      const rightCandidate = this.findNodeToSplit(node.right);
      if (rightCandidate.tile) return rightCandidate;
    }

    return node;
  }

  private splitNode(node: TileNode, newTile: Tile): void {
    const oldTile = node.tile;
    node.tile = undefined;

    const shouldSplitVertically = Math.random() > 0.5;
    node.split = shouldSplitVertically ? 'vertical' : 'horizontal';
    node.splitRatio = this.config.defaultSplitRatio;

    node.left = {
      id: oldTile!.id,
      tile: oldTile,
      parent: node,
    };

    node.right = {
      id: newTile.id,
      tile: newTile,
      parent: node,
    };
  }

  private findNodeById(node: TileNode | null, id: string): TileNode | null {
    if (!node) return null;
    if (node.id === id) return node;

    const leftResult = this.findNodeById(node.left || null, id);
    if (leftResult) return leftResult;

    return this.findNodeById(node.right || null, id);
  }

  private calculateNodeLayout(
    node: TileNode,
    rect: Rectangle,
    layouts: TileLayout[]
  ): void {
    if (node.tile) {
      layouts.push({
        tileId: node.id,
        rect: {
          x: rect.x + this.config.gap / 2,
          y: rect.y + this.config.gap / 2,
          width: rect.width - this.config.gap,
          height: rect.height - this.config.gap,
        },
        tile: node.tile,
      });
      return;
    }

    if (node.left && node.right && node.split) {
      const ratio = node.splitRatio || 0.5;

      if (node.split === 'horizontal') {
        const leftWidth = rect.width * ratio;
        const rightWidth = rect.width * (1 - ratio);

        this.calculateNodeLayout(
          node.left,
          {
            x: rect.x,
            y: rect.y,
            width: leftWidth,
            height: rect.height,
          },
          layouts
        );

        this.calculateNodeLayout(
          node.right,
          {
            x: rect.x + leftWidth,
            y: rect.y,
            width: rightWidth,
            height: rect.height,
          },
          layouts
        );
      } else {
        const topHeight = rect.height * ratio;
        const bottomHeight = rect.height * (1 - ratio);

        this.calculateNodeLayout(
          node.left,
          {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: topHeight,
          },
          layouts
        );

        this.calculateNodeLayout(
          node.right,
          {
            x: rect.x,
            y: rect.y + topHeight,
            width: rect.width,
            height: bottomHeight,
          },
          layouts
        );
      }
    }
  }

  getTiles(): Tile[] {
    return Array.from(this.tiles.values());
  }

  clear(): void {
    this.root = null;
    this.tiles.clear();
  }
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewportMode = 'widescreen' | 'desktop' | 'tablet' | 'mobile';

export type MenuOrientation = 'horizontal' | 'vertical';

export type VerticalSubmenuExpand = 'flyout-right' | 'accordion-inline';

export type SubmenuType = 'none' | 'mega' | 'half-mega' | 'dropdown' | 'flyout';

export type LayoutMode = 'grid' | 'list' | 'bento';

export type TriggerMode = 'hover' | 'click';

export type MobileTransformStyle =
  | 'push-in-left'
  | 'push-in-right'
  | 'drawer-accordion'
  | 'slide-drilldown'
  | 'fullscreen-grid';

export type CoreBlockType =
  | 'core/navigation-link'
  | 'core/heading'
  | 'core/paragraph'
  | 'core/image'
  | 'core/buttons'
  | 'core/search'
  | 'core/latest-posts'
  | 'core/separator';

export interface CoreBlockItem {
  id: string;
  blockName: CoreBlockType;
  attributes: {
    title?: string;
    description?: string;
    url?: string;
    badgeText?: string;
    iconName?: string;
    buttonLabel?: string;
    buttonVariant?: 'primary' | 'outline';
    placeholder?: string;
    imageCaption?: string;
    imageAspect?: '16:9' | '4:3' | '1:1';
    imageTheme?: 'architecture' | 'analytics' | 'commerce' | 'editorial';
    level?: 2 | 3 | 4;
    highlightBox?: boolean;
    postItems?: Array<{
      title: string;
      date: string;
      category: string;
    }>;
  };
}

export interface SubmenuColumn {
  id: string;
  title: string;
  span: number; // 1 to 4
  isHighlightedCard?: boolean;
  blocks: CoreBlockItem[];
}

export interface FlyoutChildItem {
  id: string;
  label: string;
  url: string;
  description?: string;
  children?: Array<{
    id: string;
    label: string;
    url: string;
    meta?: string;
  }>;
}

export interface MenuItemNode {
  id: string;
  label: string;
  url: string;
  submenuType: SubmenuType;
  layoutMode: LayoutMode;
  columnsCount: 1 | 2 | 3 | 4;
  widthPreset: 'auto' | '560px' | '760px' | '1120px' | 'full';
  trigger: TriggerMode;
  featuredNote?: string;
  columns: SubmenuColumn[];
  flyoutItems?: FlyoutChildItem[];
}

export interface GutenbergMenuSchema {
  schemaVersion: string;
  blockName: 'core/navigation-polymorphic-builder';
  attributes: {
    menuTitle: string;
    brandName: string;
    brandLogo?: string;
    verticalWidth: number;
    ctaLabel: string;
    ctaUrl: string;
    orientation: MenuOrientation;
    verticalExpandMode: VerticalSubmenuExpand;
    stickyHeader: boolean;
    mobileTransform: MobileTransformStyle;
    widescreenMaxWidth: number;
    surfaceTheme: 'light' | 'dark';
    gapPx: number;
  };
  items: MenuItemNode[];
}

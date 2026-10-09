/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GutenbergMenuSchema,
  ViewportMode,
  MenuItemNode,
  SubmenuColumn,
  CoreBlockType,
} from '../types/menu';
import { CoreBlockRenderer } from './CoreBlockRenderer';
import { createDefaultCoreBlock } from '../data/defaultMenu';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Plus,
  Box,
  User,
  Rocket,
  Sidebar,
  Layout,
} from 'lucide-react';

interface PolymorphicMenuCanvasProps {
  schema: GutenbergMenuSchema;
  viewport: ViewportMode;
  isEditorComposeMode: boolean;
  selectedItemId: string | null;
  selectedColumnId: string | null;
  selectedBlockId: string | null;
  onSelectItem: (itemId: string) => void;
  onSelectColumn: (itemId: string, columnId: string) => void;
  onSelectBlock: (itemId: string, columnId: string, blockId: string) => void;
  onUpdateSchema: (next: GutenbergMenuSchema) => void;
}

export const PolymorphicMenuCanvas: React.FC<PolymorphicMenuCanvasProps> = ({
  schema,
  viewport,
  isEditorComposeMode,
  selectedItemId,
  selectedColumnId,
  selectedBlockId,
  onSelectItem,
  onSelectColumn,
  onSelectBlock,
  onUpdateSchema,
}) => {
  const [activeHoverItemId, setActiveHoverItemId] = useState<string | null>(
    schema.items[0]?.id || null
  );
  const [activeFlyoutBranchId, setActiveFlyoutBranchId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(true);
  const [mobileDrillItem, setMobileDrillItem] = useState<MenuItemNode | null>(null);

  const effectiveOpenItemId = isEditorComposeMode
    ? selectedItemId || activeHoverItemId
    : activeHoverItemId;

  const activeItem = schema.items.find((it) => it.id === effectiveOpenItemId);
  const isCompactViewport = viewport === 'tablet' || viewport === 'mobile';
  const isVerticalMode = schema.attributes.orientation === 'vertical' && !isCompactViewport;

  const handleDeleteBlock = (itemId: string, colId: string, blockId: string) => {
    const nextItems = schema.items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        columns: it.columns.map((col) => {
          if (col.id !== colId) return col;
          return {
            ...col,
            blocks: col.blocks.filter((b) => b.id !== blockId),
          };
        }),
      };
    });
    onUpdateSchema({ ...schema, items: nextItems });
  };

  const handleMoveBlock = (
    itemId: string,
    colId: string,
    blockId: string,
    direction: 'up' | 'down'
  ) => {
    const nextItems = schema.items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        columns: it.columns.map((col) => {
          if (col.id !== colId) return col;
          const idx = col.blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) return col;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= col.blocks.length) return col;
          const copy = [...col.blocks];
          const [moved] = copy.splice(idx, 1);
          copy.splice(targetIdx, 0, moved);
          return { ...col, blocks: copy };
        }),
      };
    });
    onUpdateSchema({ ...schema, items: nextItems });
  };

  const handleQuickAddBlockToColumn = (
    itemId: string,
    colId: string,
    blockType: CoreBlockType = 'core/navigation-link'
  ) => {
    const newBlock = createDefaultCoreBlock(blockType);
    const nextItems = schema.items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        columns: it.columns.map((col) =>
          col.id === colId ? { ...col, blocks: [...col.blocks, newBlock] } : col
        ),
      };
    });
    onUpdateSchema({ ...schema, items: nextItems });
    onSelectBlock(itemId, colId, newBlock.id);
  };

  const handleAddTopMenuItem = () => {
    const uid = `nav_${Math.random().toString(36).slice(2, 7)}`;
    const newItem: MenuItemNode = {
      id: uid,
      label: 'New Item',
      url: '/new-section',
      submenuType: 'dropdown',
      layoutMode: 'list',
      columnsCount: 1,
      widthPreset: 'auto',
      trigger: 'hover',
      columns: [
        {
          id: `col_${Math.random().toString(36).slice(2, 7)}`,
          title: 'LINKS',
          span: 1,
          blocks: [createDefaultCoreBlock('core/navigation-link')],
        },
      ],
    };
    onUpdateSchema({ ...schema, items: [...schema.items, newItem] });
    onSelectItem(newItem.id);
    setActiveHoverItemId(newItem.id);
  };

  // Render Submenu Panel (Used for Mega, Half-Mega, Dropdown, Flyout)
  const renderSubmenuContent = (item: MenuItemNode, anchorContext: 'bar' | 'item' | 'vertical') => {
    if (item.submenuType === 'none') return null;

    if (item.submenuType === 'flyout') {
      const flyoutList = item.flyoutItems || [];
      const currentFlyout =
        flyoutList.find((f) => f.id === activeFlyoutBranchId) || flyoutList[0];

      return (
        <div className={`poly-submenu poly-submenu--flyout anchor-${anchorContext}`}>
          <div className="poly-flyout-shell">
            <div className="poly-flyout-primary">
              <div className="poly-flyout-kicker">Nhánh điều hướng đa tầng</div>
              {flyoutList.map((fItem) => (
                <div
                  key={fItem.id}
                  onMouseEnter={() => setActiveFlyoutBranchId(fItem.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFlyoutBranchId(fItem.id);
                  }}
                  className={`poly-flyout-row ${
                    currentFlyout?.id === fItem.id ? 'is-active' : ''
                  }`}
                >
                  <div className="poly-flyout-row-text">
                    <span className="poly-flyout-row-label">{fItem.label}</span>
                    {fItem.description && (
                      <span className="poly-flyout-row-desc">{fItem.description}</span>
                    )}
                  </div>
                  <ChevronRight size={15} />
                </div>
              ))}
            </div>

            {currentFlyout && (
              <div className="poly-flyout-secondary">
                <div className="poly-flyout-kicker">{currentFlyout.label}</div>
                <ul className="poly-flyout-sublist">
                  {(currentFlyout.children || []).map((child) => (
                    <li key={child.id}>
                      <a
                        href={child.url}
                        onClick={(e) => e.preventDefault()}
                        className="poly-flyout-sublink"
                      >
                        <span>{child.label}</span>
                        {child.meta && (
                          <span className="poly-flyout-meta">{child.meta}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>

                {item.columns[0] && item.columns[0].blocks.length > 0 && (
                  <div className="poly-flyout-embedded-blocks">
                    {item.columns[0].blocks.map((blk) => (
                      <CoreBlockRenderer
                        key={blk.id}
                        block={blk}
                        isEditorMode={isEditorComposeMode}
                        isSelected={selectedBlockId === blk.id}
                        onSelect={(e) => {
                          e.stopPropagation();
                          onSelectBlock(item.id, item.columns[0].id, blk.id);
                        }}
                        onDelete={() =>
                          handleDeleteBlock(item.id, item.columns[0].id, blk.id)
                        }
                        onMoveUp={() =>
                          handleMoveBlock(item.id, item.columns[0].id, blk.id, 'up')
                        }
                        onMoveDown={() =>
                          handleMoveBlock(item.id, item.columns[0].id, blk.id, 'down')
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    const submenuModifier =
      item.submenuType === 'mega'
        ? 'poly-submenu--mega'
        : item.submenuType === 'half-mega'
        ? 'poly-submenu--half-mega'
        : 'poly-submenu--dropdown';

    return (
      <div
        className={`poly-submenu ${submenuModifier} anchor-${anchorContext} layout-${item.layoutMode}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="poly-submenu-grid"
          style={{
            gridTemplateColumns:
              item.submenuType === 'dropdown' || item.layoutMode === 'list'
                ? '1fr'
                : `repeat(${item.columns.length}, minmax(0, 1fr))`,
          }}
        >
          {item.columns.map((col: SubmenuColumn) => {
            const isColSelected =
              isEditorComposeMode &&
              selectedItemId === item.id &&
              selectedColumnId === col.id;

            return (
              <div
                key={col.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectColumn(item.id, col.id);
                }}
                className={`poly-submenu-column ${
                  col.isHighlightedCard ? 'is-promo-card' : ''
                } ${isColSelected ? 'is-col-selected' : ''}`}
              >
                {isEditorComposeMode && (
                  <div className="poly-col-editor-bar">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const nextItems = schema.items.map((it) => {
                          if (it.id !== item.id) return it;
                          return {
                            ...it,
                            columns: it.columns.map((c) =>
                              c.id === col.id ? { ...c, title: e.target.value } : c
                            ),
                          };
                        });
                        onUpdateSchema({ ...schema, items: nextItems });
                      }}
                      className="poly-col-title-input"
                    />
                    <span className="poly-col-count tabular-nums">
                      {col.blocks.length} blk
                    </span>
                  </div>
                )}

                <div className="poly-column-blocks">
                  {col.blocks.map((blk) => (
                    <CoreBlockRenderer
                      key={blk.id}
                      block={blk}
                      isEditorMode={isEditorComposeMode}
                      isSelected={selectedBlockId === blk.id}
                      onSelect={(e) => {
                        e.stopPropagation();
                        onSelectBlock(item.id, col.id, blk.id);
                      }}
                      onDelete={() => handleDeleteBlock(item.id, col.id, blk.id)}
                      onMoveUp={() => handleMoveBlock(item.id, col.id, blk.id, 'up')}
                      onMoveDown={() => handleMoveBlock(item.id, col.id, blk.id, 'down')}
                    />
                  ))}
                </div>

                {isEditorComposeMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAddBlockToColumn(item.id, col.id, 'core/navigation-link');
                    }}
                    className="poly-quick-append-btn"
                  >
                    <Plus size={13} />
                    <span>Thêm Block</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {item.featuredNote && (
          <div className="poly-submenu-footer">
            <span className="poly-submenu-footer-note">{item.featuredNote}</span>
            <span className="poly-submenu-footer-meta">
              {item.submenuType.toUpperCase()} · {item.columns.length} cột
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render Mobile / Tablet Push-In Drawer or Accordion Content
  const renderMobileDrawerInner = () => {
    const transformStyle = schema.attributes.mobileTransform;

    if (transformStyle === 'slide-drilldown' && mobileDrillItem) {
      return (
        <div className="poly-drill-detail">
          <button
            type="button"
            className="poly-drill-back"
            onClick={() => setMobileDrillItem(null)}
          >
            <ChevronLeft size={16} />
            <span>Quay lại Menu chính</span>
          </button>
          <h3 className="poly-drill-title">{mobileDrillItem.label}</h3>

          <div className="poly-compact-columns">
            {mobileDrillItem.columns.map((col) => (
              <div
                key={col.id}
                className={`poly-compact-col-box ${
                  col.isHighlightedCard ? 'is-promo-card' : ''
                }`}
              >
                <div className="poly-compact-col-label">{col.title}</div>
                {col.blocks.map((blk) => (
                  <CoreBlockRenderer
                    key={blk.id}
                    block={blk}
                    isEditorMode={isEditorComposeMode}
                    isSelected={selectedBlockId === blk.id}
                    onSelect={(e) => {
                      e.stopPropagation();
                      onSelectBlock(mobileDrillItem.id, col.id, blk.id);
                    }}
                    onDelete={() => handleDeleteBlock(mobileDrillItem.id, col.id, blk.id)}
                    onMoveUp={() =>
                      handleMoveBlock(mobileDrillItem.id, col.id, blk.id, 'up')
                    }
                    onMoveDown={() =>
                      handleMoveBlock(mobileDrillItem.id, col.id, blk.id, 'down')
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="poly-accordion-list">
        {schema.items.map((item) => {
          const isOpen = effectiveOpenItemId === item.id;
          return (
            <div
              key={item.id}
              className={`poly-accordion-item ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="poly-accordion-trigger"
                onClick={() => {
                  onSelectItem(item.id);
                  if (transformStyle === 'slide-drilldown' && item.submenuType !== 'none') {
                    setMobileDrillItem(item);
                  } else {
                    setActiveHoverItemId(isOpen ? null : item.id);
                  }
                }}
              >
                <div className="poly-accordion-trigger-left">
                  <span className="poly-accordion-title">{item.label}</span>
                  {item.submenuType !== 'none' && (
                    <span className="poly-accordion-meta">{item.submenuType}</span>
                  )}
                </div>
                {item.submenuType !== 'none' && (
                  <ChevronDown
                    size={16}
                    className={`poly-accordion-chevron ${isOpen ? 'is-rotated' : ''}`}
                  />
                )}
              </button>

              {isOpen &&
                transformStyle !== 'slide-drilldown' &&
                item.submenuType !== 'none' && (
                  <div className="poly-accordion-body">
                    {item.columns.map((col) => (
                      <div
                        key={col.id}
                        className={`poly-compact-col-box ${
                          col.isHighlightedCard ? 'is-promo-card' : ''
                        }`}
                      >
                        <div className="poly-compact-col-label">{col.title}</div>
                        {col.blocks.map((blk) => (
                          <CoreBlockRenderer
                            key={blk.id}
                            block={blk}
                            isEditorMode={isEditorComposeMode}
                            isSelected={selectedBlockId === blk.id}
                            onSelect={(e) => {
                              e.stopPropagation();
                              onSelectBlock(item.id, col.id, blk.id);
                            }}
                            onDelete={() => handleDeleteBlock(item.id, col.id, blk.id)}
                            onMoveUp={() =>
                              handleMoveBlock(item.id, col.id, blk.id, 'up')
                            }
                            onMoveDown={() =>
                              handleMoveBlock(item.id, col.id, blk.id, 'down')
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  // Determine if compact mode is using Off-Canvas Push-In
  const isPushInMode =
    isCompactViewport &&
    (schema.attributes.mobileTransform === 'push-in-left' ||
      schema.attributes.mobileTransform === 'push-in-right');
  const pushDirection =
    schema.attributes.mobileTransform === 'push-in-right' ? 'right' : 'left';

  return (
    <div className={`poly-viewport-frame viewport-${viewport}`}>
      <div
        className={`poly-device-stage ${isPushInMode ? 'has-push-drawer' : ''} ${
          isPushInMode && mobileMenuOpen ? `is-pushed-${pushDirection}` : ''
        }`}
        style={{
          maxWidth:
            viewport === 'widescreen'
              ? `${schema.attributes.widescreenMaxWidth}px`
              : viewport === 'desktop'
              ? '1140px'
              : viewport === 'tablet'
              ? '768px'
              : '420px',
        }}
      >
        {/* Off-Canvas Push-In Drawer for Tablet & Mobile */}
        {isPushInMode && (
          <aside
            className={`poly-push-drawer poly-push-drawer--${pushDirection} ${
              mobileMenuOpen ? 'is-open' : ''
            }`}
          >
            <div className="poly-push-drawer-header">
<div className="poly-brand-lockup">
                <span className="poly-brand-cube">
                  <Box size={16} />
                </span>
                <span className="poly-brand-wordmark">
                  {schema.attributes.brandLogo
                    ? <img
                        src={schema.attributes.brandLogo}
                        alt={schema.attributes.brandName}
                        style={{ height: '24px', width: 'auto' }}
                      />
                    : schema.attributes.brandName}
                </span>
              </div>
              <button
                type="button"
                className="poly-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng Push Menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="poly-push-drawer-tag">
              Push-In Off-Canvas Menu ({pushDirection.toUpperCase()})
            </div>

            <div className="poly-push-drawer-body">{renderMobileDrawerInner()}</div>

            <div className="poly-push-drawer-footer">
              <button type="button" className="poly-header-cta" style={{ width: '100%' }}>
                <Rocket size={14} />
                <span>{schema.attributes.ctaLabel}</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Website Viewport Wrapper (Gets pushed sideways when Push-In Drawer is open) */}
        <div className="poly-site-Content-push-wrapper">
          {/* Quick Mode Switch Bar inside Canvas for instant testing */}
          <div className="poly-canvas-quickbar">
            <div className="poly-quickbar-group">
              <span className="poly-quickbar-label">Hướng Menu:</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateSchema({
                    ...schema,
                    attributes: { ...schema.attributes, orientation: 'horizontal' },
                  })
                }
                className={`poly-quickbar-chip ${
                  schema.attributes.orientation === 'horizontal' ? 'is-active' : ''
                }`}
              >
                <Layout size={12} />
                <span>Horizontal Bar</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSchema({
                    ...schema,
                    attributes: { ...schema.attributes, orientation: 'vertical' },
                  })
                }
                className={`poly-quickbar-chip ${
                  schema.attributes.orientation === 'vertical' ? 'is-active' : ''
                }`}
              >
                <Sidebar size={12} />
                <span>Vertical Sidebar</span>
              </button>
            </div>

            {isCompactViewport && (
              <div className="poly-quickbar-group">
                <span className="poly-quickbar-label">Hiệu ứng Mobile:</span>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSchema({
                      ...schema,
                      attributes: { ...schema.attributes, mobileTransform: 'push-in-left' },
                    });
                    setMobileMenuOpen(true);
                  }}
                  className={`poly-quickbar-chip ${
                    schema.attributes.mobileTransform === 'push-in-left' ? 'is-active' : ''
                  }`}
                >
                  Push-In Trái
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSchema({
                      ...schema,
                      attributes: { ...schema.attributes, mobileTransform: 'push-in-right' },
                    });
                    setMobileMenuOpen(true);
                  }}
                  className={`poly-quickbar-chip ${
                    schema.attributes.mobileTransform === 'push-in-right' ? 'is-active' : ''
                  }`}
                >
                  Push-In Phải
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSchema({
                      ...schema,
                      attributes: {
                        ...schema.attributes,
                        mobileTransform: 'drawer-accordion',
                      },
                    });
                    setMobileMenuOpen(true);
                  }}
                  className={`poly-quickbar-chip ${
                    schema.attributes.mobileTransform === 'drawer-accordion'
                      ? 'is-active'
                      : ''
                  }`}
                >
                  Accordion
                </button>
              </div>
            )}
          </div>

          {/* CASE 1: HORIZONTAL NAVIGATION (OR COMPACT MOBILE HEADER) */}
          {!isVerticalMode ? (
            <>
              <header className="poly-site-header">
                 {/* Zone 1: Brand Lockup */}
                 <a
                   href="#top"
                   onClick={(e) => e.preventDefault()}
                   className="poly-brand-lockup"
                 >
                   <span className="poly-brand-cube">
                     <Box size={18} />
                   </span>
 <span className="poly-brand-wordmark">
                     {schema.attributes.brandLogo
                       ? <img
                           src={schema.attributes.brandLogo}
                           alt={schema.attributes.brandName}
                           style={{ height: '28px', width: 'auto' }}
                         />
                       : schema.attributes.brandName}
                   </span>
                 </a>

                 {/* Zone 2: Primary Navigation Links with Direct Anchored Submenus */}
                {!isCompactViewport && (
                  <nav
                    className="poly-primary-nav"
                    style={{ gap: `${schema.attributes.gapPx}px` }}
                  >
                    {schema.items.map((item) => {
                      const isSelected = selectedItemId === item.id;
                      const isExpanded = effectiveOpenItemId === item.id;
                      const isItemAnchored =
                        item.submenuType === 'dropdown' ||
                        item.submenuType === 'flyout' ||
                        item.submenuType === 'half-mega';

                      return (
                        <div
                          key={item.id}
                          className={`poly-nav-item-wrap ${
                            isSelected ? 'is-selected' : ''
                          } ${isExpanded ? 'is-expanded' : ''}`}
                          onMouseEnter={() => {
                            if (item.trigger === 'hover' && !isEditorComposeMode) {
                              setActiveHoverItemId(item.id);
                            }
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onSelectItem(item.id);
                              setActiveHoverItemId(
                                isExpanded && !isEditorComposeMode ? null : item.id
                              );
                            }}
                            className="poly-nav-link"
                          >
                            <span>{item.label}</span>
                            {item.submenuType !== 'none' && (
                              <ChevronDown
                                size={14}
                                className={`poly-nav-chevron ${
                                  isExpanded ? 'is-rotated' : ''
                                }`}
                              />
                            )}
                          </button>

                          {/* Direct Item-Anchored Submenu (Dropdown, Flyout, Half-Mega) */}
                          {isExpanded &&
                            isItemAnchored &&
                            renderSubmenuContent(item, 'item')}
                        </div>
                      );
                    })}

                    {isEditorComposeMode && (
                      <button
                        type="button"
                        onClick={handleAddTopMenuItem}
                        title="Thêm mục Menu mới"
                        className="poly-add-nav-item-btn"
                      >
                        <Plus size={14} />
                        <span>Thêm mục</span>
                      </button>
                    )}
                  </nav>
                )}

                {/* Zone 3: Right Actions */}
                <div className="poly-header-actions">
                  {!isCompactViewport ? (
                    <>
                      <a
                        href="#login"
                        onClick={(e) => e.preventDefault()}
                        className="poly-login-link"
                      >
                        <User size={14} />
                        <span>Login</span>
                      </a>
                      <button type="button" className="poly-header-cta">
                        <Rocket size={14} />
                        <span>{schema.attributes.ctaLabel}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen((prev) => !prev)}
                      className="poly-mobile-toggle-btn"
                    >
                      {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
                      <span>{mobileMenuOpen ? 'Đóng Menu' : 'Mở Menu'}</span>
                    </button>
                  )}
                </div>

                {/* Full-Width Mega Menu Attached Immediately Below Header Bar */}
                {!isCompactViewport &&
                  activeItem &&
                  activeItem.submenuType === 'mega' &&
                  renderSubmenuContent(activeItem, 'bar')}
              </header>

              {/* Stage Body underneath Header */}
              <div className="poly-stage-body">
                {isCompactViewport && !isPushInMode && mobileMenuOpen && (
                  <div className="poly-compact-surface">
                    <div className="poly-drill-kicker">
                      Menu Di động ({schema.attributes.mobileTransform})
                    </div>
                    {renderMobileDrawerInner()}
                  </div>
                )}

                <section className="poly-page-backdrop">
                  <div className="poly-backdrop-meta">
                    <span>Khung nhìn: {viewport.toUpperCase()}</span>
                    <span aria-hidden="true">·</span>
                    <span>Orientation: {schema.attributes.orientation}</span>
                    <span aria-hidden="true">·</span>
                    <span>Mobile Mode: {schema.attributes.mobileTransform}</span>
                  </div>
                  <h2 className="poly-backdrop-headline">
                    Submenu bám sát trực tiếp bên dưới từng Menu Item & Hỗ trợ Push-In Menu.
                  </h2>
                  <p className="poly-backdrop-copy">
                    Khi chọn chế độ Tablet hoặc Mobile trên thanh công cụ phía trên, menu sẽ tự động chuyển sang cơ chế Push-In trượt từ bên ngoài vào và đẩy khung nội dung trang sang một bên.
                  </p>
                </section>
              </div>
            </>
          ) : (
            /* CASE 2: VERTICAL SIDEBAR MENU MODE */
            <div className="poly-vertical-workspace" style={{ '--vertical-width': `${schema.attributes.verticalWidth}px` }}>
              <aside className="poly-vertical-sidebar">
                <div className="poly-vertical-brand">
                  <span className="poly-brand-cube">
                    <Box size={18} />
                  </span>
                  <span className="poly-brand-wordmark">
                    {schema.attributes.brandLogo
                      ? <img
                          src={schema.attributes.brandLogo}
                          alt={schema.attributes.brandName}
                          style={{ height: '28px', width: 'auto' }}
                        />
                      : schema.attributes.brandName}
                  </span>
                </div>

                <div className="poly-vertical-kicker">
                  VERTICAL NAVIGATION ({schema.attributes.verticalExpandMode})
                </div>

                <nav className="poly-vertical-nav">
                  {schema.items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isExpanded = effectiveOpenItemId === item.id;
                    const expandRight =
                      schema.attributes.verticalExpandMode === 'flyout-right';

                    return (
                      <div
                        key={item.id}
                        className={`poly-vertical-item-wrap ${
                          isSelected ? 'is-selected' : ''
                        } ${isExpanded ? 'is-expanded' : ''}`}
                        onMouseEnter={() => {
                          if (item.trigger === 'hover' && !isEditorComposeMode) {
                            setActiveHoverItemId(item.id);
                          }
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectItem(item.id);
                            setActiveHoverItemId(item.id);
                          }}
                          className="poly-vertical-link"
                        >
                          <div className="poly-vertical-link-left">
                            <span className="poly-vertical-link-title">{item.label}</span>
                            <span className="poly-vertical-link-badge">
                              {item.submenuType}
                            </span>
                          </div>
                          {item.submenuType !== 'none' &&
                            (expandRight ? (
                              <ChevronRight size={15} />
                            ) : (
                              <ChevronDown
                                size={15}
                                className={`poly-nav-chevron ${
                                  isExpanded ? 'is-rotated' : ''
                                }`}
                              />
                            ))}
                        </button>

                        {/* Vertical Submenu: Either Flyout to Right or Inline Accordion */}
                        {isExpanded && item.submenuType !== 'none' && (
                          <div
                            className={
                              expandRight
                                ? 'poly-vertical-flyout-pane'
                                : 'poly-vertical-accordion-pane'
                            }
                          >
                            {renderSubmenuContent(item, 'vertical')}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isEditorComposeMode && (
                    <button
                      type="button"
                      onClick={handleAddTopMenuItem}
                      className="poly-add-nav-item-btn"
                      style={{ marginTop: 8, justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                      <span>Thêm mục Vertical</span>
                    </button>
                  )}
                </nav>

                <div className="poly-vertical-footer">
                  <button type="button" className="poly-header-cta" style={{ width: '100%' }}>
                    <Rocket size={14} />
                    <span>{schema.attributes.ctaLabel}</span>
                  </button>
                </div>
              </aside>

              <div className="poly-vertical-main-content">
                <section className="poly-page-backdrop" style={{ borderTop: 'none' }}>
                  <div className="poly-backdrop-meta">
                    <span>Chế độ: VERTICAL MENU</span>
                    <span aria-hidden="true">·</span>
                    <span>Kiểu bung: {schema.attributes.verticalExpandMode}</span>
                  </div>
                  <h2 className="poly-backdrop-headline">
                    Hệ thống Vertical Menu cho Sidebar, Tài liệu và Danh mục lớn.
                  </h2>
                  <p className="poly-backdrop-copy">
                    Hỗ trợ cả 2 chế độ: Bung ngang sang bên phải (Flyout Right Mega Panel) hoặc sổ dọc trực tiếp (Accordion Inline) ngay trong thanh Sidebar.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GutenbergMenuSchema,
  MenuItemNode,
  SubmenuColumn,
  CoreBlockItem,
  CoreBlockType,
  SubmenuType,
  LayoutMode,
  MobileTransformStyle,
  MenuOrientation,
  VerticalSubmenuExpand,
} from '../types/menu';
import { CORE_BLOCK_CATALOG, createDefaultCoreBlock } from '../data/defaultMenu';
import {
  Plus,
  Columns,
  LayoutGrid,
  List,
  Check,
  Copy,
  RefreshCw,
} from 'lucide-react';

interface GutenbergInspectorProps {
  schema: GutenbergMenuSchema;
  selectedItemId: string | null;
  selectedColumnId: string | null;
  selectedBlockId: string | null;
  onUpdateSchema: (next: GutenbergMenuSchema) => void;
  onSelectBlock: (itemId: string, columnId: string, blockId: string) => void;
}

export const GutenbergInspector: React.FC<GutenbergInspectorProps> = ({
  schema,
  selectedItemId,
  selectedColumnId,
  selectedBlockId,
  onUpdateSchema,
  onSelectBlock,
}) => {
  const [activeTab, setActiveTab] = useState<'item' | 'block' | 'menu' | 'json'>('item');
  const [jsonDraft, setJsonDraft] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedItem: MenuItemNode | undefined = schema.items.find(
    (item) => item.id === selectedItemId
  );

  const selectedColumn: SubmenuColumn | undefined = selectedItem?.columns.find(
    (col) => col.id === selectedColumnId
  );

  const selectedBlock: CoreBlockItem | undefined = selectedColumn?.blocks.find(
    (blk) => blk.id === selectedBlockId
  );

  const updateItem = (patch: Partial<MenuItemNode>) => {
    if (!selectedItem) return;
    const nextItems = schema.items.map((it) => {
      if (it.id !== selectedItem.id) return it;
      const updated = { ...it, ...patch };

      if (patch.columnsCount && patch.columnsCount !== it.columns.length) {
        const currentCols = [...it.columns];
        if (patch.columnsCount > currentCols.length) {
          for (let i = currentCols.length; i < patch.columnsCount; i++) {
            currentCols.push({
              id: `col_${Math.random().toString(36).slice(2, 7)}`,
              title: `COLUMN ${i + 1}`,
              span: 1,
              blocks: [createDefaultCoreBlock('core/navigation-link')],
            });
          }
        } else {
          currentCols.length = patch.columnsCount;
        }
        updated.columns = currentCols;
      }

      if (patch.submenuType === 'flyout' && (!it.flyoutItems || it.flyoutItems.length === 0)) {
        updated.flyoutItems = [
          {
            id: 'fly_default_1',
            label: 'Nhóm danh mục cấp 2',
            url: '/category-level-2',
            description: 'Di chuột để mở nhánh cấp 3 bên phải',
            children: [
              { id: 'fly_c1', label: 'Mục con 2.1', url: '/c1', meta: 'Core' },
              { id: 'fly_c2', label: 'Mục con 2.2', url: '/c2', meta: 'API' },
            ],
          },
        ];
      }

      if (
        patch.submenuType &&
        patch.submenuType !== 'none' &&
        updated.columns.length === 0
      ) {
        updated.columns = [
          {
            id: `col_${Math.random().toString(36).slice(2, 7)}`,
            title: 'COLUMN 1',
            span: 1,
            blocks: [createDefaultCoreBlock('core/navigation-link')],
          },
        ];
      }

      return updated;
    });

    onUpdateSchema({ ...schema, items: nextItems });
  };

  const toggleColumnHighlightCard = () => {
    if (!selectedItem || !selectedColumn) return;
    const nextItems = schema.items.map((it) => {
      if (it.id !== selectedItem.id) return it;
      return {
        ...it,
        columns: it.columns.map((col) =>
          col.id === selectedColumn.id
            ? { ...col, isHighlightedCard: !col.isHighlightedCard }
            : col
        ),
      };
    });
    onUpdateSchema({ ...schema, items: nextItems });
  };

  const updateBlockAttributes = (attrPatch: Partial<CoreBlockItem['attributes']>) => {
    if (!selectedItem || !selectedColumn || !selectedBlock) return;
    const nextItems = schema.items.map((it) => {
      if (it.id !== selectedItem.id) return it;
      return {
        ...it,
        columns: it.columns.map((col) => {
          if (col.id !== selectedColumn.id) return col;
          return {
            ...col,
            blocks: col.blocks.map((blk) =>
              blk.id === selectedBlock.id
                ? { ...blk, attributes: { ...blk.attributes, ...attrPatch } }
                : blk
            ),
          };
        }),
      };
    });
    onUpdateSchema({ ...schema, items: nextItems });
  };

  const handleInsertCoreBlock = (blockName: CoreBlockType) => {
    if (!selectedItem) return;
    const targetColId = selectedColumnId || selectedItem.columns[0]?.id;
    if (!targetColId) return;

    const newBlock = createDefaultCoreBlock(blockName);
    const nextItems = schema.items.map((it) => {
      if (it.id !== selectedItem.id) return it;
      return {
        ...it,
        columns: it.columns.map((col) =>
          col.id === targetColId ? { ...col, blocks: [...col.blocks, newBlock] } : col
        ),
      };
    });

    onUpdateSchema({ ...schema, items: nextItems });
    onSelectBlock(selectedItem.id, targetColId, newBlock.id);
    setActiveTab('block');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleOpenJsonTab = () => {
    setJsonDraft(JSON.stringify(schema, null, 2));
    setJsonError(null);
    setActiveTab('json');
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as GutenbergMenuSchema;
      if (!parsed.items || !Array.isArray(parsed.items)) {
        throw new Error('Cấu trúc JSON thiếu mảng "items" hợp lệ.');
      }
      onUpdateSchema(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Lỗi cú pháp JSON không hợp lệ.');
    }
  };

  return (
    <aside className="gb-inspector">
      <div className="gb-inspector-tabs">
        <button
          type="button"
          className={`gb-inspector-tab ${activeTab === 'item' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('item')}
        >
          Submenu
        </button>
        <button
          type="button"
          className={`gb-inspector-tab ${activeTab === 'block' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('block')}
        >
          Core Block
        </button>
        <button
          type="button"
          className={`gb-inspector-tab ${activeTab === 'menu' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Đa hình
        </button>
        <button
          type="button"
          className={`gb-inspector-tab ${activeTab === 'json' ? 'is-active' : ''}`}
          onClick={handleOpenJsonTab}
        >
          JSON
        </button>
      </div>

      <div className="gb-inspector-body">
        {activeTab === 'item' && (
          <>
            {selectedItem ? (
              <div className="gb-panel-stack">
                <div className="gb-panel-section">
                  <div className="gb-panel-header">
                    <span className="gb-panel-title">Định danh Mục Menu</span>
                    <span className="gb-panel-subtitle tabular-nums">ID: {selectedItem.id}</span>
                  </div>

                  <label className="gb-field">
                    <span className="gb-field-label">Nhãn hiển thị (Label)</span>
                    <input
                      type="text"
                      className="gb-input"
                      value={selectedItem.label}
                      onChange={(e) => updateItem({ label: e.target.value })}
                    />
                  </label>

                  <label className="gb-field">
                    <span className="gb-field-label">Đường dẫn đích (URL)</span>
                    <input
                      type="text"
                      className="gb-input gb-input--mono"
                      value={selectedItem.url}
                      onChange={(e) => updateItem({ url: e.target.value })}
                    />
                  </label>
                </div>

                <div className="gb-panel-section">
                  <div className="gb-panel-header">
                    <span className="gb-panel-title">Kiểu Submenu (Neo dưới Menu Item)</span>
                  </div>

                  <div className="gb-submenu-type-grid">
                    {(
                      [
                        { id: 'mega', label: 'Mega Menu', desc: 'Toàn khung, nhiều cột' },
                        { id: 'half-mega', label: 'Half Mega', desc: 'Neo dưới item, 2-3 cột' },
                        { id: 'dropdown', label: 'Dropdown', desc: 'Neo thẳng dưới item' },
                        { id: 'flyout', label: 'Flyout', desc: 'Menu nhánh đa tầng' },
                        { id: 'none', label: 'Liên kết đơn', desc: 'Không có menu con' },
                      ] as Array<{ id: SubmenuType; label: string; desc: string }>
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          updateItem({
                            submenuType: t.id,
                            columnsCount:
                              t.id === 'mega'
                                ? 4
                                : t.id === 'half-mega'
                                ? 2
                                : 1,
                          })
                        }
                        className={`gb-type-card ${
                          selectedItem.submenuType === t.id ? 'is-active' : ''
                        }`}
                      >
                        <span className="gb-type-card-title">{t.label}</span>
                        <span className="gb-type-card-desc">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedItem.submenuType !== 'none' && (
                  <div className="gb-panel-section">
                    <div className="gb-panel-header">
                      <span className="gb-panel-title">Bố cục Lưới & Cột (Layout & Grid)</span>
                    </div>

                    <div className="gb-field">
                      <span className="gb-field-label">Chế độ hiển thị nội dung</span>
                      <div className="gb-segmented">
                        {(
                          [
                            { id: 'grid', label: 'Grid Cột', icon: LayoutGrid },
                            { id: 'list', label: 'Danh sách', icon: List },
                            { id: 'bento', label: 'Bento', icon: Columns },
                          ] as Array<{ id: LayoutMode; label: string; icon: any }>
                        ).map((mode) => {
                          const Icon = mode.icon;
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => updateItem({ layoutMode: mode.id })}
                              className={`gb-segmented-btn ${
                                selectedItem.layoutMode === mode.id ? 'is-active' : ''
                              }`}
                            >
                              <Icon size={13} />
                              <span>{mode.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(selectedItem.submenuType === 'mega' ||
                      selectedItem.submenuType === 'half-mega') && (
                      <div className="gb-field">
                        <span className="gb-field-label">Số cột chia lưới (Columns)</span>
                        <div className="gb-segmented">
                          {([1, 2, 3, 4] as Array<1 | 2 | 3 | 4>).map((colNum) => (
                            <button
                              key={colNum}
                              type="button"
                              onClick={() => updateItem({ columnsCount: colNum })}
                              className={`gb-segmented-btn tabular-nums ${
                                selectedItem.columnsCount === colNum ? 'is-active' : ''
                              }`}
                            >
                              {colNum} cột
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedColumn && (
                      <div className="gb-field">
                        <span className="gb-field-label">
                          Định dạng cột đang chọn ({selectedColumn.title})
                        </span>
                        <button
                          type="button"
                          onClick={toggleColumnHighlightCard}
                          className={`gb-type-card ${
                            selectedColumn.isHighlightedCard ? 'is-active' : ''
                          }`}
                        >
                          <span className="gb-type-card-title">
                            {selectedColumn.isHighlightedCard
                              ? 'Đang bật khung Promo Highlight (Nền xanh nhạt)'
                              : 'Bật khung Promo Highlight (Giống cột Free or Pro?)'}
                          </span>
                          <span className="gb-type-card-desc">
                            Tạo hộp nổi bật cho cột chứa Call-to-Action hoặc giới thiệu Pro.
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.submenuType !== 'none' && (
                  <div className="gb-panel-section">
                    <div className="gb-panel-header">
                      <span className="gb-panel-title">Nhúng Gutenberg Core Block</span>
                      <span className="gb-panel-subtitle">
                        Vào {selectedColumn ? selectedColumn.title : 'Cột 1'}
                      </span>
                    </div>
                    <div className="gb-block-inserter-grid">
                      {CORE_BLOCK_CATALOG.map((item) => (
                        <button
                          key={item.blockName}
                          type="button"
                          className="gb-inserter-card"
                          onClick={() => handleInsertCoreBlock(item.blockName)}
                        >
                          <div className="gb-inserter-top">
                            <Plus size={13} />
                            <span className="gb-inserter-name">{item.label}</span>
                          </div>
                          <span className="gb-inserter-code">{item.blockName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="gb-empty-inspector">
                Hãy chọn một mục trên thanh điều hướng để cấu hình kiểu Submenu và chia cột.
              </div>
            )}
          </>
        )}

        {activeTab === 'block' && (
          <div className="gb-panel-stack">
            {selectedBlock ? (
              <div className="gb-panel-section">
                <div className="gb-panel-header">
                  <span className="gb-panel-title">Thuộc tính Khối (Block Inspector)</span>
                  <span className="gb-panel-subtitle">{selectedBlock.blockName}</span>
                </div>

                {(selectedBlock.blockName === 'core/navigation-link' ||
                  selectedBlock.blockName === 'core/heading' ||
                  selectedBlock.blockName === 'core/image' ||
                  selectedBlock.blockName === 'core/latest-posts') && (
                  <label className="gb-field">
                    <span className="gb-field-label">Tiêu đề (Title)</span>
                    <input
                      type="text"
                      className="gb-input"
                      value={selectedBlock.attributes.title || ''}
                      onChange={(e) => updateBlockAttributes({ title: e.target.value })}
                    />
                  </label>
                )}

                {(selectedBlock.blockName === 'core/navigation-link' ||
                  selectedBlock.blockName === 'core/paragraph') && (
                  <label className="gb-field">
                    <span className="gb-field-label">Mô tả chi tiết (Description)</span>
                    <textarea
                      rows={3}
                      className="gb-textarea"
                      value={selectedBlock.attributes.description || ''}
                      onChange={(e) => updateBlockAttributes({ description: e.target.value })}
                    />
                  </label>
                )}

                {(selectedBlock.blockName === 'core/navigation-link' ||
                  selectedBlock.blockName === 'core/image' ||
                  selectedBlock.blockName === 'core/buttons') && (
                  <label className="gb-field">
                    <span className="gb-field-label">Liên kết URL</span>
                    <input
                      type="text"
                      className="gb-input gb-input--mono"
                      value={selectedBlock.attributes.url || ''}
                      onChange={(e) => updateBlockAttributes({ url: e.target.value })}
                    />
                  </label>
                )}

                {selectedBlock.blockName === 'core/navigation-link' && (
                  <label className="gb-field">
                    <span className="gb-field-label">Nhãn phụ chú (VD: PRO, Mới, Hot)</span>
                    <input
                      type="text"
                      className="gb-input"
                      placeholder="VD: PRO, v2.4, Mới..."
                      value={selectedBlock.attributes.badgeText || ''}
                      onChange={(e) => updateBlockAttributes({ badgeText: e.target.value })}
                    />
                  </label>
                )}

                {selectedBlock.blockName === 'core/buttons' && (
                  <>
                    <label className="gb-field">
                      <span className="gb-field-label">Nhãn nút bấm (Button Label)</span>
                      <input
                        type="text"
                        className="gb-input"
                        value={selectedBlock.attributes.buttonLabel || ''}
                        onChange={(e) => updateBlockAttributes({ buttonLabel: e.target.value })}
                      />
                    </label>
                    <div className="gb-field">
                      <span className="gb-field-label">Kiểu nút (Style Variant)</span>
                      <div className="gb-segmented">
                        <button
                          type="button"
                          onClick={() => updateBlockAttributes({ buttonVariant: 'primary' })}
                          className={`gb-segmented-btn ${
                            selectedBlock.attributes.buttonVariant !== 'outline' ? 'is-active' : ''
                          }`}
                        >
                          Primary Blue
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBlockAttributes({ buttonVariant: 'outline' })}
                          className={`gb-segmented-btn ${
                            selectedBlock.attributes.buttonVariant === 'outline' ? 'is-active' : ''
                          }`}
                        >
                          Outline Border
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedBlock.blockName === 'core/search' && (
                  <label className="gb-field">
                    <span className="gb-field-label">Văn bản gợi ý (Placeholder)</span>
                    <input
                      type="text"
                      className="gb-input"
                      value={selectedBlock.attributes.placeholder || ''}
                      onChange={(e) => updateBlockAttributes({ placeholder: e.target.value })}
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="gb-empty-inspector">
                Nhấp trực tiếp vào bất kỳ Core Block nào bên trong Submenu trên khung thiết kế để chỉnh sửa thuộc tính chi tiết.
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="gb-panel-stack">
            <div className="gb-panel-section">
              <div className="gb-panel-header">
                <span className="gb-panel-title">Hướng Menu (Horizontal & Vertical)</span>
              </div>

              <div className="gb-segmented">
                {(
                  [
                    { id: 'horizontal', label: 'Horizontal Header' },
                    { id: 'vertical', label: 'Vertical Sidebar' },
                  ] as Array<{ id: MenuOrientation; label: string }>
                ).map((ori) => (
                  <button
                    key={ori.id}
                    type="button"
                    onClick={() =>
                      onUpdateSchema({
                        ...schema,
                        attributes: { ...schema.attributes, orientation: ori.id },
                      })
                    }
                    className={`gb-segmented-btn ${
                      schema.attributes.orientation === ori.id ? 'is-active' : ''
                    }`}
                  >
                    {ori.label}
                  </button>
                ))}
              </div>

              {schema.attributes.orientation === 'vertical' && (
                <div className="gb-panel-section">
                  <div className="gb-panel-header">
                    <span className="gb-panel-title">Cách mở Submenu của Vertical Menu</span>
                  </div>
                  <div className="gb-field">
                    <span className="gb-field-label">Chiều rộng thanh bên (px)</span>
                    <div className="gb-segmented">
                      {([260, 280, 300, 320, 360, 400] as Array<260 | 280 | 300 | 320 | 360 | 400>).map(
                        (w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() =>
                              onUpdateSchema({
                                ...schema,
                                attributes: { ...schema.attributes, verticalWidth: w },
                              })
                            }
                            className={`gb-segmented-btn tabular-nums ${
                              schema.attributes.verticalWidth === w ? 'is-active' : ''
                            }`}
                          >
                            {w}px
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <select
                    className="gb-input"
                    value={schema.attributes.verticalExpandMode}
                    onChange={(e) =>
                      onUpdateSchema({
                        ...schema,
                        attributes: {
                          ...schema.attributes,
                          verticalExpandMode: e.target.value as VerticalSubmenuExpand,
                        },
                      })
                    }
                  >
                    <option value="flyout-right">Bung ngang bên phải</option>
                    <option value="accordion-inline">Sổ dọc Accordion</option>
                  </select>
                </div>
              )}
            </div>

            <div className="gb-panel-section">
              <div className="gb-panel-header">
                <span className="gb-panel-title">Chuyển đổi Mobile & Tablet (Push-in)</span>
              </div>

              <div className="gb-field">
                <span className="gb-field-label">Kiểu biến đổi trên Mobile / Tablet</span>
                <div className="gb-submenu-type-grid">
                  {(
                    [
                      {
                        id: 'push-in-left',
                        label: 'Push-In từ Trái',
                        desc: 'Menu trượt từ mép trái và đẩy khung trang sang phải',
                      },
                      {
                        id: 'push-in-right',
                        label: 'Push-In từ Phải',
                        desc: 'Menu trượt từ mép phải và đẩy khung trang sang trái',
                      },
                      {
                        id: 'slide-drilldown',
                        label: 'Slide Drill-down',
                        desc: 'Chuyển cảnh ngang từng cấp menu con mượt mà',
                      },
                      {
                        id: 'drawer-accordion',
                        label: 'Accordion Drop',
                        desc: 'Sổ dọc ngay bên dưới thanh Header di động',
                      },
                    ] as Array<{ id: MobileTransformStyle; label: string; desc: string }>
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onUpdateSchema({
                          ...schema,
                          attributes: { ...schema.attributes, mobileTransform: m.id },
                        })
                      }
                      className={`gb-type-card ${
                        schema.attributes.mobileTransform === m.id ? 'is-active' : ''
                      }`}
                    >
                      <span className="gb-type-card-title">{m.label}</span>
                      <span className="gb-type-card-desc">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="gb-panel-section">
              <div className="gb-panel-header">
                <span className="gb-panel-title">Cấu hình Thương hiệu & CTA</span>
              </div>

              <label className="gb-field">
                <span className="gb-field-label">Tên Thương hiệu (Brand Wordmark)</span>
                <input
                  type="text"
                  className="gb-input"
                  value={schema.attributes.brandName}
                  onChange={(e) =>
                    onUpdateSchema({
                      ...schema,
                      attributes: { ...schema.attributes, brandName: e.target.value },
                    })
                  }
                />
              </label>

              <label className="gb-field">
                <span className="gb-field-label">Logo Thương hiệu (URL)</span>
                <input
                  type="text"
                  className="gb-input gb-input--mono"
                  placeholder="https://example.com/logo.png"
                  value={schema.attributes.brandLogo || ''}
                  onChange={(e) =>
                    onUpdateSchema({
                      ...schema,
                      attributes: { ...schema.attributes, brandLogo: e.target.value },
                    })
                  }
                />
                <span className="gb-field-hint">
                  Nhập URL hình ảnh logo thương hiệu. Bỏ trống để dùng text brandName.
                </span>
              </label>

              <label className="gb-field">
                <span className="gb-field-label">Nút hành động chính (Primary Action)</span>
                <input
                  type="text"
                  className="gb-input"
                  value={schema.attributes.ctaLabel}
                  onChange={(e) =>
                    onUpdateSchema({
                      ...schema,
                      attributes: { ...schema.attributes, ctaLabel: e.target.value },
                    })
                  }
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="gb-panel-stack">
            <div className="gb-panel-section">
              <div className="gb-panel-header">
                <span className="gb-panel-title">Gutenberg Block JSON Schema</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="gb-mini-action-btn"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="gb-json-help">
                Định dạng chuẩn hóa tương thích với REST API và trình phân tích cú pháp khối của Gutenberg.
              </p>

              <textarea
                rows={18}
                className="gb-json-editor"
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                spellCheck={false}
              />

              {jsonError && <div className="gb-json-error">{jsonError}</div>}

              <button
                type="button"
                onClick={handleApplyJson}
                className="gb-apply-json-btn"
              >
                <RefreshCw size={14} />
                <span>Cập nhật Menu từ JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

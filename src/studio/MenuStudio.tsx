/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GutenbergMenuSchema, ViewportMode } from './types/menu';
import { INITIAL_GUTENBERG_MENU } from './data/defaultMenu';
import { PolymorphicMenuCanvas } from './components/PolymorphicMenuCanvas';
import { GutenbergInspector } from './components/GutenbergInspector';
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Download,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface MenuStudioProps {
  schema: GutenbergMenuSchema;
  onChange: (next: GutenbergMenuSchema) => void;
}

export function MenuStudio({ schema, onChange }: MenuStudioProps) {
  const [viewport, setViewport] = useState<ViewportMode>('widescreen');
  const [isEditorComposeMode, setIsEditorComposeMode] = useState<boolean>(true);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    schema.items[0]?.id || null
  );
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    schema.items[0]?.columns[0]?.id || null
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    schema.items[0]?.columns[0]?.blocks[1]?.id || null
  );

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    const targetItem = schema.items.find((it) => it.id === itemId);
    const firstCol = targetItem?.columns[0]?.id || null;
    setSelectedColumnId(firstCol);
    setSelectedBlockId(targetItem?.columns[0]?.blocks[0]?.id || null);
  };

  const handleSelectColumn = (itemId: string, colId: string) => {
    setSelectedItemId(itemId);
    setSelectedColumnId(colId);
  };

  const handleSelectBlock = (itemId: string, colId: string, blockId: string) => {
    setSelectedItemId(itemId);
    setSelectedColumnId(colId);
    setSelectedBlockId(blockId);
  };

  const handleDeleteTopItem = (itemId: string) => {
    if (schema.items.length <= 1) return;
    const filtered = schema.items.filter((it) => it.id !== itemId);
    onChange({ ...schema, items: filtered });
    if (selectedItemId === itemId) {
      setSelectedItemId(filtered[0]?.id || null);
    }
  };

  const handleExportJsonFile = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(schema, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'gutenberg-polymorphic-menu.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="gb-editor-shell">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Viewport Switches) — Zone 3 (Primary Actions) */}
      <header className="gb-topbar">
        <a
          href="#workspace"
          onClick={(e) => e.preventDefault()}
          className="gb-topbar-brand"
        >
          Gutenberg Polymorphic Menu Studio
        </a>

        <nav className="gb-topbar-nav" aria-label="Chế độ khung hình">
          {(
            [
              { id: 'widescreen', label: 'Widescreen', icon: Monitor },
              { id: 'desktop', label: 'Desktop', icon: Laptop },
              { id: 'tablet', label: 'Tablet', icon: Tablet },
              { id: 'mobile', label: 'Mobile', icon: Smartphone },
            ] as Array<{ id: ViewportMode; label: string; icon: any }>
          ).map((vp) => {
            const Icon = vp.icon;
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setViewport(vp.id)}
                className={`gb-viewport-btn ${viewport === vp.id ? 'is-active' : ''}`}
              >
                <Icon size={14} />
                <span>{vp.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="gb-topbar-actions">
          <button
            type="button"
            onClick={() => setIsEditorComposeMode((prev) => !prev)}
            className={`gb-mode-switch-btn ${!isEditorComposeMode ? 'is-live' : ''}`}
          >
            {isEditorComposeMode ? <Eye size={14} /> : <Edit3 size={14} />}
            <span>{isEditorComposeMode ? 'Xem thử trực tiếp' : 'Quay lại Compose'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJsonFile}
            className="gb-export-btn"
          >
            <Download size={14} />
            <span>Xuất JSON</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Gutenberg Workspace */}
      <div className="gb-workspace-grid">
        {/* Left Pane: Gutenberg Document Overview / Block List View */}
        <aside className="gb-outline-sidebar">
          <div className="gb-outline-header">
            <span className="gb-outline-title">Cấu trúc Cây Block (List View)</span>
            <span className="gb-tree-item-meta tabular-nums">
              {schema.items.length} mục
            </span>
          </div>

          <ul className="gb-tree-list">
            {schema.items.map((item) => {
              const isItemSelected = selectedItemId === item.id;
              return (
                <li
                  key={item.id}
                  className={`gb-tree-node ${isItemSelected ? 'is-selected' : ''}`}
                >
                  <div
                    className="gb-tree-item-row"
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div>
                      <div className="gb-tree-item-name">{item.label}</div>
                      <div className="gb-tree-item-meta">
                        {item.submenuType} · {item.layoutMode}
                      </div>
                    </div>

                    {schema.items.length > 1 && (
                      <button
                        type="button"
                        title="Xóa mục menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopItem(item.id);
                        }}
                        className="gb-toolbar-btn gb-toolbar-btn--danger"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {isItemSelected && item.columns.length > 0 && (
                    <ul className="gb-tree-children">
                      {item.columns.map((col) => (
                        <li key={col.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectColumn(item.id, col.id)}
                            className={`gb-tree-col-btn ${
                              selectedColumnId === col.id ? 'is-active' : ''
                            }`}
                          >
                            <span>{col.title}</span>
                            <span className="tabular-nums">{col.blocks.length} blk</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="gb-preset-box">
            <span className="gb-outline-title">Khôi phục Mẫu Chuẩn</span>
            <button
              type="button"
              onClick={() => {
                onChange(INITIAL_GUTENBERG_MENU);
                setSelectedItemId(INITIAL_GUTENBERG_MENU.items[0].id);
              }}
              className="gb-preset-btn"
            >
              <RotateCcw size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Khôi phục Cấu hình Mặc định
            </button>
          </div>
        </aside>

        {/* Center Pane: Direct Gutenberg Compose Canvas */}
        <main className="gb-canvas-area">
          <PolymorphicMenuCanvas
            schema={schema}
            viewport={viewport}
            isEditorComposeMode={isEditorComposeMode}
            selectedItemId={selectedItemId}
            selectedColumnId={selectedColumnId}
            selectedBlockId={selectedBlockId}
            onSelectItem={handleSelectItem}
            onSelectColumn={handleSelectColumn}
            onSelectBlock={handleSelectBlock}
            onUpdateSchema={onChange}
          />
        </main>

        {/* Right Pane: Gutenberg Settings Inspector */}
        <GutenbergInspector
          schema={schema}
          selectedItemId={selectedItemId}
          selectedColumnId={selectedColumnId}
          selectedBlockId={selectedBlockId}
          onUpdateSchema={onChange}
          onSelectBlock={handleSelectBlock}
        />
      </div>
    </div>
  );
}

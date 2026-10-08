/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CoreBlockItem } from '../types/menu';
import {
  ArrowRight,
  Search,
  FileText,
  Layers,
  BarChart3,
  Globe,
  BookOpen,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface CoreBlockRendererProps {
  block: CoreBlockItem;
  isSelected?: boolean;
  isEditorMode?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onMoveUp?: (e: React.MouseEvent) => void;
  onMoveDown?: (e: React.MouseEvent) => void;
}

export const CoreBlockRenderer: React.FC<CoreBlockRendererProps> = ({
  block,
  isSelected = false,
  isEditorMode = true,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const { blockName, attributes } = block;

  const renderArtworkSvg = (theme?: string) => {
    switch (theme) {
      case 'analytics':
        return (
          <div className="media-artwork media-artwork--analytics">
            <BarChart3 size={26} strokeWidth={1.6} />
            <span>Analytics Matrix · 2026</span>
          </div>
        );
      case 'commerce':
        return (
          <div className="media-artwork media-artwork--commerce">
            <Globe size={26} strokeWidth={1.6} />
            <span>Global Commerce Mesh</span>
          </div>
        );
      case 'editorial':
        return (
          <div className="media-artwork media-artwork--editorial">
            <BookOpen size={26} strokeWidth={1.6} />
            <span>Editorial System</span>
          </div>
        );
      default:
        return (
          <div className="media-artwork media-artwork--architecture">
            <Layers size={26} strokeWidth={1.6} />
            <span>Block Architecture Studio</span>
          </div>
        );
    }
  };

  const renderBlockContent = () => {
    switch (blockName) {
      case 'core/heading':
        return (
          <div className="gb-block-heading">
            <h4
              className={`gb-heading-text ${
                attributes.level === 3 ? 'gb-heading-text--lg' : ''
              }`}
            >
              {attributes.title || 'TIÊU ĐỀ NHÓM'}
            </h4>
          </div>
        );

      case 'core/navigation-link':
        return (
          <a
            href={attributes.url || '#'}
            onClick={(e) => e.preventDefault()}
            className="gb-block-nav-link"
          >
            <div className="gb-nav-link-top">
              <span className="gb-nav-link-title">{attributes.title || 'Mục điều hướng'}</span>
              {attributes.badgeText && (
                <span className="gb-nav-link-pro-tag">{attributes.badgeText}</span>
              )}
              {!attributes.description && !attributes.badgeText && (
                <ArrowRight size={13} className="gb-nav-link-arrow" />
              )}
            </div>
            {attributes.description && (
              <p className="gb-nav-link-desc">{attributes.description}</p>
            )}
          </a>
        );

      case 'core/paragraph':
        return (
          <p className="gb-block-paragraph">
            {attributes.description || 'Nội dung văn bản mô tả trong khối Gutenberg.'}
          </p>
        );

      case 'core/image':
        return (
          <div className="gb-block-image">
            <div
              className={`gb-image-frame aspect-${(attributes.imageAspect || '16:9').replace(':', '-')}`}
            >
              {renderArtworkSvg(attributes.imageTheme)}
            </div>
            <div className="gb-image-body">
              <div className="gb-image-title">{attributes.title || 'Tiêu điểm'}</div>
              {attributes.imageCaption && (
                <p className="gb-image-caption">{attributes.imageCaption}</p>
              )}
            </div>
          </div>
        );

      case 'core/buttons':
        return (
          <div className="gb-block-buttons">
            <button
              type="button"
              className={`gb-cta-btn ${
                attributes.buttonVariant === 'outline' ? 'gb-cta-btn--outline' : 'gb-cta-btn--primary'
              }`}
            >
              <span>{attributes.buttonLabel || 'Tìm hiểu thêm'}</span>
            </button>
          </div>
        );

      case 'core/search':
        return (
          <div className="gb-block-search">
            <Search size={14} className="gb-search-icon" />
            <input
              type="text"
              readOnly={isEditorMode}
              placeholder={attributes.placeholder || 'Tìm kiếm...'}
              className="gb-search-input"
            />
          </div>
        );

      case 'core/latest-posts':
        return (
          <div className="gb-block-posts">
            {attributes.title && <div className="gb-posts-header">{attributes.title}</div>}
            <ul className="gb-posts-list">
              {(attributes.postItems || []).map((post, idx) => (
                <li key={idx} className="gb-post-item">
                  <div className="gb-post-title">
                    <FileText size={13} className="gb-post-icon" />
                    <span>{post.title}</span>
                  </div>
                  <div className="gb-post-meta">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'core/separator':
        return <hr className="gb-block-separator" />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`gb-core-block-wrapper ${isSelected ? 'is-selected' : ''} ${
        isEditorMode ? 'is-editable' : ''
      }`}
      onClick={onSelect}
    >
      {isEditorMode && isSelected && (
        <div className="gb-block-floating-toolbar" onClick={(e) => e.stopPropagation()}>
          <span className="gb-toolbar-tag">{blockName}</span>
          <div className="gb-toolbar-actions">
            <button
              type="button"
              title="Di chuyển lên"
              onClick={onMoveUp}
              className="gb-toolbar-btn"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              title="Di chuyển xuống"
              onClick={onMoveDown}
              className="gb-toolbar-btn"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              title="Xóa khối"
              onClick={onDelete}
              className="gb-toolbar-btn gb-toolbar-btn--danger"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
      {renderBlockContent()}
    </div>
  );
};

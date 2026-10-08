/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GutenbergMenuSchema, CoreBlockType, CoreBlockItem } from '../types/menu';
import metadata from '../../block.json';

export const CORE_BLOCK_CATALOG: Array<{
  blockName: CoreBlockType;
  label: string;
  category: string;
  summary: string;
}> = [
  {
    blockName: 'core/navigation-link',
    label: 'Navigation Link',
    category: 'Navigation',
    summary: 'Mục điều hướng kèm tiêu đề phụ và đường dẫn URL.',
  },
  {
    blockName: 'core/heading',
    label: 'Heading',
    category: 'Text',
    summary: 'Tiêu đề phân nhóm cho cột Mega Menu hoặc danh sách.',
  },
  {
    blockName: 'core/paragraph',
    label: 'Paragraph',
    category: 'Text',
    summary: 'Đoạn văn mô tả ngắn giải thích nội dung phân khu.',
  },
  {
    blockName: 'core/image',
    label: 'Featured Media Card',
    category: 'Media',
    summary: 'Khối hình ảnh minh họa kèm chú thích trực quan.',
  },
  {
    blockName: 'core/buttons',
    label: 'Call to Action Button',
    category: 'Design',
    summary: 'Nút hành động điều hướng chính hoặc phụ trong Submenu.',
  },
  {
    blockName: 'core/latest-posts',
    label: 'Latest Posts',
    category: 'Widgets',
    summary: 'Danh sách bài viết mới tự động lấy từ CMS.',
  },
  {
    blockName: 'core/search',
    label: 'Search Input',
    category: 'Widgets',
    summary: 'Ô tìm kiếm nhanh nhúng trực tiếp vào Mega Menu.',
  },
  {
    blockName: 'core/separator',
    label: 'Separator Line',
    category: 'Design',
    summary: 'Đường kẻ mảnh phân tách các nhóm block trong cùng cột.',
  },
];

export function createDefaultCoreBlock(blockName: CoreBlockType): CoreBlockItem {
  const uid = `blk_${Math.random().toString(36).slice(2, 8)}`;
  switch (blockName) {
    case 'core/navigation-link':
      return {
        id: uid,
        blockName,
        attributes: {
          title: 'Tài liệu Kiến trúc API',
          description: 'Chuẩn kết nối REST & GraphQL cho hệ thống đa kênh',
          url: '/docs/api-architecture',
          badgeText: 'Mới',
        },
      };
    case 'core/heading':
      return {
        id: uid,
        blockName,
        attributes: {
          title: 'BUILD & ARCHITECTURE',
          level: 4,
        },
      };
    case 'core/paragraph':
      return {
        id: uid,
        blockName,
        attributes: {
          description: 'Mọi tính năng trong bản miễn phí, cộng thêm menu dính, chia tab, menu dọc và tùy biến từng mục.',
        },
      };
    case 'core/image':
      return {
        id: uid,
        blockName,
        attributes: {
          title: 'Bản phát hành Studio Q4',
          imageCaption: 'Trình dựng giao diện khối thời gian thực',
          imageAspect: '16:9',
          imageTheme: 'architecture',
          url: '/releases/q4',
        },
      };
    case 'core/buttons':
      return {
        id: uid,
        blockName,
        attributes: {
          buttonLabel: 'Compare Free and Pro',
          buttonVariant: 'primary',
          url: '/compare',
        },
      };
    case 'core/latest-posts':
      return {
        id: uid,
        blockName,
        attributes: {
          title: 'Bài viết biên tập mới',
          postItems: [
            { title: 'Tối ưu JSON Schema cho Block Editor', date: '12 Th10, 2026', category: 'Kỹ thuật' },
            { title: 'Thiết kế hệ thống Mega Menu đa thiết bị', date: '08 Th10, 2026', category: 'Giao diện' },
          ],
        },
      };
    case 'core/search':
      return {
        id: uid,
        blockName,
        attributes: {
          placeholder: 'Tìm nhanh tài liệu, block, hướng dẫn...',
        },
      };
    case 'core/separator':
      return {
        id: uid,
        blockName,
        attributes: {},
      };
  }
}

export const INITIAL_GUTENBERG_MENU = metadata.attributes.schema
  .default as unknown as GutenbergMenuSchema;

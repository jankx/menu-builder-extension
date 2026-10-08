<?php
/**
 * Frontend template for the Polymorphic Menu Builder block.
 *
 * Renders static, SEO-friendly HTML that mirrors the editor preview
 * markup (minus editor-only chrome), while all submenu panels ship in
 * the DOM hidden and are driven by src/view.js.
 *
 * @var array $schema The full menu schema (attributes + items).
 * @var \WP_Block $block The current block instance.
 */

if (!isset($schema) || !is_array($schema)) {
    return;
}

$menu_attributes = isset($schema['attributes']) && is_array($schema['attributes']) ? $schema['attributes'] : [];
$items = isset($schema['items']) && is_array($schema['items']) ? $schema['items'] : [];

if (!$items) {
    return;
}

$brand = (string) ($menu_attributes['brandName'] ?? 'Menu');
$cta_label = (string) ($menu_attributes['ctaLabel'] ?? 'Get Started');
$cta_url = (string) ($menu_attributes['ctaUrl'] ?? '#');
$orientation = ($menu_attributes['orientation'] ?? 'horizontal') === 'vertical' ? 'vertical' : 'horizontal';
$expand_mode = ($menu_attributes['verticalExpandMode'] ?? 'flyout-right') === 'accordion-inline' ? 'accordion-inline' : 'flyout-right';
$transform = (string) ($menu_attributes['mobileTransform'] ?? 'drawer-accordion');
$sticky = !empty($menu_attributes['stickyHeader']);
$gap_px = max(0, (int) ($menu_attributes['gapPx'] ?? 24));
$max_width = max(0, (int) ($menu_attributes['widescreenMaxWidth'] ?? 1120));

$is_push = in_array($transform, ['push-in-left', 'push-in-right'], true);
$push_direction = $transform === 'push-in-right' ? 'right' : 'left';
$is_drilldown = $transform === 'slide-drilldown';
$is_fullscreen = $transform === 'fullscreen-grid';

$anchor_id = '';
if (isset($block->attributes['anchor']) && preg_match('/^[A-Za-z][\w:.-]*$/', (string) $block->attributes['anchor'])) {
    $anchor_id = (string) $block->attributes['anchor'];
}

/* -------------------------------------------------------------------------
 * Inline SVG icons (lucide geometry, matches the editor preview).
 * ---------------------------------------------------------------------- */
$svg = static function (string $name, int $size = 16, string $class = ''): string {
    static $icons = [
        'box' => '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
        'user' => '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'rocket' => '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
        'menu' => '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
        'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'chevron-down' => '<path d="m6 9 6 6 6-6"/>',
        'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
        'chevron-left' => '<path d="m15 18-6-6 6-6"/>',
        'arrow-right' => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'search' => '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
        'file-text' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
        'layers' => '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
        'bar-chart' => '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
        'globe' => '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
        'book-open' => '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    ];

    if (!isset($icons[$name])) {
        return '';
    }

    $class_attr = $class !== '' ? ' class="' . esc_attr($class) . '"' : '';

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $size . '" height="' . $size . '"'
        . ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
        . ' stroke-linecap="round" stroke-linejoin="round"' . $class_attr
        . ' aria-hidden="true" focusable="false">' . $icons[$name] . '</svg>';
};

/* -------------------------------------------------------------------------
 * Core block content (mirrors CoreBlockRenderer with editor chrome off).
 * ---------------------------------------------------------------------- */
$render_core_block = static function (array $blk) use ($svg): string {
    $name = (string) ($blk['blockName'] ?? '');
    $att = isset($blk['attributes']) && is_array($blk['attributes']) ? $blk['attributes'] : [];
    $inner = '';

    switch ($name) {
        case 'core/heading':
            $is_large = (int) ($att['level'] ?? 4) === 3;
            $title = (string) ($att['title'] ?? 'TIÊU ĐỀ NHÓM');
            $inner = '<div class="gb-block-heading"><h4 class="gb-heading-text'
                . ($is_large ? ' gb-heading-text--lg' : '') . '">'
                . esc_html($title) . '</h4></div>';
            break;

        case 'core/navigation-link':
            $badge = (string) ($att['badgeText'] ?? '');
            $desc = (string) ($att['description'] ?? '');
            $inner = '<a href="' . esc_url((string) ($att['url'] ?? '#')) . '" class="gb-block-nav-link">'
                . '<div class="gb-nav-link-top">'
                . '<span class="gb-nav-link-title">' . esc_html((string) ($att['title'] ?? 'Mục điều hướng')) . '</span>';
            if ($badge !== '') {
                $inner .= '<span class="gb-nav-link-pro-tag">' . esc_html($badge) . '</span>';
            } elseif ($desc === '') {
                $inner .= $svg('arrow-right', 13, 'gb-nav-link-arrow');
            }
            $inner .= '</div>';
            if ($desc !== '') {
                $inner .= '<p class="gb-nav-link-desc">' . esc_html($desc) . '</p>';
            }
            $inner .= '</a>';
            break;

        case 'core/paragraph':
            $inner = '<p class="gb-block-paragraph">'
                . esc_html((string) ($att['description'] ?? 'Nội dung văn bản mô tả trong khối Gutenberg.'))
                . '</p>';
            break;

        case 'core/image':
            $aspect = str_replace(':', '-', (string) ($att['imageAspect'] ?? '16:9'));
            $theme = (string) ($att['imageTheme'] ?? '');
            $artworks = [
                'analytics' => ['bar-chart', 'Analytics Matrix · 2026'],
                'commerce' => ['globe', 'Global Commerce Mesh'],
                'editorial' => ['book-open', 'Editorial System'],
            ];
            $artwork = $artworks[$theme] ?? ['layers', 'Block Architecture Studio'];
            $inner = '<div class="gb-block-image">'
                . '<div class="gb-image-frame aspect-' . esc_attr($aspect) . '">'
                . '<div class="media-artwork media-artwork--' . esc_attr($theme !== '' && isset($artworks[$theme]) ? $theme : 'architecture') . '">'
                . $svg($artwork[0], 26) . '<span>' . esc_html($artwork[1]) . '</span>'
                . '</div></div>'
                . '<div class="gb-image-body">'
                . '<div class="gb-image-title">' . esc_html((string) ($att['title'] ?? 'Tiêu điểm')) . '</div>';
            if (!empty($att['imageCaption'])) {
                $inner .= '<p class="gb-image-caption">' . esc_html((string) $att['imageCaption']) . '</p>';
            }
            $inner .= '</div></div>';
            break;

        case 'core/buttons':
            $outline = ($att['buttonVariant'] ?? 'primary') === 'outline';
            $inner = '<div class="gb-block-buttons">'
                . '<button type="button" class="gb-cta-btn '
                . ($outline ? 'gb-cta-btn--outline' : 'gb-cta-btn--primary') . '">'
                . '<span>' . esc_html((string) ($att['buttonLabel'] ?? 'Tìm hiểu thêm')) . '</span>'
                . '</button></div>';
            break;

        case 'core/search':
            $inner = '<div class="gb-block-search">'
                . $svg('search', 14, 'gb-search-icon')
                . '<input type="text" class="gb-search-input" placeholder="'
                . esc_attr((string) ($att['placeholder'] ?? 'Tìm kiếm...')) . '" />'
                . '</div>';
            break;

        case 'core/latest-posts':
            $inner = '';
            if (!empty($att['title'])) {
                $inner .= '<div class="gb-posts-header">' . esc_html((string) $att['title']) . '</div>';
            }
            $inner .= '<ul class="gb-posts-list">';
            $post_items = isset($att['postItems']) && is_array($att['postItems']) ? $att['postItems'] : [];
            foreach ($post_items as $post) {
                $inner .= '<li class="gb-post-item">'
                    . '<div class="gb-post-title">' . $svg('file-text', 13, 'gb-post-icon')
                    . '<span>' . esc_html((string) ($post['title'] ?? '')) . '</span></div>'
                    . '<div class="gb-post-meta">'
                    . '<span>' . esc_html((string) ($post['category'] ?? '')) . '</span>'
                    . '<span aria-hidden="true">·</span>'
                    . '<span class="tabular-nums">' . esc_html((string) ($post['date'] ?? '')) . '</span>'
                    . '</div></li>';
            }
            $inner .= '</ul>';
            break;

        case 'core/separator':
            $inner = '<hr class="gb-block-separator" />';
            break;
    }

    return '<div class="gb-core-block-wrapper">' . $inner . '</div>';
};

/* -------------------------------------------------------------------------
 * Submenu panels (mega / half-mega / dropdown grid, or flyout).
 * ---------------------------------------------------------------------- */
$render_submenu = static function (array $item, string $anchor) use ($svg, $render_core_block): string {
    $type = (string) ($item['submenuType'] ?? 'none');

    if ($type === 'none') {
        return '';
    }

    if ($type === 'flyout') {
        $flyout_items = isset($item['flyoutItems']) && is_array($item['flyoutItems']) ? $item['flyoutItems'] : [];

        $html = '<div class="poly-submenu poly-submenu--flyout anchor-' . esc_attr($anchor) . '">'
            . '<div class="poly-flyout-shell">'
            . '<div class="poly-flyout-primary">'
            . '<div class="poly-flyout-kicker">Nhánh điều hướng đa tầng</div>';

        foreach ($flyout_items as $index => $branch) {
            $branch_id = (string) ($branch['id'] ?? 'branch-' . $index);
            $html .= '<div class="poly-flyout-row' . ($index === 0 ? ' is-active' : '') . '"'
                . ' data-flyout-row="' . esc_attr($branch_id) . '">'
                . '<div class="poly-flyout-row-text">'
                . '<span class="poly-flyout-row-label">' . esc_html((string) ($branch['label'] ?? '')) . '</span>';
            if (!empty($branch['description'])) {
                $html .= '<span class="poly-flyout-row-desc">' . esc_html((string) $branch['description']) . '</span>';
            }
            $html .= '</div>' . $svg('chevron-right', 15) . '</div>';
        }

        $html .= '</div>';

        foreach ($flyout_items as $index => $branch) {
            $branch_id = (string) ($branch['id'] ?? 'branch-' . $index);
            $html .= '<div class="poly-flyout-secondary' . ($index === 0 ? ' is-active' : '') . '"'
                . ' data-flyout-panel="' . esc_attr($branch_id) . '">'
                . '<div class="poly-flyout-kicker">' . esc_html((string) ($branch['label'] ?? '')) . '</div>'
                . '<ul class="poly-flyout-sublist">';
            $children = isset($branch['children']) && is_array($branch['children']) ? $branch['children'] : [];
            foreach ($children as $child) {
                $html .= '<li><a href="' . esc_url((string) ($child['url'] ?? '#')) . '" class="poly-flyout-sublink">'
                    . '<span>' . esc_html((string) ($child['label'] ?? '')) . '</span>';
                if (!empty($child['meta'])) {
                    $html .= '<span class="poly-flyout-meta">' . esc_html((string) $child['meta']) . '</span>';
                }
                $html .= '</a></li>';
            }
            $html .= '</ul>';

            $columns = isset($item['columns']) && is_array($item['columns']) ? $item['columns'] : [];
            if (!empty($columns[0]['blocks']) && is_array($columns[0]['blocks'])) {
                $html .= '<div class="poly-flyout-embedded-blocks">';
                foreach ($columns[0]['blocks'] as $blk) {
                    $html .= $render_core_block($blk);
                }
                $html .= '</div>';
            }

            $html .= '</div>';
        }

        return $html . '</div></div>';
    }

    $modifier = $type === 'mega'
        ? 'poly-submenu--mega'
        : ($type === 'half-mega' ? 'poly-submenu--half-mega' : 'poly-submenu--dropdown');
    $layout = (string) ($item['layoutMode'] ?? 'list');
    $columns = isset($item['columns']) && is_array($item['columns']) ? $item['columns'] : [];
    $grid_columns = ($type === 'dropdown' || $layout === 'list')
        ? '1fr'
        : 'repeat(' . count($columns) . ', minmax(0, 1fr))';

    $html = '<div class="poly-submenu ' . esc_attr($modifier) . ' anchor-' . esc_attr($anchor)
        . ' layout-' . esc_attr($layout) . '">'
        . '<div class="poly-submenu-grid" style="grid-template-columns:' . esc_attr($grid_columns) . '">';

    foreach ($columns as $col) {
        $html .= '<div class="poly-submenu-column'
            . (!empty($col['isHighlightedCard']) ? ' is-promo-card' : '') . '">'
            . '<div class="poly-column-blocks">';
        $blocks = isset($col['blocks']) && is_array($col['blocks']) ? $col['blocks'] : [];
        foreach ($blocks as $blk) {
            $html .= $render_core_block($blk);
        }
        $html .= '</div></div>';
    }

    $html .= '</div>';

    if (!empty($item['featuredNote'])) {
        $html .= '<div class="poly-submenu-footer">'
            . '<span class="poly-submenu-footer-note">' . esc_html((string) $item['featuredNote']) . '</span>'
            . '<span class="poly-submenu-footer-meta">' . esc_html(strtoupper($type))
            . ' · ' . count($columns) . ' cột</span>'
            . '</div>';
    }

    return $html . '</div>';
};

/* -------------------------------------------------------------------------
 * Compact mobile content (accordion list, plus drilldown details).
 * ---------------------------------------------------------------------- */
$render_compact_columns = static function (array $columns) use ($render_core_block): string {
    $html = '';
    foreach ($columns as $col) {
        $html .= '<div class="poly-compact-col-box'
            . (!empty($col['isHighlightedCard']) ? ' is-promo-card' : '') . '">'
            . '<div class="poly-compact-col-label">' . esc_html((string) ($col['title'] ?? '')) . '</div>';
        $blocks = isset($col['blocks']) && is_array($col['blocks']) ? $col['blocks'] : [];
        foreach ($blocks as $blk) {
            $html .= $render_core_block($blk);
        }
        $html .= '</div>';
    }
    return $html;
};

$render_accordion = static function () use ($items, $is_drilldown, $svg, $render_compact_columns): string {
    $html = '<div class="poly-accordion-list"' . ($is_drilldown ? ' data-drill-root' : '') . '>';

    foreach ($items as $item) {
        $type = (string) ($item['submenuType'] ?? 'none');
        $has_panel = $type !== 'none';
        $label = esc_html((string) ($item['label'] ?? ''));
        $item_id = esc_attr((string) ($item['id'] ?? ''));

        $html .= '<div class="poly-accordion-item" data-item-id="' . $item_id . '">';

        if ($has_panel) {
            $action = $is_drilldown ? 'drill-open' : 'accordion-toggle';
            $html .= '<button type="button" class="poly-accordion-trigger" data-action="' . $action . '">'
                . '<div class="poly-accordion-trigger-left">'
                . '<span class="poly-accordion-title">' . $label . '</span>'
                . '<span class="poly-accordion-meta">' . esc_html($type) . '</span>'
                . '</div>'
                . $svg('chevron-down', 16, 'poly-accordion-chevron')
                . '</button>';
        } else {
            $html .= '<a href="' . esc_url((string) ($item['url'] ?? '#')) . '" class="poly-accordion-trigger">'
                . '<div class="poly-accordion-trigger-left">'
                . '<span class="poly-accordion-title">' . $label . '</span>'
                . '</div></a>';
        }

        if ($has_panel && !$is_drilldown) {
            $columns = isset($item['columns']) && is_array($item['columns']) ? $item['columns'] : [];
            $html .= '<div class="poly-accordion-body">' . $render_compact_columns($columns) . '</div>';
        }

        $html .= '</div>';
    }

    return $html . '</div>';
};

$render_drill_details = static function () use ($items, $svg, $render_compact_columns): string {
    $html = '';

    foreach ($items as $item) {
        if (($item['submenuType'] ?? 'none') === 'none') {
            continue;
        }

        $columns = isset($item['columns']) && is_array($item['columns']) ? $item['columns'] : [];
        $html .= '<div class="poly-drill-detail" data-drill-id="' . esc_attr((string) ($item['id'] ?? '')) . '" hidden>'
            . '<button type="button" class="poly-drill-back" data-action="drill-back">'
            . $svg('chevron-left', 16) . '<span>Quay lại Menu chính</span></button>'
            . '<h3 class="poly-drill-title">' . esc_html((string) ($item['label'] ?? '')) . '</h3>'
            . '<div class="poly-compact-columns">' . $render_compact_columns($columns) . '</div>'
            . '</div>';
    }

    return $html;
};

$accordion_html = $render_accordion();
$drill_details_html = $is_drilldown ? $render_drill_details() : '';

/* -------------------------------------------------------------------------
 * Root + horizontal header.
 * ---------------------------------------------------------------------- */
$root_classes = 'wp-block-jankx-polymorphic-menu poly-frontend poly-frontend--' . $orientation
    . ($sticky ? ' poly-frontend--sticky' : '');

$root_attrs = 'class="' . esc_attr($root_classes) . '"'
    . ' data-poly-menu'
    . ' data-orientation="' . esc_attr($orientation) . '"'
    . ' data-transform="' . esc_attr($transform) . '"';
if ($anchor_id !== '') {
    $root_attrs .= ' id="' . esc_attr($anchor_id) . '"';
}

$has_panel_items = array_filter($items, static fn ($it) => ($it['submenuType'] ?? 'none') !== 'none');

$header_style = $max_width > 0
    ? ' style="max-width:' . $max_width . 'px;margin-inline:auto;"'
    : '';

$login_url = function_exists('wp_login_url') ? wp_login_url() : '#';

$horizontal = '<header class="poly-site-header"' . $header_style . '>'
    . '<a href="' . esc_url(home_url('/')) . '" class="poly-brand-lockup">'
    . '<span class="poly-brand-cube">' . $svg('box', 18) . '</span>'
    . '<span class="poly-brand-wordmark">' . esc_html($brand) . '</span>'
    . '</a>'
    . '<nav class="poly-primary-nav" style="gap:' . $gap_px . 'px">';

foreach ($items as $item) {
    $type = (string) ($item['submenuType'] ?? 'none');
    $has_panel = $type !== 'none';
    $trigger = ($item['trigger'] ?? 'hover') === 'click' ? 'click' : 'hover';
    $item_id = esc_attr((string) ($item['id'] ?? ''));

    $horizontal .= '<div class="poly-nav-item-wrap" data-item-id="' . $item_id . '" data-trigger="' . $trigger . '">';

    if ($has_panel) {
        $horizontal .= '<button type="button" class="poly-nav-link" data-action="nav-toggle">'
            . '<span>' . esc_html((string) ($item['label'] ?? '')) . '</span>'
            . $svg('chevron-down', 14, 'poly-nav-chevron')
            . '</button>';
    } else {
        $horizontal .= '<a href="' . esc_url((string) ($item['url'] ?? '#')) . '" class="poly-nav-link">'
            . '<span>' . esc_html((string) ($item['label'] ?? '')) . '</span>'
            . '</a>';
    }

    if (in_array($type, ['dropdown', 'flyout', 'half-mega'], true)) {
        $horizontal .= $render_submenu($item, 'item');
    }

    $horizontal .= '</div>';
}

$horizontal .= '</nav>'
    . '<div class="poly-header-actions">'
    . '<a href="' . esc_url($login_url) . '" class="poly-login-link">' . $svg('user', 14) . '<span>Login</span></a>'
    . '<a href="' . esc_url($cta_url) . '" class="poly-header-cta">' . $svg('rocket', 14)
    . '<span>' . esc_html($cta_label) . '</span></a>'
    . '<button type="button" class="poly-mobile-toggle-btn" data-action="toggle-compact"'
    . ' aria-expanded="false" aria-label="Mở menu điều hướng">'
    . '<span class="poly-toggle-open">' . $svg('menu', 17) . '<span>Mở Menu</span></span>'
    . '<span class="poly-toggle-close">' . $svg('x', 17) . '<span>Đóng Menu</span></span>'
    . '</button>'
    . '</div>';

// Mega panels anchor directly under the header bar (editor parity).
foreach ($items as $item) {
    if (($item['submenuType'] ?? 'none') === 'mega') {
        $horizontal .= '<div data-mega-id="' . esc_attr((string) ($item['id'] ?? '')) . '" style="display:contents">'
            . $render_submenu($item, 'bar') . '</div>';
    }
}

$horizontal .= '</header>';

/* -------------------------------------------------------------------------
 * Vertical sidebar (rendered alongside the header; CSS switches by width).
 * ---------------------------------------------------------------------- */
$vertical = '';

if ($orientation === 'vertical') {
    $expand_right = $expand_mode === 'flyout-right';

    $vertical = '<aside class="poly-vertical-sidebar">'
        . '<div class="poly-vertical-brand">'
        . '<span class="poly-brand-cube">' . $svg('box', 18) . '</span>'
        . '<span class="poly-brand-wordmark">' . esc_html($brand) . '</span>'
        . '</div>'
        . '<div class="poly-vertical-kicker">VERTICAL NAVIGATION (' . esc_html($expand_mode) . ')</div>'
        . '<nav class="poly-vertical-nav">';

    foreach ($items as $item) {
        $type = (string) ($item['submenuType'] ?? 'none');
        $has_panel = $type !== 'none';
        $trigger = ($item['trigger'] ?? 'hover') === 'click' ? 'click' : 'hover';
        $item_id = esc_attr((string) ($item['id'] ?? ''));

        $vertical .= '<div class="poly-vertical-item-wrap" data-item-id="' . $item_id . '" data-trigger="' . $trigger . '">';

        if ($has_panel) {
            $vertical .= '<button type="button" class="poly-vertical-link">'
                . '<div class="poly-vertical-link-left">'
                . '<span class="poly-vertical-link-title">' . esc_html((string) ($item['label'] ?? '')) . '</span>'
                . '<span class="poly-vertical-link-badge">' . esc_html($type) . '</span>'
                . '</div>'
                . ($expand_right
                    ? $svg('chevron-right', 15)
                    : $svg('chevron-down', 15, 'poly-nav-chevron'))
                . '</button>';
        } else {
            $vertical .= '<a href="' . esc_url((string) ($item['url'] ?? '#')) . '" class="poly-vertical-link">'
                . '<div class="poly-vertical-link-left">'
                . '<span class="poly-vertical-link-title">' . esc_html((string) ($item['label'] ?? '')) . '</span>'
                . '<span class="poly-vertical-link-badge">' . esc_html($type) . '</span>'
                . '</div></a>';
        }

        if ($has_panel) {
            $vertical .= '<div class="' . ($expand_right ? 'poly-vertical-flyout-pane' : 'poly-vertical-accordion-pane') . '">'
                . $render_submenu($item, 'vertical') . '</div>';
        }

        $vertical .= '</div>';
    }

    $vertical .= '</nav>'
        . '<div class="poly-vertical-footer">'
        . '<a href="' . esc_url($cta_url) . '" class="poly-header-cta" style="width:100%">'
        . $svg('rocket', 14) . '<span>' . esc_html($cta_label) . '</span></a>'
        . '</div></aside>';
}

/* -------------------------------------------------------------------------
 * Mobile surfaces: push drawer or inline compact panel.
 * ---------------------------------------------------------------------- */
$mobile = '';

if ($is_push) {
    $mobile = '<aside class="poly-push-drawer poly-push-drawer--' . esc_attr($push_direction) . '" data-push-drawer>'
        . '<div class="poly-push-drawer-header">'
        . '<div class="poly-brand-lockup">'
        . '<span class="poly-brand-cube">' . $svg('box', 16) . '</span>'
        . '<span class="poly-brand-wordmark">' . esc_html($brand) . '</span>'
        . '</div>'
        . '<button type="button" class="poly-drawer-close-btn" data-action="close-push" aria-label="Đóng Push Menu">'
        . $svg('x', 16) . '</button>'
        . '</div>'
        . '<div class="poly-push-drawer-tag">Push-In Off-Canvas Menu (' . esc_html(strtoupper($push_direction)) . ')</div>'
        . '<div class="poly-push-drawer-body">' . $accordion_html . '</div>'
        . '<div class="poly-push-drawer-footer">'
        . '<a href="' . esc_url($cta_url) . '" class="poly-header-cta" style="width:100%">'
        . $svg('rocket', 14) . '<span>' . esc_html($cta_label) . '</span></a>'
        . '</div></aside>'
        . '<div class="poly-scrim" data-scrim></div>';
} else {
    $mobile = '<div class="poly-compact-surface'
        . ($is_fullscreen ? ' poly-compact-surface--fullscreen' : '') . '" data-compact-surface>'
        . '<button type="button" class="poly-compact-close-btn" data-action="close-compact">'
        . $svg('x', 16) . '<span>Đóng</span></button>'
        . '<div class="poly-drill-kicker">Menu Di động (' . esc_html($transform) . ')</div>'
        . $accordion_html
        . $drill_details_html
        . '</div>';
}

echo '<div ' . $root_attrs . '>';
echo $horizontal;
echo $vertical;
echo $mobile;
echo '</div>';

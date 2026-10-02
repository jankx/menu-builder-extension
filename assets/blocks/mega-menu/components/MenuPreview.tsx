import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup } from '@wordpress/components';
import { Icons, DynamicIcon } from './Icons';
import { MenuItem } from './TreeEditor';

interface MenuPreviewProps {
    items: MenuItem[];
    selectedId?: string | null;
    onSelectItem?: (id: string) => void;
}

const GRID_COLS_MAP: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
};

const BADGE_COLOR_MAP: Record<string, string> = {
    red: 'badge-red',
    emerald: 'badge-emerald',
    amber: 'badge-amber',
    purple: 'badge-purple',
    blue: 'badge-blue'
};

const getBadgeClasses = (color?: string) => {
    if (color && BADGE_COLOR_MAP[color]) return BADGE_COLOR_MAP[color];
    return BADGE_COLOR_MAP.blue;
};

type DemoLayoutMode = 'storefront' | 'vertical' | 'horizontal';

const MenuPreview = ({ items, selectedId, onSelectItem }: MenuPreviewProps) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [demoMode, setDemoMode] = useState<DemoLayoutMode>('storefront');
    const [pinnedOpen, setPinnedOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [verticalExpandStyle, setVerticalExpandStyle] = useState<'flyout' | 'accordion'>('flyout');

    return (
        <div className="menu-preview">
            <div className="menu-preview-toolbar">
                <div className="menu-preview-modes">
                    <span className="menu-preview-label">
                        <Icon icon={Icons.Eye} size={15} />
                        {__('View:', 'jankx')}
                    </span>
                    <ButtonGroup>
                        <Button
                            icon={Icons.Store}
                            variant={demoMode === 'storefront' ? 'primary' : 'secondary'}
                            onClick={() => setDemoMode('storefront')}
                        >
                            {__('Storefront', 'jankx')}
                        </Button>
                        <Button
                            icon={Icons.PanelLeft}
                            variant={demoMode === 'vertical' ? 'primary' : 'secondary'}
                            onClick={() => setDemoMode('vertical')}
                        >
                            {__('Vertical', 'jankx')}
                        </Button>
                        <Button
                            icon={Icons.Rows}
                            variant={demoMode === 'horizontal' ? 'primary' : 'secondary'}
                            onClick={() => setDemoMode('horizontal')}
                        >
                            {__('Horizontal', 'jankx')}
                        </Button>
                    </ButtonGroup>
                    {demoMode === 'vertical' && (
                        <ButtonGroup>
                            <Button
                                variant={verticalExpandStyle === 'flyout' ? 'primary' : 'secondary'}
                                onClick={() => setVerticalExpandStyle('flyout')}
                                isSmall
                            >
                                {__('Flyout', 'jankx')}
                            </Button>
                            <Button
                                variant={verticalExpandStyle === 'accordion' ? 'primary' : 'secondary'}
                                onClick={() => setVerticalExpandStyle('accordion')}
                                isSmall
                            >
                                {__('Accordion', 'jankx')}
                            </Button>
                        </ButtonGroup>
                    )}
                </div>
                <div className="menu-preview-controls">
                    <Button
                        icon={pinnedOpen ? Icons.Pin : Icons.PinOff}
                        variant={pinnedOpen ? 'primary' : 'secondary'}
                        onClick={() => setPinnedOpen(!pinnedOpen)}
                    >
                        {pinnedOpen ? __('Pinned', 'jankx') : __('Pin', 'jankx')}
                    </Button>
                    <ButtonGroup>
                        <Button icon={Icons.Monitor} variant={viewMode === 'desktop' ? 'primary' : 'secondary'} onClick={() => setViewMode('desktop')} label={__('Desktop', 'jankx')} />
                        <Button icon={Icons.Tablet} variant={viewMode === 'tablet' ? 'primary' : 'secondary'} onClick={() => setViewMode('tablet')} label={__('Tablet', 'jankx')} />
                        <Button icon={Icons.Smartphone} variant={viewMode === 'mobile' ? 'primary' : 'secondary'} onClick={() => setViewMode('mobile')} label={__('Mobile', 'jankx')} />
                    </ButtonGroup>
                </div>
            </div>

            <div className={`menu-preview-viewport menu-preview-${viewMode}`}>
                <div className="menu-preview-header">
                    {(viewMode === 'mobile' || viewMode === 'tablet') && (
                        <Button icon={Icons.Menu} onClick={() => setIsMobileOpen(true)} label={__('Open menu', 'jankx')} />
                    )}
                    <div className="menu-preview-brand">
                        <div className="menu-preview-logo">
                            <Icon icon={Icons.Layers} size={18} />
                        </div>
                        <span className="menu-preview-brand-name">TechStore</span>
                    </div>
                    {viewMode === 'desktop' && (
                        <div className="menu-preview-category">
                            <Button
                                icon={Icons.Menu}
                                variant={isCategoryDropdownOpen ? 'primary' : 'secondary'}
                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                            >
                                {__('Categories', 'jankx')}
                                <Icon icon={Icons.ChevronDown} size={13} />
                            </Button>
                            {isCategoryDropdownOpen && (
                                <div className="menu-preview-category-dropdown">
                                    <VerticalMenuList
                                        items={items}
                                        selectedId={selectedId}
                                        isPinned={pinnedOpen}
                                        onSelect={(id) => onSelectItem && onSelectItem(id)}
                                        expandMode="flyout"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {viewMode === 'desktop' && (
                        <nav className="menu-preview-nav">
                            {items.map((item) => (
                                <TopLevelNavItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedId === item.id}
                                    isPinned={pinnedOpen}
                                    onSelect={() => onSelectItem && onSelectItem(item.id)}
                                />
                            ))}
                        </nav>
                    )}
                    <div className="menu-preview-actions">
                        <Button icon={Icons.Sparkles} label={__('Search', 'jankx')} />
                        <Button variant="primary">{__('Sign In', 'jankx')}</Button>
                    </div>
                </div>

                {demoMode === 'storefront' && (
                    <div className="menu-preview-storefront">
                        <div className="menu-preview-notice">
                            <span className="menu-preview-notice-dot" />
                            <span>
                                <strong>{__('E-commerce Vertical Menu:', 'jankx')}</strong>
                                {__('Hover over items in the left category column to see flyout/mega grid overlay!', 'jankx')}
                            </span>
                        </div>
                        <div className="menu-preview-storefront-grid">
                            <div className="menu-preview-vertical-menu">
                                <div className="menu-preview-vertical-header">
                                    <Icon icon={Icons.LayoutList} size={16} />
                                    <span>{__('Categories', 'jankx')}</span>
                                    <span className="menu-preview-count">{items.length}</span>
                                </div>
                                <VerticalMenuList
                                    items={items}
                                    selectedId={selectedId}
                                    isPinned={pinnedOpen}
                                    onSelect={onSelectItem}
                                    expandMode="flyout"
                                />
                            </div>
                            <div className="menu-preview-hero">
                                <div className="menu-preview-hero-content">
                                    <div className="menu-preview-hero-badge">
                                        <Icon icon={Icons.Zap} size={13} />
                                        <span>{__('TECH SALE 2026', 'jankx')}</span>
                                    </div>
                                    <h2>{__('Elevate your digital experience', 'jankx')}</h2>
                                    <p>{__('Left column menu supports full structure: Mega Menu 4-column grid, Dropdown Grid 2-column or multi-level Flyout.', 'jankx')}</p>
                                    <div className="menu-preview-hero-actions">
                                        <Button variant="primary">
                                            {__('Explore Now', 'jankx')}
                                            <Icon icon={Icons.ChevronRight} size={14} />
                                        </Button>
                                        <Button variant="secondary">{__('Pricing', 'jankx')}</Button>
                                    </div>
                                </div>
                                <div className="menu-preview-hero-features">
                                    <div className="menu-preview-feature">
                                        <Icon icon={Icons.Check} size={14} />
                                        <span>{__('12M Warranty', 'jankx')}</span>
                                    </div>
                                    <div className="menu-preview-feature">
                                        <Icon icon={Icons.Check} size={14} />
                                        <span>{__('2H Express Delivery', 'jankx')}</span>
                                    </div>
                                    <div className="menu-preview-feature">
                                        <Icon icon={Icons.Check} size={14} />
                                        <span>{__('0% Installment', 'jankx')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="menu-preview-feature-cards">
                                <div className="menu-preview-feature-card">
                                    <div className="menu-preview-feature-icon">
                                        <Icon icon={Icons.PanelLeft} size={18} />
                                    </div>
                                    <div>
                                        <div className="menu-preview-feature-title">{__('Vertical Flyout Menu', 'jankx')}</div>
                                        <div className="menu-preview-feature-desc">{__('Smooth submenu flyout to the right', 'jankx')}</div>
                                    </div>
                                </div>
                                <div className="menu-preview-feature-card">
                                    <div className="menu-preview-feature-icon">
                                        <Icon icon={Icons.Grid} size={18} />
                                    </div>
                                    <div>
                                        <div className="menu-preview-feature-title">{__('Mega Menu 4 Columns', 'jankx')}</div>
                                        <div className="menu-preview-feature-desc">{__('Images, detailed categories', 'jankx')}</div>
                                    </div>
                                </div>
                                <div className="menu-preview-feature-card">
                                    <div className="menu-preview-feature-icon">
                                        <Icon icon={Icons.Boxes} size={18} />
                                    </div>
                                    <div>
                                        <div className="menu-preview-feature-title">{__('Multi-level Flyout', 'jankx')}</div>
                                        <div className="menu-preview-feature-desc">{__('Unlimited deep hierarchy', 'jankx')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {demoMode === 'vertical' && (
                    <div className="menu-preview-vertical">
                        <div className="menu-preview-vertical-info">
                            <Icon icon={Icons.PanelLeft} size={16} />
                            <span>
                                {__('Vertical Sidebar Mode', 'jankx')}:{' '}
                                <strong>{verticalExpandStyle === 'flyout' ? __('Flyout to right', 'jankx') : __('Accordion expand', 'jankx')}</strong>
                            </span>
                        </div>
                        <div className="menu-preview-vertical-grid">
                            <div className="menu-preview-vertical-menu">
                                <div className="menu-preview-vertical-header">
                                    <Icon icon={Icons.FolderTree} size={16} />
                                    <span>{__('Vertical Menu', 'jankx')}</span>
                                    <span className="menu-preview-count">{items.length}</span>
                                </div>
                                <VerticalMenuList
                                    items={items}
                                    selectedId={selectedId}
                                    isPinned={pinnedOpen}
                                    onSelect={onSelectItem}
                                    expandMode={verticalExpandStyle}
                                />
                            </div>
                            <div className="menu-preview-vertical-info-panel">
                                <h3>
                                    <Icon icon={Icons.Sliders} size={16} />
                                    {__('Vertical Menu Features:', 'jankx')}
                                </h3>
                                <ul>
                                    <li>
                                        <Icon icon={Icons.Check} size={14} />
                                        <span><strong>{__('Multi-direction flyout:', 'jankx')}</strong> {__('Hover to open submenu panel to the right with auto-width based on columns.', 'jankx')}</span>
                                    </li>
                                    <li>
                                        <Icon icon={Icons.Check} size={14} />
                                        <span><strong>{__('Accordion support:', 'jankx')}</strong> {__('Switch to inline expand mode, ideal for Dashboard / CMS admin.', 'jankx')}</span>
                                    </li>
                                    <li>
                                        <Icon icon={Icons.Check} size={14} />
                                        <span><strong>{__('Two-way sync:', 'jankx')}</strong> {__('All changes to labels, icons, badges, grid layout or images reflect instantly.', 'jankx')}</span>
                                    </li>
                                </ul>
                                <div className="menu-preview-tip">
                                    {__('Tip: Enable "Pin" in the toolbar to keep submenu open while editing.', 'jankx')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {demoMode === 'horizontal' && (
                    <div className="menu-preview-horizontal">
                        <div className="menu-preview-horizontal-info">
                            <div className="menu-preview-horizontal-info-content">
                                <span className="menu-preview-horizontal-badge">
                                    <Icon icon={Icons.Rows} size={13} />
                                    {__('Horizontal Navbar', 'jankx')}
                                </span>
                                <h2>{__('Traditional horizontal navigation', 'jankx')}</h2>
                                <p>
                                    {__('Hover over menu items to see full-width Mega Menu, 2-column Dropdown Grid or multi-level Flyout. You can also click "Categories" to open vertical dropdown menu!', 'jankx')}
                                </p>
                            </div>
                            <div className="menu-preview-horizontal-demo">
                                <Icon icon={Icons.Grid} size={32} />
                                <span>{__('Grid Layout for Submenu', 'jankx')}</span>
                                <span className="menu-preview-horizontal-demo-sub">{__('Custom 1-6 columns', 'jankx')}</span>
                            </div>
                        </div>
                        <div className="menu-preview-horizontal-features">
                            <div className="menu-preview-horizontal-feature">
                                <div className="menu-preview-horizontal-feature-icon">
                                    <Icon icon={Icons.ChevronDown} size={18} />
                                </div>
                                <h4>{__('Standard Dropdown', 'jankx')}</h4>
                                <p>{__('Supports List, Grid 2-4 columns or Columns with detailed card items.', 'jankx')}</p>
                            </div>
                            <div className="menu-preview-horizontal-feature">
                                <div className="menu-preview-horizontal-feature-icon">
                                    <Icon icon={Icons.ChevronRight} size={18} />
                                </div>
                                <h4>{__('Multi-level Flyout', 'jankx')}</h4>
                                <p>{__('Side flyout, each submenu level can configure Grid, List layout and custom width.', 'jankx')}</p>
                            </div>
                            <div className="menu-preview-horizontal-feature">
                                <div className="menu-preview-horizontal-feature-icon">
                                    <Icon icon={Icons.Grid} size={18} />
                                </div>
                                <h4>{__('Full-width Mega Menu', 'jankx')}</h4>
                                <p>{__('Full-width layout with multiple column groups, featured images and promo badges.', 'jankx')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {isMobileOpen && (
                    <div className="menu-preview-mobile-drawer">
                        <div className="menu-preview-mobile-backdrop" onClick={() => setIsMobileOpen(false)} />
                        <div className="menu-preview-mobile-panel">
                            <div className="menu-preview-mobile-header">
                                <div className="menu-preview-mobile-brand">
                                    <Icon icon={Icons.Layers} size={18} />
                                    <span>{__('Navigation', 'jankx')}</span>
                                </div>
                                <Button icon={Icons.Close} onClick={() => setIsMobileOpen(false)} label={__('Close', 'jankx')} />
                            </div>
                            <div className="menu-preview-mobile-content">
                                {items.map((item) => (
                                    <MobileDrawerItem key={item.id} item={item} onSelect={onSelectItem} />
                                ))}
                            </div>
                            <div className="menu-preview-mobile-footer">
                                <Button variant="primary">{__('Sign In / Get Started', 'jankx')}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface VerticalMenuListProps {
    items: MenuItem[];
    selectedId?: string | null;
    isPinned?: boolean;
    onSelect?: (id: string) => void;
    expandMode?: 'flyout' | 'accordion';
}

const VerticalMenuList = ({ items, selectedId, isPinned, onSelect, expandMode = 'flyout' }: VerticalMenuListProps) => {
    return (
        <div className="vertical-menu-list">
            {items.map((item) => (
                <VerticalMenuItem
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    isPinned={isPinned}
                    onSelect={() => onSelect && onSelect(item.id)}
                    expandMode={expandMode}
                />
            ))}
        </div>
    );
};

interface VerticalMenuItemProps {
    item: MenuItem;
    isSelected?: boolean;
    isPinned?: boolean;
    onSelect?: () => void;
    expandMode?: 'flyout' | 'accordion';
}

const VerticalMenuItem = ({ item, isSelected, isPinned, onSelect, expandMode = 'flyout' }: VerticalMenuItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const shouldShowFlyout = (isHovered || (isPinned && isSelected)) && hasChildren && expandMode === 'flyout';

    const handleClick = (e: React.MouseEvent) => {
        onSelect && onSelect();
        if (expandMode === 'accordion' && hasChildren) {
            e.preventDefault();
            setIsAccordionOpen(!isAccordionOpen);
        }
    };

    return (
        <div
            className="vertical-menu-item"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`vertical-menu-item-row ${isSelected ? 'is-selected' : ''} ${shouldShowFlyout ? 'is-hovered' : ''}`}
                onClick={handleClick}
            >
                <div className="vertical-menu-item-content">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="vertical-menu-item-image" />
                    ) : item.icon ? (
                        <div className="vertical-menu-item-icon">
                            <DynamicIcon name={item.icon} size={14} />
                        </div>
                    ) : (
                        <span className="vertical-menu-item-dot" />
                    )}
                    <span className="vertical-menu-item-label">{item.label}</span>
                    {item.badge && (
                        <span className={`vertical-menu-item-badge ${getBadgeClasses(item.badgeColor)}`}>
                            {item.badge}
                        </span>
                    )}
                </div>
                {hasChildren && (
                    expandMode === 'accordion' ? (
                        <Icon icon={Icons.ChevronDown} size={14} className={isAccordionOpen ? 'rotate-180' : ''} />
                    ) : (
                        <Icon icon={Icons.ChevronRight} size={14} />
                    )
                )}
            </div>

            {shouldShowFlyout && (
                <div className="vertical-menu-flyout">
                    <div className="vertical-menu-flyout-header">
                        <div className="vertical-menu-flyout-title">
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className={`vertical-menu-flyout-badge ${getBadgeClasses(item.badgeColor)}`}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="vertical-menu-flyout-type">
                            {item.type === 'mega' ? `Mega Menu (${item.columns || 4} cols)` : item.layout === 'grid' ? `Grid (${item.columns || 2} cols)` : 'List'}
                        </span>
                    </div>
                    {item.type === 'mega' ? (
                        <div className={`vertical-menu-mega-grid ${GRID_COLS_MAP[item.columns || 4] || 'grid-cols-4'}`}>
                            {item.children.map((col) => (
                                <div key={col.id} className="vertical-menu-mega-column">
                                    {col.imageUrl && (
                                        <div className="vertical-menu-mega-image">
                                            <img src={col.imageUrl} alt="" />
                                        </div>
                                    )}
                                    <div className="vertical-menu-mega-title">
                                        {col.icon && <DynamicIcon name={col.icon} size={13} />}
                                        <span>{col.label}</span>
                                    </div>
                                    {col.description && <p className="vertical-menu-mega-desc">{col.description}</p>}
                                    {col.children && col.children.length > 0 && (
                                        <div className="vertical-menu-mega-links">
                                            {col.children.map((sub) => (
                                                <a key={sub.id} href={sub.link || '#'} className="vertical-menu-mega-link">
                                                    <span className="vertical-menu-mega-link-dot" />
                                                    <span>{sub.label}</span>
                                                    {sub.badge && <span className={`vertical-menu-mega-link-badge ${getBadgeClasses(sub.badgeColor)}`}>{sub.badge}</span>}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : item.layout === 'grid' ? (
                        <div className={`vertical-menu-grid ${GRID_COLS_MAP[item.columns || 2] || 'grid-cols-2'}`}>
                            {item.children.map((child) => (
                                <SubmenuCardItem key={child.id} item={child} cardStyle={item.cardStyle || 'detailed'} />
                            ))}
                        </div>
                    ) : (
                        <div className="vertical-menu-list-items">
                            {item.children.map((child) => (
                                <FlyoutLevelItem key={child.id} item={child} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {expandMode === 'accordion' && hasChildren && isAccordionOpen && (
                <div className="vertical-menu-accordion">
                    {item.children.map((child) => (
                        <div key={child.id} className="vertical-menu-accordion-item">
                            <span>{child.label}</span>
                            {child.badge && (
                                <span className={`vertical-menu-accordion-badge ${getBadgeClasses(child.badgeColor)}`}>
                                    {child.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface TopLevelNavItemProps {
    item: MenuItem;
    isSelected?: boolean;
    isPinned?: boolean;
    onSelect?: () => void;
}

const TopLevelNavItem = ({ item, isSelected, isPinned, onSelect }: TopLevelNavItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const isMega = item.type === 'mega';
    const shouldShowSubmenu = (isHovered || (isPinned && isSelected)) && hasChildren;

    return (
        <div
            className={`top-level-nav-item ${isMega ? 'is-mega' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            <div className={`top-level-nav-item-row ${isSelected ? 'is-selected' : ''} ${shouldShowSubmenu ? 'is-hovered' : ''}`}>
                {item.icon && <DynamicIcon name={item.icon} size={14} />}
                <span>{item.label}</span>
                {item.badge && (
                    <span className={`top-level-nav-item-badge ${getBadgeClasses(item.badgeColor)}`}>
                        {item.badge}
                    </span>
                )}
                {hasChildren && (
                    <Icon icon={Icons.ChevronDown} size={13} className={shouldShowSubmenu ? 'rotate-180' : ''} />
                )}
            </div>
            {shouldShowSubmenu && (
                <>
                    {isMega ? (
                        <MegaMenuDropdown item={item} />
                    ) : item.type === 'flyout' ? (
                        <FlyoutMenuDropdown item={item} />
                    ) : (
                        <StandardDropdown item={item} />
                    )}
                </>
            )}
        </div>
    );
};

const StandardDropdown = ({ item }: { item: MenuItem }) => {
    const layout = item.layout || 'list';
    const cols = Math.min(Math.max(item.columns || 1, 1), 6);
    const align = item.align || 'left';
    const widthSetting = item.submenuWidth || 'auto';

    let widthClass = 'w-64';
    if (widthSetting === 'sm') widthClass = 'w-64';
    else if (widthSetting === 'md') widthClass = 'w-80';
    else if (widthSetting === 'lg') widthClass = 'w-480';
    else if (widthSetting === 'xl') widthClass = 'w-640';
    else if (widthSetting === 'full') widthClass = 'w-full';
    else {
        if (layout === 'grid') {
            if (cols === 1) widthClass = 'w-72';
            else if (cols === 2) widthClass = 'w-460';
            else if (cols === 3) widthClass = 'w-640';
            else widthClass = 'w-780';
        } else if (layout === 'columns') {
            if (cols <= 2) widthClass = 'w-460';
            else widthClass = 'w-640';
        } else {
            widthClass = 'w-72';
        }
    }

    const alignClass = align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0';

    return (
        <div className={`standard-dropdown ${widthClass} ${alignClass}`}>
            {item.description && (
                <div className="standard-dropdown-desc">{item.description}</div>
            )}
            {layout === 'grid' ? (
                <div className={`standard-dropdown-grid ${GRID_COLS_MAP[cols] || 'grid-cols-2'}`}>
                    {item.children.map((child) => (
                        <SubmenuCardItem key={child.id} item={child} cardStyle={item.cardStyle || 'detailed'} />
                    ))}
                </div>
            ) : layout === 'columns' ? (
                <div className={`standard-dropdown-columns ${GRID_COLS_MAP[cols] || 'grid-cols-2'}`}>
                    {item.children.map((child) => (
                        <div key={child.id} className="standard-dropdown-column">
                            <SubmenuCardItem item={child} cardStyle="detailed" />
                            {child.children && child.children.length > 0 && (
                                <div className="standard-dropdown-subcolumn">
                                    {child.children.map((sub) => (
                                        <SubmenuCardItem key={sub.id} item={sub} cardStyle="compact" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="standard-dropdown-list">
                    {item.children.map((child) => (
                        <SubmenuCardItem key={child.id} item={child} cardStyle={item.cardStyle || 'compact'} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FlyoutMenuDropdown = ({ item }: { item: MenuItem }) => {
    const layout = item.layout || 'list';
    const cols = Math.min(Math.max(item.columns || 1, 1), 4);
    const widthSetting = item.submenuWidth || 'auto';

    let widthClass = 'w-64';
    if (widthSetting === 'sm') widthClass = 'w-64';
    else if (widthSetting === 'md') widthClass = 'w-80';
    else if (widthSetting === 'lg') widthClass = 'w-480';
    else if (widthSetting === 'xl') widthClass = 'w-640';
    else if (widthSetting === 'auto') {
        if (layout === 'grid') {
            widthClass = cols === 1 ? 'w-64' : cols === 2 ? 'w-440' : 'w-580';
        }
    }

    return (
        <div className={`flyout-menu-dropdown ${widthClass}`}>
            {layout === 'grid' ? (
                <div className={`flyout-menu-grid ${GRID_COLS_MAP[cols] || 'grid-cols-2'}`}>
                    {item.children.map((child) => (
                        <FlyoutLevelItem key={child.id} item={child} />
                    ))}
                </div>
            ) : (
                <ul className="flyout-menu-list">
                    {item.children.map((child) => (
                        <FlyoutLevelItem key={child.id} item={child} />
                    ))}
                </ul>
            )}
        </div>
    );
};

const FlyoutLevelItem = ({ item }: { item: MenuItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const childLayout = item.layout || 'list';
    const childCols = Math.min(Math.max(item.columns || 1, 1), 4);

    let subWidthClass = 'w-64';
    if (item.submenuWidth === 'sm') subWidthClass = 'w-64';
    else if (item.submenuWidth === 'md') subWidthClass = 'w-80';
    else if (item.submenuWidth === 'lg') subWidthClass = 'w-460';
    else if (item.submenuWidth === 'xl') subWidthClass = 'w-600';
    else {
        if (childLayout === 'grid') {
            subWidthClass = childCols === 1 ? 'w-64' : childCols === 2 ? 'w-440' : 'w-580';
        }
    }

    return (
        <div
            className="flyout-level-item"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <a href={item.link || '#'} className="flyout-level-item-row">
                <div className="flyout-level-item-content">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="flyout-level-item-image" />
                    ) : item.icon ? (
                        <div className="flyout-level-item-icon">
                            <DynamicIcon name={item.icon} size={15} />
                        </div>
                    ) : null}
                    <div className="flyout-level-item-text">
                        <div className="flyout-level-item-label">
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className={`flyout-level-item-badge ${getBadgeClasses(item.badgeColor)}`}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        {item.description && <p className="flyout-level-item-desc">{item.description}</p>}
                    </div>
                </div>
                {hasChildren && <Icon icon={Icons.ChevronRight} size={14} />}
            </a>
            {hasChildren && isHovered && (
                <div className={`flyout-level-submenu ${subWidthClass}`}>
                    <div className="flyout-level-submenu-header">
                        <span>{item.label}</span>
                        <span className="flyout-level-submenu-type">
                            {childLayout === 'grid' ? `Grid ${childCols} cols` : 'List'}
                        </span>
                    </div>
                    {childLayout === 'grid' ? (
                        <div className={`flyout-level-submenu-grid ${GRID_COLS_MAP[childCols] || 'grid-cols-2'}`}>
                            {item.children.map((grandChild) => (
                                <FlyoutLevelItem key={grandChild.id} item={grandChild} />
                            ))}
                        </div>
                    ) : (
                        <div className="flyout-level-submenu-list">
                            {item.children.map((grandChild) => (
                                <FlyoutLevelItem key={grandChild.id} item={grandChild} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MegaMenuDropdown = ({ item }: { item: MenuItem }) => {
    const cols = Math.min(Math.max(item.columns || 4, 1), 6);

    return (
        <div className="mega-menu-dropdown">
            <div className="mega-menu-dropdown-inner">
                <div className={`mega-menu-dropdown-grid ${GRID_COLS_MAP[cols] || 'grid-cols-4'}`}>
                    {item.children.map((column) => (
                        <div key={column.id} className="mega-menu-dropdown-column">
                            <div className="mega-menu-dropdown-column-header">
                                {column.imageUrl && (
                                    <div className="mega-menu-dropdown-image">
                                        <img src={column.imageUrl} alt={column.label} />
                                    </div>
                                )}
                                <a href={column.link || '#'} className="mega-menu-dropdown-title">
                                    {column.icon && <DynamicIcon name={column.icon} size={15} />}
                                    <span>{column.label}</span>
                                    {column.badge && (
                                        <span className={`mega-menu-dropdown-badge ${getBadgeClasses(column.badgeColor)}`}>
                                            {column.badge}
                                        </span>
                                    )}
                                </a>
                                {column.description && <p className="mega-menu-dropdown-desc">{column.description}</p>}
                            </div>
                            {column.children && column.children.length > 0 && (
                                <div className="mega-menu-dropdown-links">
                                    {column.children.map((sub) => (
                                        <a key={sub.id} href={sub.link || '#'} className="mega-menu-dropdown-link">
                                            {sub.imageUrl ? (
                                                <img src={sub.imageUrl} alt="" className="mega-menu-dropdown-link-image" />
                                            ) : sub.icon ? (
                                                <DynamicIcon name={sub.icon} size={13} />
                                            ) : (
                                                <span className="mega-menu-dropdown-link-dot" />
                                            )}
                                            <span>{sub.label}</span>
                                            {sub.badge && (
                                                <span className={`mega-menu-dropdown-link-badge ${getBadgeClasses(sub.badgeColor)}`}>
                                                    {sub.badge}
                                                </span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface SubmenuCardItemProps {
    item: MenuItem;
    cardStyle?: string;
}

const SubmenuCardItem = ({ item, cardStyle = 'detailed' }: SubmenuCardItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasSubChildren = item.children && item.children.length > 0;

    if (cardStyle === 'cards' && item.imageUrl) {
        return (
            <a href={item.link || '#'} className="submenu-card submenu-card-cards">
                <div className="submenu-card-image">
                    <img src={item.imageUrl} alt="" />
                </div>
                <div className="submenu-card-content">
                    <span className="submenu-card-title">{item.label}</span>
                    {item.badge && (
                        <span className={`submenu-card-badge ${getBadgeClasses(item.badgeColor)}`}>
                            {item.badge}
                        </span>
                    )}
                </div>
                {item.description && <p className="submenu-card-desc">{item.description}</p>}
            </a>
        );
    }

    if (cardStyle === 'detailed' || item.description || item.imageUrl || item.icon) {
        return (
            <div
                className="submenu-card submenu-card-detailed"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <a href={item.link || '#'} className="submenu-card-row">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="submenu-card-image" />
                    ) : item.icon ? (
                        <div className="submenu-card-icon">
                            <DynamicIcon name={item.icon} size={18} />
                        </div>
                    ) : null}
                    <div className="submenu-card-content">
                        <div className="submenu-card-title-row">
                            <span className="submenu-card-title">{item.label}</span>
                            {item.badge && (
                                <span className={`submenu-card-badge ${getBadgeClasses(item.badgeColor)}`}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        {item.description && <p className="submenu-card-desc">{item.description}</p>}
                    </div>
                    {hasSubChildren && <Icon icon={Icons.ChevronRight} size={14} />}
                </a>
                {hasSubChildren && isHovered && (
                    <div className="submenu-card-flyout">
                        <div className="submenu-card-flyout-header">
                            <span>{item.label}</span>
                        </div>
                        <div className="submenu-card-flyout-list">
                            {item.children.map((sub) => (
                                <a key={sub.id} href={sub.link || '#'} className="submenu-card-flyout-link">
                                    {sub.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="submenu-card submenu-card-compact"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <a href={item.link || '#'} className="submenu-card-row">
                <span className="submenu-card-label">{item.label}</span>
                <div className="submenu-card-actions">
                    {item.badge && (
                        <span className={`submenu-card-badge ${getBadgeClasses(item.badgeColor)}`}>
                            {item.badge}
                        </span>
                    )}
                    {hasSubChildren && <Icon icon={Icons.ChevronRight} size={13} />}
                </div>
            </a>
            {hasSubChildren && isHovered && (
                <div className="submenu-card-flyout">
                    {item.children.map((sub) => (
                        <a key={sub.id} href={sub.link || '#'} className="submenu-card-flyout-link">
                            {sub.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

const MobileDrawerItem = ({ item, onSelect }: { item: MenuItem; onSelect?: (id: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="mobile-drawer-item">
            <div className="mobile-drawer-item-row">
                <a
                    href={item.link || '#'}
                    onClick={() => onSelect && onSelect(item.id)}
                    className="mobile-drawer-item-link"
                >
                    {item.icon && <DynamicIcon name={item.icon} size={16} />}
                    <span>{item.label}</span>
                    {item.badge && (
                        <span className={`mobile-drawer-item-badge ${getBadgeClasses(item.badgeColor)}`}>
                            {item.badge}
                        </span>
                    )}
                </a>
                {hasChildren && (
                    <Button
                        icon={Icons.ChevronDown}
                        onClick={() => setIsOpen(!isOpen)}
                        label={isOpen ? __('Collapse', 'jankx') : __('Expand', 'jankx')}
                        className={isOpen ? 'rotate-180' : ''}
                    />
                )}
            </div>
            {hasChildren && isOpen && (
                <div className="mobile-drawer-children">
                    {item.children.map((child) => (
                        <MobileDrawerItem key={child.id} item={child} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPreview;

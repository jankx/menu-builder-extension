import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface MenuItemAttributes {
    itemId: string;
    label: string;
    url: string;
    menuType: 'link' | 'dropdown' | 'mega' | 'flyout';
    layout: 'list' | 'grid' | 'columns';
    columns: number;
    icon: string;
    imageUrl: string;
    description: string;
    badge: string;
    badgeColor: string;
    submenuWidth: string;
    align: string;
    cardStyle: string;
    target: string;
    rel: string;
    cssClass: string;
}

const Save = ({ attributes }: { attributes: MenuItemAttributes }) => {
    const {
        itemId,
        label,
        url,
        menuType,
        layout,
        columns,
        icon,
        imageUrl,
        description,
        badge,
        badgeColor,
        submenuWidth,
        align,
        cardStyle,
        target,
        rel,
        cssClass
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `mega-menu-item mega-menu-item-${menuType} ${cssClass}`,
        'data-item-id': itemId,
        'data-menu-type': menuType,
        'data-layout': layout,
        'data-columns': columns,
        'data-submenu-width': submenuWidth,
        'data-align': align,
        'data-card-style': cardStyle
    });

    const linkProps: any = {
        href: url || '#',
        className: 'menu-item-link'
    };

    if (target) {
        linkProps.target = target;
    }

    if (rel) {
        linkProps.rel = rel;
    }

    const hasChildren = menuType !== 'link';

    return (
        <li {...blockProps}>
            <a {...linkProps}>
                {icon && <span className="menu-item-icon">{icon}</span>}
                {imageUrl && <img src={imageUrl} alt="" className="menu-item-image" />}
                <span className="menu-item-label">{label}</span>
                {badge && (
                    <span className={`menu-item-badge menu-item-badge-${badgeColor}`}>
                        {badge}
                    </span>
                )}
                {hasChildren && <span className="submenu-toggle" />}
            </a>
            {hasChildren && (
                <ul className={`sub-menu submenu-${menuType} submenu-${layout} columns-${columns}`}>
                    <InnerBlocks.Content />
                </ul>
            )}
        </li>
    );
};

export default Save;

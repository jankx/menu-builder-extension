import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl, Button, ButtonGroup } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { Icons, Icon } from '../mega-menu/components/Icons';

interface MenuItemAttributes {
    itemId: string;
    label: string;
    url: string;
    menuType: 'link' | 'dropdown' | 'flyout' | 'mega';
    layout: 'list' | 'grid' | 'columns';
    columns: number;
    icon: string;
    imageUrl: string;
    description: string;
    badge: string;
    badgeColor: string;
    submenuWidth: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    align: 'left' | 'center' | 'right';
    cardStyle: 'compact' | 'detailed' | 'cards';
    target: '_self' | '_blank';
    rel: string;
    cssClass: string;
}

const MENU_TYPES = [
    { label: __('Link', 'jankx'), value: 'link', icon: Icons.Link },
    { label: __('Dropdown', 'jankx'), value: 'dropdown', icon: Icons.ChevronDown },
    { label: __('Flyout', 'jankx'), value: 'flyout', icon: Icons.ChevronRight },
    { label: __('Mega Menu', 'jankx'), value: 'mega', icon: Icons.Grid }
];

const Edit = ({ attributes, setAttributes, clientId }: any) => {
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
    } = attributes as MenuItemAttributes;

    const { insertBlock } = useDispatch('core/block-editor');

    useEffect(() => {
        if (!itemId) {
            setAttributes({
                itemId: 'menu-item-' + Math.random().toString(36).substr(2, 9)
            });
        }
    }, [itemId, setAttributes]);

    const { innerBlocks } = useSelect(
        (select: any) => {
            const store = select('core/block-editor');
            return {
                innerBlocks: store.getBlock(clientId)?.innerBlocks || []
            };
        },
        [clientId]
    );

    const hasChildren = menuType !== 'link';

    const addSubmenuItem = () => {
        const submenuBlock = createBlock('jankx/mega-menu-item', {
            itemId: 'menu-item-' + Math.random().toString(36).substr(2, 9),
            label: __('New Submenu Item', 'jankx'),
            url: '#',
            menuType: 'link',
            icon: '',
            imageUrl: '',
            description: '',
            badge: '',
            badgeColor: 'blue',
            target: '_self',
            rel: '',
            cssClass: ''
        });

        insertBlock(submenuBlock, innerBlocks.length, clientId);
    };

    const blockProps = useBlockProps({
        className: `mega-menu-item mega-menu-item-${menuType} ${hasChildren ? 'has-children' : ''} ${cssClass}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Menu Item Settings', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('Label', 'jankx')}
                        value={label}
                        onChange={(label) => setAttributes({ label })}
                        placeholder={__('Menu Item', 'jankx')}
                    />
                    <TextControl
                        label={__('URL', 'jankx')}
                        value={url}
                        onChange={(url) => setAttributes({ url })}
                        placeholder={__('https://example.com', 'jankx')}
                    />
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Menu Type', 'jankx')}
                        </label>
                        <ButtonGroup>
                            {MENU_TYPES.map((type) => (
                                <Button
                                    key={type.value}
                                    variant={menuType === type.value ? 'primary' : 'secondary'}
                                    icon={type.icon}
                                    onClick={() => setAttributes({ menuType: type.value as any })}
                                    label={type.label}
                                >
                                    {type.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <SelectControl
                        label={__('Open in', 'jankx')}
                        value={target}
                        options={[
                            { label: __('Same window', 'jankx'), value: '_self' },
                            { label: __('New window', 'jankx'), value: '_blank' }
                        ]}
                        onChange={(target) => setAttributes({ target })}
                    />
                    {target === '_blank' && (
                        <TextControl
                            label={__('Rel Attribute', 'jankx')}
                            value={rel}
                            onChange={(rel) => setAttributes({ rel })}
                            placeholder={__('noopener noreferrer', 'jankx')}
                        />
                    )}
                    <TextControl
                        label={__('CSS Class', 'jankx')}
                        value={cssClass}
                        onChange={(cssClass) => setAttributes({ cssClass })}
                        placeholder={__('custom-class', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Media & Badge', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Icon', 'jankx')}
                        value={icon}
                        onChange={(icon) => setAttributes({ icon })}
                        placeholder={__('Icon name or emoji', 'jankx')}
                    />
                    <TextControl
                        label={__('Image URL', 'jankx')}
                        value={imageUrl}
                        onChange={(imageUrl) => setAttributes({ imageUrl })}
                        placeholder={__('https://example.com/image.jpg', 'jankx')}
                    />
                    <TextControl
                        label={__('Description', 'jankx')}
                        value={description}
                        onChange={(description) => setAttributes({ description })}
                        placeholder={__('Short description', 'jankx')}
                    />
                    <TextControl
                        label={__('Badge', 'jankx')}
                        value={badge}
                        onChange={(badge) => setAttributes({ badge })}
                        placeholder={__('HOT, NEW, PRO...', 'jankx')}
                    />
                    {badge && (
                        <SelectControl
                            label={__('Badge Color', 'jankx')}
                            value={badgeColor}
                            options={[
                                { label: __('Blue', 'jankx'), value: 'blue' },
                                { label: __('Red', 'jankx'), value: 'red' },
                                { label: __('Green', 'jankx'), value: 'emerald' },
                                { label: __('Amber', 'jankx'), value: 'amber' },
                                { label: __('Purple', 'jankx'), value: 'purple' }
                            ]}
                            onChange={(badgeColor) => setAttributes({ badgeColor })}
                        />
                    )}
                </PanelBody>

                {menuType !== 'link' && (
                    <PanelBody title={__('Submenu Settings', 'jankx')} initialOpen={false}>
                        <SelectControl
                            label={__('Layout', 'jankx')}
                            value={layout}
                            options={[
                                { label: __('List', 'jankx'), value: 'list' },
                                { label: __('Grid', 'jankx'), value: 'grid' },
                                { label: __('Columns', 'jankx'), value: 'columns' }
                            ]}
                            onChange={(layout) => setAttributes({ layout })}
                        />
                        {(layout === 'grid' || layout === 'columns') && (
                            <RangeControl
                                label={__('Columns', 'jankx')}
                                value={columns}
                                onChange={(columns) => setAttributes({ columns: columns || 1 })}
                                min={1}
                                max={6}
                            />
                        )}
                        <SelectControl
                            label={__('Submenu Width', 'jankx')}
                            value={submenuWidth}
                            options={[
                                { label: __('Auto', 'jankx'), value: 'auto' },
                                { label: __('Small', 'jankx'), value: 'sm' },
                                { label: __('Medium', 'jankx'), value: 'md' },
                                { label: __('Large', 'jankx'), value: 'lg' },
                                { label: __('Extra Large', 'jankx'), value: 'xl' },
                                { label: __('Full', 'jankx'), value: 'full' }
                            ]}
                            onChange={(submenuWidth) => setAttributes({ submenuWidth })}
                        />
                        <SelectControl
                            label={__('Alignment', 'jankx')}
                            value={align}
                            options={[
                                { label: __('Left', 'jankx'), value: 'left' },
                                { label: __('Center', 'jankx'), value: 'center' },
                                { label: __('Right', 'jankx'), value: 'right' }
                            ]}
                            onChange={(align) => setAttributes({ align })}
                        />
                        <SelectControl
                            label={__('Card Style', 'jankx')}
                            value={cardStyle}
                            options={[
                                { label: __('Compact', 'jankx'), value: 'compact' },
                                { label: __('Detailed', 'jankx'), value: 'detailed' },
                                { label: __('Cards', 'jankx'), value: 'cards' }
                            ]}
                            onChange={(cardStyle) => setAttributes({ cardStyle })}
                        />
                    </PanelBody>
                )}
            </InspectorControls>

            <div {...blockProps}>
                {menuType === 'link' ? (
                    <a href={url || '#'} className="menu-item-link">
                        {icon && <span className="menu-item-icon">{icon}</span>}
                        <span className="menu-item-label">{label || __('Menu Item', 'jankx')}</span>
                        {badge && (
                            <span className={`menu-item-badge menu-item-badge-${badgeColor}`}>
                                {badge}
                            </span>
                        )}
                    </a>
                ) : (
                    <>
                        <div className="menu-item-has-submenu">
                            <span className="menu-item-link">
                                {icon && <span className="menu-item-icon">{icon}</span>}
                                <span className="menu-item-label">{label || __('Menu Item', 'jankx')}</span>
                                {badge && (
                                    <span className={`menu-item-badge menu-item-badge-${badgeColor}`}>
                                        {badge}
                                    </span>
                                )}
                                <span className="submenu-toggle" />
                            </span>
                        </div>
                        <div className="mega-menu-submenu-content">
                            <InnerBlocks
                                allowedBlocks={['jankx/mega-menu-item']}
                                template={[]}
                                renderAppender={() => (
                                    <Button
                                        onClick={addSubmenuItem}
                                        variant="secondary"
                                    >
                                        {__('Add Submenu Item', 'jankx')}
                                    </Button>
                                )}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Edit;

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ButtonGroup, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Icons } from '../mega-menu/components/Icons';

interface MenuItemAttributes {
    itemId: string;
    label: string;
    url: string;
    menuType: 'link' | 'dropdown' | 'mega' | 'flyout';
    icon: string;
    imageUrl: string;
    description: string;
    badge: string;
    badgeColor: string;
    target: string;
    rel: string;
    cssClass: string;
}

const MENU_TYPES = [
    { label: __('Link', 'jankx'), value: 'link', icon: link },
    { label: __('Dropdown', 'jankx'), value: 'dropdown', icon: chevronDown },
    { label: __('Flyout', 'jankx'), value: 'flyout', icon: chevronRight },
    { label: __('Mega Menu', 'jankx'), value: 'mega', icon: button }
];

const Edit = (props: { attributes: MenuItemAttributes, setAttributes: (updates: Partial<MenuItemAttributes>) => void, clientId: string }) => {
    const { attributes, setAttributes, clientId } = props;
    const {
        itemId,
        label,
        url,
        menuType,
        icon,
        imageUrl,
        description,
        badge,
        badgeColor,
        target,
        rel,
        cssClass
    } = attributes;

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

    const hasChildren = innerBlocks.length > 0;

    const addSubmenuItem = () => {
        const submenuBlock = (window as any).wp.blocks.createBlock('jankx/mega-menu-item', {
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
                        onChange={(target) => setAttributes({ target: target as '_self' | '_blank' })}
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
                            onChange={(badgeColor) => setAttributes({ badgeColor: badgeColor as any })}
                        />
                    )}
                </PanelBody>

                {menuType !== 'link' && (
                    <PanelBody title={__('Submenu Items', 'jankx')} initialOpen={false}>
                        <Button
                            onClick={addSubmenuItem}
                            variant="primary"
                        >
                            {__('Add Submenu Item', 'jankx')}
                        </Button>
                    </PanelBody>
                )}
            </InspectorControls>

            <div {...blockProps}>
                <div className="menu-item-preview">
                    <div className="menu-item-header">
                        <div className="menu-item-info">
                            <div className="menu-item-type-indicator">
                                {MENU_TYPES.find(t => t.value === menuType)?.icon && (
                                    <Icon icon={MENU_TYPES.find(t => t.value === menuType)!.icon} />
                                )}
                            </div>
                            <div className="menu-item-details">
                                <div className="menu-item-label-preview">
                                    {label || __('Menu Item', 'jankx')}
                                </div>
                                {url && url !== '#' && (
                                    <div className="menu-item-url-preview">
                                        {url}
                                    </div>
                                )}
                                {menuType !== 'link' && (
                                    <div className="submenu-indicator">
                                        {__('Type:', 'jankx')} {menuType}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {menuType !== 'link' && (
                        <InnerBlocks
                            allowedBlocks={['jankx/mega-menu-item']}
                            renderAppender={() => (
                                <Button
                                    onClick={addSubmenuItem}
                                    variant="primary"
                                >
                                    {__('Add Submenu Item', 'jankx')}
                                </Button>
                            )}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Edit;

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';

interface SubmenuAttributes {
    layout: 'list' | 'grid' | 'columns';
    columns: number;
    submenuWidth: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    align: 'left' | 'center' | 'right';
    cardStyle: 'compact' | 'detailed' | 'cards';
    submenuType: string;
}

const Edit = ({ attributes, setAttributes, clientId }: any) => {
    const {
        layout,
        columns,
        submenuWidth,
        align,
        cardStyle,
        submenuType
    } = attributes as SubmenuAttributes;

    const { insertBlock } = useDispatch('core/block-editor');

    const { innerBlocks } = useSelect(
        (select: any) => {
            const store = select('core/block-editor');
            return {
                innerBlocks: store.getBlock(clientId)?.innerBlocks || []
            };
        },
        [clientId]
    );

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
        className: `mega-menu-submenu submenu-${submenuType} layout-${layout} columns-${columns}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Submenu Settings', 'jankx')} initialOpen={true}>
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
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['jankx/mega-menu-item']}
                    template={[]}
                    renderAppender={() => (
                        <Button
                            onClick={addSubmenuItem}
                            variant="primary"
                        >
                            {__('Add Menu Item', 'jankx')}
                        </Button>
                    )}
                />
            </div>
        </>
    );
};

export default Edit;

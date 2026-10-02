import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ButtonGroup, Button } from '@wordpress/components';
import { list, grid, columns } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';

interface SubmenuAttributes {
    layout: string;
    columns: number;
    submenuWidth: string;
    align: string;
    cardStyle: string;
    submenuType: string;
}

const LAYOUTS = [
    { label: __('List', 'jankx'), value: 'list', icon: list },
    { label: __('Grid', 'jankx'), value: 'grid', icon: grid },
    { label: __('Columns', 'jankx'), value: 'columns', icon: columns }
];

const Edit = ({ attributes, setAttributes }: { attributes: SubmenuAttributes, setAttributes: (updates: Partial<SubmenuAttributes>) => void }) => {
    const {
        layout,
        columns,
        submenuWidth,
        align,
        cardStyle,
        submenuType
    } = attributes;

    const blockProps = useBlockProps({
        className: `mega-menu-submenu mega-menu-submenu-${layout} mega-menu-submenu-${submenuType}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Submenu Layout', 'jankx')} initialOpen={true}>
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Layout', 'jankx')}
                        </label>
                        <ButtonGroup>
                            {LAYOUTS.map((l) => (
                                <Button
                                    key={l.value}
                                    variant={layout === l.value ? 'primary' : 'secondary'}
                                    icon={l.icon}
                                    onClick={() => setAttributes({ layout: l.value as any })}
                                    label={l.label}
                                >
                                    {l.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    {(layout === 'grid' || layout === 'columns') && (
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(columns) => setAttributes({ columns: columns || 2 })}
                            min={1}
                            max={6}
                        />
                    )}

                    <SelectControl
                        label={__('Submenu Width', 'jankx')}
                        value={submenuWidth}
                        options={[
                            { label: __('Auto', 'jankx'), value: 'auto' },
                            { label: __('Small (~260px)', 'jankx'), value: 'sm' },
                            { label: __('Medium (~380px)', 'jankx'), value: 'md' },
                            { label: __('Large (~520px)', 'jankx'), value: 'lg' },
                            { label: __('Extra Large (~680px)', 'jankx'), value: 'xl' },
                            { label: __('Full Width', 'jankx'), value: 'full' }
                        ]}
                        onChange={(submenuWidth) => setAttributes({ submenuWidth: submenuWidth as any })}
                    />

                    {submenuType !== 'mega' && (
                        <SelectControl
                            label={__('Alignment', 'jankx')}
                            value={align}
                            options={[
                                { label: __('Left', 'jankx'), value: 'left' },
                                { label: __('Center', 'jankx'), value: 'center' },
                                { label: __('Right', 'jankx'), value: 'right' }
                            ]}
                            onChange={(align) => setAttributes({ align: align as any })}
                        />
                    )}

                    <SelectControl
                        label={__('Card Style', 'jankx')}
                        value={cardStyle}
                        options={[
                            { label: __('Compact', 'jankx'), value: 'compact' },
                            { label: __('Detailed', 'jankx'), value: 'detailed' },
                            { label: __('Cards', 'jankx'), value: 'cards' }
                        ]}
                        onChange={(cardStyle) => setAttributes({ cardStyle: cardStyle as any })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="submenu-preview">
                    <div className="submenu-preview-header">
                        <Icon icon={LAYOUTS.find(l => l.value === layout)?.icon || list} />
                        <span>{__('Submenu', 'jankx')}</span>
                        <span className="submenu-type-badge">{submenuType}</span>
                    </div>
                    <InnerBlocks
                        allowedBlocks={['jankx/mega-menu-item']}
                        renderAppender={() => (
                            <Button
                                variant="primary"
                                isSmall
                            >
                                {__('Add Item', 'jankx')}
                            </Button>
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default Edit;

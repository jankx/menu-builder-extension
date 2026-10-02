import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl, RangeControl, ButtonGroup, Button, TextareaControl } from '@wordpress/components';
import { plus, trash, close, copy, settings, text, image, sliders } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';
import { Icons, ICON_OPTIONS, DynamicIcon } from './Icons';
import { MenuItem } from './TreeEditor';

interface PropertiesPanelProps {
    item: MenuItem | null;
    onUpdate: (updates: Partial<MenuItem>) => void;
    onClose: () => void;
    onAddChild?: (parentId: string) => void;
    onDuplicate?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const SAMPLE_IMAGES = [
    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
    { label: 'Phone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
    { label: 'Fashion', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
    { label: 'Home', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80' },
    { label: 'Security/Cloud', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' }
];

const PropertiesPanel = ({ item, onUpdate, onClose, onAddChild, onDuplicate, onDelete }: PropertiesPanelProps) => {
    if (!item) return null;

    const canHaveSubmenuLayout =
        item.type === 'dropdown' ||
        item.type === 'flyout' ||
        item.type === 'mega' ||
        (item.children && item.children.length > 0);

    const childCount = item.children ? item.children.length : 0;

    return (
        <div className="properties-panel">
            <div className="properties-panel-header">
                <div className="properties-panel-title">
                    <Icon icon={settings} size={16} />
                    <div>
                        <h3>{__('Menu Item Settings', 'jankx')}</h3>
                        <span className="properties-panel-item-label">{item.label || __('Untitled', 'jankx')}</span>
                    </div>
                </div>
                <div className="properties-panel-header-actions">
                    {onDuplicate && (
                        <Button icon={copy} onClick={() => onDuplicate(item.id)} label={__('Duplicate', 'jankx')} />
                    )}
                    {onDelete && (
                        <Button icon={trash} onClick={() => onDelete(item.id)} label={__('Delete', 'jankx')} isDestructive />
                    )}
                    <Button icon={close} onClick={onClose} label={__('Close', 'jankx')} />
                </div>
            </div>

            <div className="properties-panel-content">
                <PanelBody title={__('Basic Information', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('Label', 'jankx')}
                        value={item.label}
                        onChange={(label) => onUpdate({ label })}
                        placeholder={__('e.g. Products, Services...', 'jankx')}
                    />
                    <TextControl
                        label={__('URL', 'jankx')}
                        value={item.url}
                        onChange={(url) => onUpdate({ url })}
                        placeholder="/path or https://..."
                    />
                    <div className="properties-panel-row">
                        <div className="properties-panel-field">
                            <TextControl
                                label={__('Badge', 'jankx')}
                                value={item.badge || ''}
                                onChange={(badge) => onUpdate({ badge })}
                                placeholder="HOT, NEW, PRO..."
                            />
                        </div>
                        <div className="properties-panel-field">
                            <SelectControl
                                label={__('Badge Color', 'jankx')}
                                value={item.badgeColor || 'blue'}
                                options={[
                                    { label: __('Blue', 'jankx'), value: 'blue' },
                                    { label: __('Red', 'jankx'), value: 'red' },
                                    { label: __('Green', 'jankx'), value: 'emerald' },
                                    { label: __('Amber', 'jankx'), value: 'amber' },
                                    { label: __('Purple', 'jankx'), value: 'purple' }
                                ]}
                                onChange={(badgeColor) => onUpdate({ badgeColor })}
                            />
                        </div>
                    </div>
                    <div className="properties-panel-field">
                        <label className="properties-panel-label">{__('Icon', 'jankx')}</label>
                        <div className="properties-panel-icon-picker">
                            {ICON_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.name}
                                    icon={opt.icon}
                                    onClick={() => onUpdate({ icon: item.icon === opt.name ? undefined : opt.name })}
                                    label={opt.label}
                                    variant={item.icon === opt.name ? 'primary' : 'secondary'}
                                    isSmall
                                />
                            ))}
                        </div>
                    </div>
                </PanelBody>

                <PanelBody title={__('Menu Type', 'jankx')} initialOpen={true}>
                    <ButtonGroup className="properties-panel-menu-types">
                        {[
                            { type: 'link', label: __('Link', 'jankx'), desc: 'No submenu' },
                            { type: 'dropdown', label: __('Dropdown', 'jankx'), desc: 'List/Grid' },
                            { type: 'flyout', label: __('Flyout', 'jankx'), desc: 'Multi-level side' },
                            { type: 'mega', label: ('Mega Menu', 'jankx') as any, desc: 'Full width' }
                        ].map((m) => (
                            <Button
                                key={m.type}
                                variant={item.type === m.type ? 'primary' : 'secondary'}
                                onClick={() => onUpdate({ type: m.type as any })}
                            >
                                <div className="properties-panel-menu-type">
                                    <span className="properties-panel-menu-type-label">{m.label}</span>
                                    <span className="properties-panel-menu-type-desc">{m.desc}</span>
                                </div>
                            </Button>
                        ))}
                    </ButtonGroup>
                </PanelBody>

                {canHaveSubmenuLayout && (
                    <PanelBody title={__('Submenu Layout', 'jankx')} initialOpen={false}>
                        <div className="properties-panel-section-header">
                            <Icon icon={sliders} size={14} />
                            <div>
                                <h4>{__('Submenu Layout', 'jankx')}</h4>
                                <p>
                                    {item.type === 'dropdown' && __('Apply to dropdown panel', 'jankx')}
                                    {item.type === 'flyout' && __('Apply to flyout panels', 'jankx')}
                                    {item.type === 'mega' && __('Apply to mega menu', 'jankx')}
                                    {item.type === 'link' && __('Apply to child items', 'jankx')}
                                </p>
                            </div>
                            <span className="properties-panel-child-count">{childCount} {__('children', 'jankx')}</span>
                        </div>

                        <div className="properties-panel-field">
                            <label className="properties-panel-label">{__('Child Display', 'jankx')}</label>
                            <ButtonGroup>
                                {[
                                    { value: 'list', label: __('List', 'jankx'), icon: text },
                                    { value: 'grid', label: __('Grid', 'jankx'), icon: Icons.Grid },
                                    { value: 'columns', label: ('Columns', 'jankx') as any, icon: Icons.Columns }
                                ].map((l) => (
                                    <Button
                                        key={l.value}
                                        icon={l.icon}
                                        variant={item.layout === l.value ? 'primary' : 'secondary'}
                                        onClick={() => onUpdate({ layout: l.value as any })}
                                    >
                                        {l.label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>

                        {(item.layout === 'grid' || item.layout === 'columns' || item.type === 'mega') && (
                            <div className="properties-panel-columns-control">
                                <div className="properties-panel-columns-header">
                                    <span>{__('Columns:', 'jankx')}</span>
                                    <strong>{item.columns || 2}</strong>
                                </div>
                                <RangeControl
                                    value={item.columns || 2}
                                    onChange={(columns) => onUpdate({ columns: columns || 1 })}
                                    min={1}
                                    max={6}
                                />
                                <div className="properties-panel-column-presets">
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <Button
                                            key={num}
                                            variant={(item.columns || 2) === num ? 'primary' : 'secondary'}
                                            onClick={() => onUpdate({ columns: num })}
                                            isSmall
                                        >
                                            {num}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <SelectControl
                            label={__('Panel Width', 'jankx')}
                            value={item.submenuWidth || 'auto'}
                            options={[
                                { label: __('Auto (recommended)', 'jankx'), value: 'auto' },
                                { label: __('Small (~260px)', 'jankx'), value: 'sm' },
                                { label: __('Medium (~380px)', 'jankx'), value: 'md' },
                                { label: __('Large (~520px)', 'jankx'), value: 'lg' },
                                { label: __('Extra Large (~680px)', 'jankx'), value: 'xl' },
                                { label: ('Full width (Mega Menu)', 'jankx') as any, value: 'full' }
                            ]}
                            onChange={(submenuWidth) => onUpdate({ submenuWidth: submenuWidth as any })}
                        />

                        {(item.type === 'dropdown' || item.type === 'flyout') && (
                            <div className="properties-panel-field">
                                <label className="properties-panel-label">{__('Alignment', 'jankx')}</label>
                                <ButtonGroup>
                                    {[
                                        { value: 'left', label: __('Left', 'jankx') },
                                        { value: 'center', label: __('Center', 'jankx') },
                                        { value: 'right', label: __('Right', 'jankx') }
                                    ].map((a) => (
                                        <Button
                                            key={a.value}
                                            variant={(item.align || 'left') === a.value ? 'primary' : 'secondary'}
                                            onClick={() => onUpdate({ align: a.value as any })}
                                        >
                                            {a.label}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                        )}

                        <div className="properties-panel-field">
                            <label className="properties-panel-label">{__('Card Style', 'jankx')}</label>
                            <ButtonGroup>
                                {[
                                    { value: 'compact', label: __('Compact', 'jankx') },
                                    { value: 'detailed', label: __('Detailed', 'jankx') },
                                    { value: 'cards', label: ('Cards', 'jankx') as any }
                                ].map((s) => (
                                    <Button
                                        key={s.value}
                                        variant={(item.cardStyle || 'detailed') === s.value ? 'primary' : 'secondary'}
                                        onClick={() => onUpdate({ cardStyle: s.value as any })}
                                    >
                                        {s.label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>

                        {onAddChild && (
                            <Button
                                icon={plus}
                                onClick={() => onAddChild(item.id)}
                                variant="primary"
                                className="properties-panel-add-child"
                            >
                                {__('Add child item', 'jankx')}
                            </Button>
                        )}
                    </PanelBody>
                )}

                <PanelBody title={__('Image & Description', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Image URL', 'jankx')}
                        value={item.imageUrl || ''}
                        onChange={(imageUrl) => onUpdate({ imageUrl })}
                        placeholder="https://images.unsplash.com/..."
                    />
                    <div className="properties-panel-sample-images">
                        <span className="properties-panel-label">{__('Samples:', 'jankx')}</span>
                        {SAMPLE_IMAGES.map((img) => (
                            <Button
                                key={img.label}
                                onClick={() => onUpdate({ imageUrl: img.url })}
                                isSmall
                            >
                                {img.label}
                            </Button>
                        ))}
                        {item.imageUrl && (
                            <Button
                                onClick={() => onUpdate({ imageUrl: '' })}
                                isSmall
                                isDestructive
                            >
                                {__('Remove', 'jankx')}
                            </Button>
                        )}
                    </div>
                    {item.imageUrl && (
                        <div className="properties-panel-image-preview">
                            <img src={item.imageUrl} alt="Preview" />
                        </div>
                    )}
                    <TextareaControl
                        label={__('Description', 'jankx')}
                        value={item.description || ''}
                        onChange={(description) => onUpdate({ description })}
                        rows={2}
                        placeholder={__('Short description for grid or card layout...', 'jankx')}
                    />
                </PanelBody>
            </div>
        </div>
    );
};

export default PropertiesPanel;

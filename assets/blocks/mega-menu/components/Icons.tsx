import { __ } from '@wordpress/i18n';
import {
    chevronDown,
    chevronRight,
    chevronLeft,
    plus,
    trash,
    moveUp,
    moveDown,
    settings,
    layoutGrid,
    type,
    image as imageIcon,
    sparkles,
    menu,
    x,
    link,
    alignJustify,
    copy,
    check,
    externalLink,
    layers,
    sliders,
    eye,
    download,
    code,
    monitor,
    tablet,
    smartphone,
    boxes,
    fileText,
    shield,
    zap,
    cloud,
    cpu,
    shoppingBag,
    tag,
    palette,
    refreshCw,
    folderTree,
    pin,
    pinOff,
    panelLeft,
    rows,
    layoutList,
    store,
    compass
} from '@wordpress/icons';
import { Icon } from '@wordpress/icons';

export const Icons = {
    ChevronDown: chevronDown,
    ChevronRight: chevronRight,
    ChevronLeft: chevronLeft,
    Plus: plus,
    Trash2: trash,
    MoveUp: moveUp,
    MoveDown: moveDown,
    Settings: settings,
    Grid: layoutGrid,
    Text: type,
    Image: imageIcon,
    Sparkles: sparkles,
    Menu: menu,
    Close: x,
    Link: link,
    Columns: alignJustify,
    Copy: copy,
    Check: check,
    ExternalLink: externalLink,
    Layers: layers,
    Sliders: sliders,
    Eye: eye,
    Download: download,
    Code: code,
    Monitor: monitor,
    Tablet: tablet,
    Smartphone: smartphone,
    Boxes: boxes,
    FileText: fileText,
    Shield: shield,
    Zap: zap,
    Cloud: cloud,
    Cpu: cpu,
    ShoppingBag: shoppingBag,
    Tag: tag,
    Palette: palette,
    RefreshCw: refreshCw,
    FolderTree: folderTree,
    Pin: pin,
    PinOff: pinOff,
    PanelLeft: panelLeft,
    Rows: rows,
    LayoutList: layoutList,
    Store: store,
    Compass: compass
};

export const ICON_OPTIONS: { name: string; label: string; icon: any }[] = [
    { name: 'ShoppingBag', label: __('Store', 'jankx'), icon: shoppingBag },
    { name: 'Zap', label: __('Lightning', 'jankx'), icon: zap },
    { name: 'Shield', label: __('Security', 'jankx'), icon: shield },
    { name: 'Cloud', label: __('Cloud', 'jankx'), icon: cloud },
    { name: 'Cpu', label: __('Hardware', 'jankx'), icon: cpu },
    { name: 'Smartphone', label: __('Phone', 'jankx'), icon: smartphone },
    { name: 'Monitor', label: __('Monitor', 'jankx'), icon: monitor },
    { name: 'Boxes', label: __('Boxes', 'jankx'), icon: boxes },
    { name: 'FileText', label: __('Document', 'jankx'), icon: fileText },
    { name: 'Sparkles', label: __('AI / Highlight', 'jankx'), icon: sparkles },
    { name: 'Layers', label: __('Layers', 'jankx'), icon: layers },
    { name: 'Tag', label: __('Tag', 'jankx'), icon: tag }
];

export const DynamicIcon = ({ name, size = 16, className = '' }: { name?: string; size?: number; className?: string }) => {
    if (!name) return null;
    const match = ICON_OPTIONS.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (match) {
        return <Icon icon={match.icon} size={size} className={className} />;
    }
    if (name.length <= 4) {
        return <span className={className} style={{ fontSize: size }}>{name}</span>;
    }
    return <Icon icon={link} size={size} className={className} />;
};

import { __ } from '@wordpress/i18n';
import type { ComponentType } from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

export type IconComponent = ComponentType<IconProps>;

const createIcon = (paths: string[]) => {
    const IconComponent = ({ size = 24, className = '' }: IconProps) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {paths.map((d, i) => (
                <path key={i} d={d} />
            ))}
        </svg>
    );
    return IconComponent;
};

export const Icons = {
    ChevronDown: createIcon(['M6 9l6 6 6-6']),
    ChevronRight: createIcon(['M9 18l6-6-6-6']),
    ChevronLeft: createIcon(['M15 18l-6-6 6-6']),
    Plus: createIcon(['M12 5v14', 'M5 12h14']),
    Trash2: createIcon(['M3 6h18', 'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6', 'M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2']),
    MoveUp: createIcon(['M12 19V5', 'M5 12l7-7 7 7']),
    MoveDown: createIcon(['M12 5v14', 'M19 12l-7 7-7-7']),
    Settings: createIcon(['M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z', 'M12 15a3 3 0 100-6 3 3 0 000 6z']),
    Grid: createIcon(['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z']),
    Text: createIcon(['M4 7V4h16v3', 'M9 20h6', 'M12 4v16']),
    Image: createIcon(['M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z', 'M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M21 15l-5-5L5 21']),
    Sparkles: createIcon(['M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z']),
    Menu: createIcon(['M3 12h18', 'M3 6h18', 'M3 18h18']),
    Close: createIcon(['M18 6L6 18', 'M6 6l12 12']),
    Link: createIcon(['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71']),
    Columns: createIcon(['M3 3h18v18H3z', 'M9 3v18', 'M15 3v18']),
    Copy: createIcon(['M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z', 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1']),
    Check: createIcon(['M20 6L9 17l-5-5']),
    ExternalLink: createIcon(['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3']),
    Layers: createIcon(['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']),
    Sliders: createIcon(['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6']),
    Eye: createIcon(['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 15a3 3 0 100-6 3 3 0 000 6z']),
    Download: createIcon(['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']),
    Code: createIcon(['M16 18l6-6-6-6', 'M8 6l-6 6 6 6']),
    Monitor: createIcon(['M8 21h8', 'M12 17v4', 'M3 4h18a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z']),
    Tablet: createIcon(['M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z', 'M12 18h.01']),
    Smartphone: createIcon(['M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z', 'M12 18h.01']),
    Boxes: createIcon(['M2.97 12.92A2 2 0 002 14.63v3.24a2 2 0 00.97 1.71l3 1.8a2 2 0 002.06 0L12 19v-5.5l-5-3-4.03 2.42z', 'M7 16.5l-4.74-2.85', 'M7 16.5l5-3', 'M7 16.5v5.17', 'M12 13.5V19l3.97 2.38a2 2 0 002.06 0l3-1.8a2 2 0 00.97-1.71v-3.24a2 2 0 00-.97-1.71L17 10.5l-5 3z', 'M17 16.5l-5-3', 'M17 16.5l4.74-2.85', 'M17 16.5v5.17', 'M7.97 4.42A2 2 0 007 6.13v4.37l5 3 5-3V6.13a2 2 0 00-.97-1.71l-3-1.8a2 2 0 00-2.06 0l-3 1.8z', 'M12 8L7.26 5.15', 'M12 8l4.74-2.85', 'M12 13.5V8']),
    FileText: createIcon(['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8']),
    Shield: createIcon(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z']),
    Zap: createIcon(['M13 2L3 14h9l-1 8 10-12h-9l1-8z']),
    Cloud: createIcon(['M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z']),
    Cpu: createIcon(['M4 4h16v16H4z', 'M9 9h6v6H9z', 'M9 1v3', 'M15 1v3', 'M9 20v3', 'M15 20v3', 'M20 9h3', 'M20 14h3', 'M1 9h3', 'M1 14h3']),
    ShoppingBag: createIcon(['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 01-8 0']),
    Tag: createIcon(['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01']),
    Palette: createIcon(['M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z']),
    RefreshCw: createIcon(['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15']),
    FolderTree: createIcon(['M21 12h-8', 'M21 6H8', 'M21 18h-8', 'M3 6v4c0 1.1.9 2 2 2h3', 'M3 10v6c0 1.1.9 2 2 2h3']),
    Pin: createIcon(['M12 17v5', 'M9 10.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V16a1 1 0 001 1h12a1 1 0 001-1v-.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76z']),
    PinOff: createIcon(['M12 17v5', 'M9 10.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V16a1 1 0 001 1h12a1 1 0 001-1v-.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76z', 'M2 2l20 20']),
    PanelLeft: createIcon(['M3 3h18v18H3z', 'M9 3v18']),
    Rows: createIcon(['M3 3h18v18H3z', 'M3 9h18', 'M3 15h18']),
    LayoutList: createIcon(['M3 3h18v18H3z', 'M3 9h18', 'M3 15h18', 'M9 3v18']),
    Store: createIcon(['M3 9l1.5-5h15L21 9', 'M3 9h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', 'M9 21v-6h6v6']),
    Compass: createIcon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'])
};

export const ICON_OPTIONS: { name: string; label: string; icon: IconComponent }[] = [
    { name: 'ShoppingBag', label: __('Store', 'jankx'), icon: Icons.ShoppingBag },
    { name: 'Zap', label: __('Lightning', 'jankx'), icon: Icons.Zap },
    { name: 'Shield', label: __('Security', 'jankx'), icon: Icons.Shield },
    { name: 'Cloud', label: __('Cloud', 'jankx'), icon: Icons.Cloud },
    { name: 'Cpu', label: __('Hardware', 'jankx'), icon: Icons.Cpu },
    { name: 'Smartphone', label: __('Phone', 'jankx'), icon: Icons.Smartphone },
    { name: 'Monitor', label: __('Monitor', 'jankx'), icon: Icons.Monitor },
    { name: 'Boxes', label: __('Boxes', 'jankx'), icon: Icons.Boxes },
    { name: 'FileText', label: __('Document', 'jankx'), icon: Icons.FileText },
    { name: 'Sparkles', label: __('AI / Highlight', 'jankx'), icon: Icons.Sparkles },
    { name: 'Layers', label: __('Layers', 'jankx'), icon: Icons.Layers },
    { name: 'Tag', label: __('Tag', 'jankx'), icon: Icons.Tag }
];

export const Icon = ({ icon, size = 16, className = '' }: { icon?: IconComponent; size?: number; className?: string }) => {
    if (!icon) {
        return null;
    }

    const IconComp = icon;
    return <IconComp size={size} className={className} />;
};

export const DynamicIcon = ({ name, size = 16, className = '' }: { name?: string; size?: number; className?: string }) => {
    if (!name) return null;
    const match = ICON_OPTIONS.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (match) {
        const IconComp = match.icon;
        return <IconComp size={size} className={className} />;
    }
    if (name.length <= 4) {
        return <span className={className} style={{ fontSize: size }}>{name}</span>;
    }
    return <Icons.Link size={size} className={className} />;
};

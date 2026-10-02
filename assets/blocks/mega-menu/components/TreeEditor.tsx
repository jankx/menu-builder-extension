import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl, ButtonGroup } from '@wordpress/components';
import { plus, chevronDown, chevronRight, close, moveUp, moveDown, copy, trash, folderTree } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';
import { Icons, DynamicIcon } from './Icons';

export interface MenuItem {
    id: string;
    label: string;
    url: string;
    type: 'link' | 'dropdown' | 'mega' | 'flyout';
    layout: 'list' | 'grid' | 'columns';
    columns: number;
    icon?: string;
    imageUrl?: string;
    description?: string;
    badge?: string;
    badgeColor?: string;
    children: MenuItem[];
    isOpen?: boolean;
    submenuWidth?: string;
    align?: string;
    cardStyle?: string;
}

interface TreeEditorProps {
    items: MenuItem[];
    onSelect: (id: string) => void;
    selectedId: string | null;
    onUpdateStructure: (newItems: MenuItem[]) => void;
}

const TreeEditor = ({ items, onSelect, selectedId, onUpdateStructure }: TreeEditorProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const updateNode = (
        nodes: MenuItem[],
        id: string,
        transform: (node: MenuItem) => MenuItem | null
    ): MenuItem[] => {
        return nodes.reduce((acc: MenuItem[], node) => {
            if (node.id === id) {
                const transformed = transform(node);
                if (transformed) acc.push(transformed);
                return acc;
            }
            if (node.children) {
                const newChildren = updateNode(node.children, id, transform);
                acc.push({ ...node, children: newChildren });
                return acc;
            }
            acc.push(node);
            return acc;
        }, []);
    };

    const cloneItemWithNewIds = (item: MenuItem): MenuItem => {
        return {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: `${item.label} (${__('Copy', 'jankx')})`,
            children: item.children ? item.children.map(cloneItemWithNewIds) : []
        };
    };

    const handleDuplicate = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const duplicateRecursive = (nodes: MenuItem[]): MenuItem[] => {
            const result: MenuItem[] = [];
            for (const node of nodes) {
                result.push(node);
                if (node.id === id) {
                    result.push(cloneItemWithNewIds(node));
                } else if (node.children) {
                    result[result.length - 1] = {
                        ...node,
                        children: duplicateRecursive(node.children)
                    };
                }
            }
            return result;
        };
        onUpdateStructure(duplicateRecursive(items));
    };

    const handleMove = (e: React.MouseEvent, id: string, direction: 'up' | 'down') => {
        e.stopPropagation();
        const moveRecursive = (nodes: MenuItem[]): MenuItem[] => {
            const idx = nodes.findIndex((n) => n.id === id);
            if (idx !== -1) {
                const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (targetIdx < 0 || targetIdx >= nodes.length) return nodes;
                const newNodes = [...nodes];
                const [moved] = newNodes.splice(idx, 1);
                newNodes.splice(targetIdx, 0, moved);
                return newNodes;
            }
            return nodes.map((node) => ({
                ...node,
                children: node.children ? moveRecursive(node.children) : []
            }));
        };
        onUpdateStructure(moveRecursive(items));
    };

    const handleToggle = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newStructure = updateNode(items, id, (node) => ({ ...node, isOpen: !node.isOpen }));
        onUpdateStructure(newStructure);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newStructure = updateNode(items, id, () => null);
        onUpdateStructure(newStructure);
        if (selectedId === id) onSelect('');
    };

    const handleAddChild = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newChild: MenuItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: __('New Item', 'jankx'),
            url: '#',
            type: 'link',
            layout: 'list',
            columns: 1,
            children: [],
            isOpen: true
        };
        const newStructure = updateNode(items, id, (node) => ({
            ...node,
            children: [...node.children, newChild],
            isOpen: true
        }));
        onUpdateStructure(newStructure);
        onSelect(newChild.id);
    };

    const toggleAll = (open: boolean) => {
        const toggleRecursive = (nodes: MenuItem[]): MenuItem[] => {
            return nodes.map((n) => ({
                ...n,
                isOpen: open,
                children: n.children ? toggleRecursive(n.children) : []
            }));
        };
        onUpdateStructure(toggleRecursive(items));
    };

    const renderItem = (item: MenuItem, level: number) => {
        const isSelected = selectedId === item.id;
        const hasChildren = item.children && item.children.length > 0;
        const matchesSearch = !searchTerm || item.label.toLowerCase().includes(searchTerm.toLowerCase());
        const paddingLeft = `${level * 16 + 10}px`;

        return (
            <div key={item.id} className="tree-editor-item">
                <div
                    className={`tree-editor-item-row ${isSelected ? 'is-selected' : ''} ${matchesSearch ? '' : 'is-hidden'}`}
                    style={{ paddingLeft }}
                    onClick={() => onSelect(item.id)}
                >
                    <Button
                        icon={item.isOpen ? chevronDown : chevronRight}
                        onClick={(e) => handleToggle(e as any, item.id)}
                        className="tree-editor-toggle"
                        label={item.isOpen ? __('Collapse', 'jankx') : __('Expand', 'jankx')}
                    />

                    <span className="tree-editor-type-badge" title={`Type: ${item.type}`}>
                        {item.type === 'mega' && <Icon icon={Icons.Grid} size={12} />}
                        {item.type === 'flyout' && <Icon icon={Icons.ChevronRight} size={12} />}
                        {item.type === 'dropdown' && <Icon icon={Icons.ChevronDown} size={12} />}
                        {item.type === 'link' && <Icon icon={Icons.Link} size={12} />}
                    </span>

                    <div className="tree-editor-item-content">
                        {item.icon && <DynamicIcon name={item.icon} size={12} />}
                        <span className="tree-editor-item-label">{item.label || __('Untitled', 'jankx')}</span>
                        {item.badge && <span className="tree-editor-badge">{item.badge}</span>}
                        {(item.type !== 'link' || hasChildren) && (
                            <span className={`tree-editor-layout-tag tree-editor-layout-${item.layout}`}>
                                {item.layout === 'grid' ? `Grid (${item.columns || 2})` : item.layout === 'columns' ? `Cols (${item.columns || 2})` : 'List'}
                            </span>
                        )}
                    </div>

                    <div className="tree-editor-actions">
                        <Button icon={moveUp} onClick={(e) => handleMove(e as any, item.id, 'up')} label={__('Move up', 'jankx')} />
                        <Button icon={moveDown} onClick={(e) => handleMove(e as any, item.id, 'down')} label={__('Move down', 'jankx')} />
                        <Button icon={plus} onClick={(e) => handleAddChild(e as any, item.id)} label={__('Add child', 'jankx')} />
                        <Button icon={copy} onClick={(e) => handleDuplicate(e as any, item.id)} label={__('Duplicate', 'jankx')} />
                        <Button icon={trash} onClick={(e) => handleDelete(e as any, item.id)} label={__('Delete', 'jankx')} isDestructive />
                    </div>
                </div>

                {item.isOpen && item.children && item.children.length > 0 && (
                    <div className="tree-editor-children">
                        {item.children.map((child) => renderItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="tree-editor">
            <div className="tree-editor-toolbar">
                <div className="tree-editor-search">
                    <TextControl
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={__('Search menu items...', 'jankx')}
                    />
                    {searchTerm && (
                        <Button icon={close} onClick={() => setSearchTerm('')} label={__('Clear search', 'jankx')} />
                    )}
                </div>
                <div className="tree-editor-toolbar-actions">
                    <Button onClick={() => toggleAll(true)}>{__('Expand All', 'jankx')}</Button>
                    <Button onClick={() => toggleAll(false)}>{__('Collapse All', 'jankx')}</Button>
                    <span className="tree-editor-count">{items.length} {__('root items', 'jankx')}</span>
                </div>
            </div>
            <div className="tree-editor-content">
                {items.map((item) => renderItem(item, 0))}
                {items.length === 0 && (
                    <div className="tree-editor-empty">
                        {__('No menu items yet.', 'jankx')}<br />
                        {__('Click "+ Add Root Item" above or use AI to generate menu.', 'jankx')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeEditor;

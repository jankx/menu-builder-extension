import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { plus, menu } from '@wordpress/icons';
import { Icon } from '@wordpress/icons';
import TreeEditor, { MenuItem } from './components/TreeEditor';
import MenuPreview from './components/MenuPreview';
import PropertiesPanel from './components/PropertiesPanel';

interface BlockAttributes {
    menuId: string;
    menuClass: string;
    mobileBreakpoint: number;
    desktopBreakpoint: number;
    enableMobileMenu: boolean;
    enableDesktopMenu: boolean;
    mobileMenuPosition: string;
    submenuTrigger: string;
    dropdownAnimation: string;
    hoverDelay: number;
}

const INITIAL_DATA: MenuItem[] = [
    {
        id: 'mega-1',
        label: 'Sản phẩm',
        url: '/products',
        type: 'mega',
        layout: 'grid',
        columns: 4,
        isOpen: true,
        children: [
            {
                id: 'col-1',
                label: 'Điện thoại & Tablet',
                url: '/mobile',
                type: 'link',
                layout: 'list',
                columns: 1,
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
                description: 'iPhone, iPad, Samsung Galaxy mới nhất',
                isOpen: true,
                children: [
                    { id: 'sub-1-1', label: 'iPhone 15 Pro Max', url: '#', type: 'link', layout: 'list', columns: 1, children: [], badge: 'HOT', badgeColor: 'red' },
                    { id: 'sub-1-2', label: 'Samsung S24 Ultra', url: '#', type: 'link', layout: 'list', columns: 1, children: [], badge: 'NEW', badgeColor: 'emerald' },
                    { id: 'sub-1-3', label: 'iPad Pro M4', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-1-4', label: 'Phụ kiện sạc cáp MagSafe', url: '#', type: 'link', layout: 'list', columns: 1, children: [] }
                ]
            },
            {
                id: 'col-2',
                label: 'Laptop & Máy tính',
                url: '/laptops',
                type: 'link',
                layout: 'grid',
                columns: 2,
                imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
                description: 'MacBook & Laptop đồ họa cao cấp',
                isOpen: true,
                children: [
                    { id: 'sub-2-1', label: 'MacBook Air M3', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-2-2', label: 'MacBook Pro M3', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-2-3', label: 'Dell XPS 15', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-2-4', label: 'Asus ROG Gaming', url: '#', type: 'link', layout: 'list', columns: 1, children: [], badge: '144Hz', badgeColor: 'purple' }
                ]
            },
            {
                id: 'col-3',
                label: 'Âm thanh & Phụ kiện',
                url: '/audio',
                type: 'link',
                layout: 'list',
                columns: 1,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
                description: 'Tai nghe chống ồn, Loa Bluetooth',
                isOpen: false,
                children: [
                    { id: 'sub-3-1', label: 'AirPods Pro 2', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-3-2', label: 'Sony WH-1000XM5', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-3-3', label: 'Loa Marshall Stanmore', url: '#', type: 'link', layout: 'list', columns: 1, children: [] }
                ]
            },
            {
                id: 'col-4',
                label: 'Ưu đãi & Khuyến mãi',
                url: '/promo',
                badge: 'SALE 50%',
                badgeColor: 'red',
                type: 'link',
                layout: 'list',
                columns: 1,
                imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
                description: 'Chương trình xả kho giảm sốc trong tháng',
                isOpen: false,
                children: [
                    { id: 'sub-4-1', label: 'Flash Sale trong ngày', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-4-2', label: 'Voucher giảm 500K', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'sub-4-3', label: 'Thu cũ đổi mới trợ giá 2TR', url: '#', type: 'link', layout: 'list', columns: 1, children: [] }
                ]
            }
        ]
    },
    {
        id: 'drop-1',
        label: 'Giải pháp (Grid Dropdown)',
        url: '/solutions',
        type: 'dropdown',
        layout: 'grid',
        columns: 2,
        submenuWidth: 'lg',
        align: 'left',
        cardStyle: 'detailed',
        isOpen: true,
        children: [
            {
                id: 'sol-1',
                label: 'Điện toán Đám mây',
                url: '/cloud',
                icon: 'Cloud',
                description: 'Hạ tầng máy chủ ảo hoá, mở rộng tức thì tốc độ cao',
                badge: 'FAST',
                badgeColor: 'blue',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            },
            {
                id: 'sol-2',
                label: 'Bảo mật & Giám sát',
                url: '/security',
                icon: 'Shield',
                description: 'Bảo vệ dữ liệu chuẩn Doanh nghiệp, phòng chống DDoS',
                badge: 'PRO',
                badgeColor: 'emerald',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            },
            {
                id: 'sol-3',
                label: 'Phân tích & Trí tuệ AI',
                url: '/ai',
                icon: 'Sparkles',
                description: 'Mô hình học máy dự đoán xu hướng và tự động hóa',
                badge: 'AI',
                badgeColor: 'purple',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            },
            {
                id: 'sol-4',
                label: 'DevOps & CI/CD Pipeline',
                url: '/devops',
                icon: 'Cpu',
                description: 'Tự động hóa triển khai phần mềm liên tục 24/7',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            }
        ]
    },
    {
        id: 'flyout-1',
        label: 'Danh mục (Flyout Đa cấp)',
        url: '/categories',
        type: 'flyout',
        layout: 'list',
        columns: 1,
        submenuWidth: 'md',
        isOpen: true,
        children: [
            {
                id: 'cat-1',
                label: 'Linh kiện PC Gaming',
                url: '/pc-parts',
                icon: 'Cpu',
                type: 'flyout',
                layout: 'grid',
                columns: 2,
                submenuWidth: 'lg',
                description: 'Hover để mở Grid 2 cột linh kiện',
                isOpen: true,
                children: [
                    { id: 'part-1', label: 'CPU Intel & AMD', url: '#', description: 'Core i9, Ryzen 9', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'part-2', label: 'Card đồ họa VGA', url: '#', description: 'RTX 4090, RX 7900', type: 'link', layout: 'list', columns: 1, children: [], badge: 'HOT', badgeColor: 'red' },
                    { id: 'part-3', label: 'Bo mạch chủ Motherboard', url: '#', description: 'Z790, X670E chipset', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'part-4', label: 'RAM DDR5 & SSD Gen5', url: '#', description: 'Tốc độ lên tới 7400MHz', type: 'link', layout: 'list', columns: 1, children: [] }
                ]
            },
            {
                id: 'cat-2',
                label: 'Thiết bị Văn phòng',
                url: '/office',
                icon: 'FileText',
                type: 'flyout',
                layout: 'list',
                columns: 1,
                submenuWidth: 'sm',
                description: 'Máy in, Máy chiếu, Máy scan',
                isOpen: false,
                children: [
                    { id: 'off-1', label: 'Máy in laser đa năng', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'off-2', label: 'Máy chiếu văn phòng 4K', url: '#', type: 'link', layout: 'list', columns: 1, children: [] },
                    { id: 'off-3', label: 'Máy hủy tài liệu bảo mật', url: '#', type: 'link', layout: 'list', columns: 1, children: [] }
                ]
            },
            {
                id: 'cat-3',
                label: 'Phần mềm bản quyền',
                url: '/software',
                icon: 'Zap',
                type: 'link',
                layout: 'list',
                columns: 1,
                description: 'Windows 11 Pro, Microsoft 365, Adobe CC',
                children: []
            }
        ]
    },
    {
        id: 'link-pricing',
        label: 'Bảng giá',
        url: '/pricing',
        badge: 'HOT',
        badgeColor: 'amber',
        type: 'link',
        layout: 'list',
        columns: 1,
        children: []
    },
    {
        id: 'drop-docs',
        label: 'Tài liệu',
        url: '/docs',
        type: 'dropdown',
        layout: 'list',
        columns: 1,
        submenuWidth: 'sm',
        isOpen: false,
        children: [
            { id: 'doc-1', label: 'Hướng dẫn cài đặt nhanh', url: '#', icon: 'Zap', type: 'link', layout: 'list', columns: 1, children: [] },
            { id: 'doc-2', label: 'Tài liệu API REST & GraphQL', url: '#', icon: 'Code', type: 'link', layout: 'list', columns: 1, children: [] },
            { id: 'doc-3', label: 'Cộng đồng & Hỗ trợ kỹ thuật', url: '#', icon: 'ShoppingBag', type: 'link', layout: 'list', columns: 1, children: [] }
        ]
    }
];

const Edit = ({ attributes, setAttributes }: { attributes: BlockAttributes, setAttributes: (updates: Partial<BlockAttributes>) => void }) => {
    const {
        menuId,
        menuClass,
        mobileBreakpoint,
        desktopBreakpoint,
        enableMobileMenu,
        enableDesktopMenu,
        mobileMenuPosition,
        submenuTrigger,
        dropdownAnimation,
        hoverDelay
    } = attributes;

    const [menuData, setMenuData] = useState<MenuItem[]>(INITIAL_DATA);
    const [selectedId, setSelectedId] = useState<string | null>('drop-1');
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (!menuId) {
            setAttributes({
                menuId: 'jankx-mega-menu-' + Math.random().toString(36).substr(2, 9)
            });
        }
    }, [menuId]);

    const findItem = (items: MenuItem[], id: string): MenuItem | null => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItem(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedItem = selectedId ? findItem(menuData, selectedId) : null;

    const handleUpdateItem = (updates: Partial<MenuItem>) => {
        if (!selectedId) return;
        const updateRecursive = (items: MenuItem[]): MenuItem[] => {
            return items.map((item) => {
                if (item.id === selectedId) {
                    return { ...item, ...updates };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        setMenuData(updateRecursive(menuData));
    };

    const handleAddRoot = () => {
        const newItem: MenuItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: 'Mục Menu Mới',
            url: '#',
            type: 'dropdown',
            layout: 'grid',
            columns: 2,
            submenuWidth: 'md',
            children: [],
            isOpen: true
        };
        setMenuData([...menuData, newItem]);
        setSelectedId(newItem.id);
    };

    const handleAddChild = (parentId: string) => {
        const newChild: MenuItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: 'Mục con mới',
            url: '#',
            type: 'link',
            layout: 'list',
            columns: 1,
            children: [],
            isOpen: true
        };
        const updateRecursive = (items: MenuItem[]): MenuItem[] => {
            return items.map((item) => {
                if (item.id === parentId) {
                    return { ...item, children: [...(item.children || []), newChild], isOpen: true };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        setMenuData(updateRecursive(menuData));
        setSelectedId(newChild.id);
    };

    const handleDuplicateItem = (id: string) => {
        const cloneItem = (item: MenuItem): MenuItem => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: `${item.label} (Bản sao)`,
            children: item.children ? item.children.map(cloneItem) : []
        });
        const duplicateRecursive = (nodes: MenuItem[]): MenuItem[] => {
            const result: MenuItem[] = [];
            for (const node of nodes) {
                result.push(node);
                if (node.id === id) {
                    const duplicated = cloneItem(node);
                    result.push(duplicated);
                    setSelectedId(duplicated.id);
                } else if (node.children) {
                    result[result.length - 1] = { ...node, children: duplicateRecursive(node.children) };
                }
            }
            return result;
        };
        setMenuData(duplicateRecursive(menuData));
    };

    const handleDeleteItem = (id: string) => {
        const deleteRecursive = (nodes: MenuItem[]): MenuItem[] => {
            return nodes.reduce((acc: MenuItem[], node) => {
                if (node.id === id) return acc;
                if (node.children) {
                    acc.push({ ...node, children: deleteRecursive(node.children) });
                    return acc;
                }
                acc.push(node);
                return acc;
            }, []);
        };
        setMenuData(deleteRecursive(menuData));
        if (selectedId === id) setSelectedId(null);
    };

    const blockProps = useBlockProps({
        className: menuClass,
        id: menuId
    });

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Responsive Settings', 'jankx')} initialOpen={true}>
                    <ToggleControl
                        label={__('Enable Mobile Menu', 'jankx')}
                        checked={enableMobileMenu}
                        onChange={(enableMobileMenu) => setAttributes({ enableMobileMenu })}
                    />
                    <ToggleControl
                        label={__('Enable Desktop Menu', 'jankx')}
                        checked={enableDesktopMenu}
                        onChange={(enableDesktopMenu) => setAttributes({ enableDesktopMenu })}
                    />
                    <RangeControl
                        label={__('Mobile Breakpoint', 'jankx')}
                        value={mobileBreakpoint}
                        onChange={(mobileBreakpoint) => setAttributes({ mobileBreakpoint: mobileBreakpoint || 768 })}
                        min={320}
                        max={1200}
                    />
                    <RangeControl
                        label={__('Desktop Breakpoint', 'jankx')}
                        value={desktopBreakpoint}
                        onChange={(desktopBreakpoint) => setAttributes({ desktopBreakpoint: desktopBreakpoint || 1024 })}
                        min={768}
                        max={1920}
                    />
                    <SelectControl
                        label={__('Mobile Menu Position', 'jankx')}
                        value={mobileMenuPosition}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(mobileMenuPosition) => setAttributes({ mobileMenuPosition: mobileMenuPosition as 'left' | 'right' })}
                    />
                </PanelBody>

                <PanelBody title={__('Desktop Menu Options', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Dropdown Animation', 'jankx')}
                        value={dropdownAnimation}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Fade', 'jankx'), value: 'fade' },
                            { label: __('Slide', 'jankx'), value: 'slide' }
                        ]}
                        onChange={(dropdownAnimation) => setAttributes({ dropdownAnimation: dropdownAnimation as 'none' | 'fade' | 'slide' })}
                    />
                    <RangeControl
                        label={__('Hover Delay (ms)', 'jankx')}
                        value={hoverDelay}
                        onChange={(hoverDelay) => setAttributes({ hoverDelay })}
                        min={0}
                        max={1000}
                    />
                    <SelectControl
                        label={__('Submenu Trigger', 'jankx')}
                        value={submenuTrigger}
                        options={[
                            { label: __('Hover', 'jankx'), value: 'hover' },
                            { label: __('Click', 'jankx'), value: 'click' }
                        ]}
                        onChange={(submenuTrigger) => setAttributes({ submenuTrigger: submenuTrigger as 'hover' | 'click' })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="mega-menu-builder">
                <div className="mega-menu-builder-header">
                    <h3>
                        <Icon icon={menu} />
                        {__('Mega Menu Builder', 'jankx')}
                    </h3>
                    <Button
                        icon={plus}
                        onClick={handleAddRoot}
                        variant="primary"
                    >
                        {__('Add Root Item', 'jankx')}
                    </Button>
                </div>

                <div className="mega-menu-builder-body">
                    <div className="mega-menu-sidebar">
                        <TreeEditor
                            items={menuData}
                            onSelect={(id) => setSelectedId(id)}
                            selectedId={selectedId}
                            onUpdateStructure={setMenuData}
                        />
                    </div>

                    <div className="mega-menu-preview">
                        <MenuPreview
                            items={menuData}
                            selectedId={selectedId}
                            onSelectItem={(id) => setSelectedId(id)}
                        />
                    </div>

                    {selectedId && (
                        <PropertiesPanel
                            item={selectedItem}
                            onUpdate={handleUpdateItem}
                            onClose={() => setSelectedId(null)}
                            onAddChild={handleAddChild}
                            onDuplicate={handleDuplicateItem}
                            onDelete={handleDeleteItem}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Edit;

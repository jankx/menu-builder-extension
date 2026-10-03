import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button } from '@wordpress/components';
import { Icons, Icon } from './components/Icons';

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

const Edit = ({ attributes, setAttributes }: any) => {
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

    const blockProps = useBlockProps({
        className: menuClass,
        id: menuId
    });

    const TEMPLATE = [
        ['jankx/mega-menu-item', { label: 'Trang chủ', url: '/', menuType: 'link' }],
        ['jankx/mega-menu-item', { label: 'Sản phẩm', url: '/san-pham', menuType: 'mega', layout: 'grid', columns: 4 }],
        ['jankx/mega-menu-item', { label: 'Giải pháp', url: '/giai-phap', menuType: 'dropdown', layout: 'grid', columns: 2 }],
        ['jankx/mega-menu-item', { label: 'Danh mục', url: '/danh-muc', menuType: 'flyout' }],
        ['jankx/mega-menu-item', { label: 'Bảng giá', url: '/bang-gia', menuType: 'link', badge: 'HOT', badgeColor: 'amber' }],
        ['jankx/mega-menu-item', { label: 'Liên hệ', url: '/lien-he', menuType: 'link' }]
    ];

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
                        onChange={(mobileMenuPosition) => setAttributes({ mobileMenuPosition })}
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
                        onChange={(dropdownAnimation) => setAttributes({ dropdownAnimation })}
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
                        onChange={(submenuTrigger) => setAttributes({ submenuTrigger })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="mega-menu-builder">
                <div className="mega-menu-builder-body">
                    <InnerBlocks
                        allowedBlocks={['jankx/mega-menu-item']}
                        template={TEMPLATE}
                        renderAppender={() => (
                            <Button
                                icon={Icons.Plus}
                                variant="secondary"
                            >
                                {__('Add Menu Item', 'jankx')}
                            </Button>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default Edit;

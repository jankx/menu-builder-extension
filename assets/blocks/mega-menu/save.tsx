import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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

const Save = ({ attributes }: { attributes: BlockAttributes }) => {
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

    const blockProps = useBlockProps.save({
        className: menuClass,
        id: menuId,
        'data-mobile-breakpoint': mobileBreakpoint,
        'data-desktop-breakpoint': desktopBreakpoint,
        'data-enable-mobile': enableMobileMenu,
        'data-enable-desktop': enableDesktopMenu,
        'data-mobile-position': mobileMenuPosition,
        'data-submenu-trigger': submenuTrigger,
        'data-dropdown-animation': dropdownAnimation,
        'data-hover-delay': hoverDelay
    });

    return (
        <nav {...blockProps}>
            {enableMobileMenu && (
                <button
                    className={`mobile-menu-toggle mobile-menu-${mobileMenuPosition}`}
                    aria-label={__('Toggle Mobile Menu', 'jankx')}
                >
                    <span className="mobile-menu-icon" />
                </button>
            )}
            <ul className="mega-menu-list">
                <InnerBlocks.Content />
            </ul>
        </nav>
    );
};

export default Save;

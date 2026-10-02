import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface SubmenuAttributes {
    layout: string;
    columns: number;
    submenuWidth: string;
    align: string;
    cardStyle: string;
    submenuType: string;
}

const Save = ({ attributes }: { attributes: SubmenuAttributes }) => {
    const {
        layout,
        columns,
        submenuWidth,
        align,
        cardStyle,
        submenuType
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `mega-menu-submenu mega-menu-submenu-${layout} mega-menu-submenu-${submenuType}`,
        'data-layout': layout,
        'data-columns': columns,
        'data-submenu-width': submenuWidth,
        'data-align': align,
        'data-card-style': cardStyle
    });

    return (
        <ul {...blockProps}>
            <InnerBlocks.Content />
        </ul>
    );
};

export default Save;

import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icon, layout } from '@wordpress/icons';

import Edit from './edit';
import Save from './save';

registerBlockType('jankx/mega-menu-submenu', {
    icon: <Icon icon={layout} />,
    edit: Edit,
    save: Save,
});

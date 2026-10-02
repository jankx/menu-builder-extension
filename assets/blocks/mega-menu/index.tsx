import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icon, menu } from '@wordpress/icons';

import Edit from './edit';
import Save from './save';

registerBlockType('jankx/mega-menu', {
    icon: <Icon icon={menu} />,
    edit: Edit,
    save: Save,
});

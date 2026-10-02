import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icon, link } from '@wordpress/icons';

import Edit from './edit';
import Save from './save';

registerBlockType('jankx/mega-menu-item', {
    icon: <Icon icon={link} />,
    edit: Edit,
    save: Save,
});

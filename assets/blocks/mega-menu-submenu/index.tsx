import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icons } from '../mega-menu/components/Icons';

import Edit from './edit';
import Save from './save';

registerBlockType('jankx/mega-menu-submenu', {
    icon: Icons.Rows,
    edit: Edit,
    save: Save,
});

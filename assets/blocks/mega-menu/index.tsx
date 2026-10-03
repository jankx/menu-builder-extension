import './style.scss';
import './editor.scss';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icons, Icon } from './components/Icons';

import Edit from './edit';
import Save from './save';

registerBlockType('jankx/mega-menu', {
    icon: Icons.Menu,
    edit: Edit,
    save: Save,
});

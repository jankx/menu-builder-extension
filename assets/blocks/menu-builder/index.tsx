/**
 * Menu Builder Block - Main Entry Point
 * Responsive menu with mmenu integration for JankX theme
 */

import './style.scss';
import './editor.scss';
import './blocks/menu-item/index.tsx';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icons, Icon } from '../mega-menu/components/Icons';

import Edit from './edit';
import Save from './save';

// Register the block
registerBlockType('jankx/menu-builder', {
    icon: Icons.Menu,
    edit: Edit,
    save: Save,
});

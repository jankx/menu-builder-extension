import './style.css';
import './studio.css';

import { registerBlockType } from '@wordpress/blocks';
import { Icon, menu } from '@wordpress/icons';

import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata as any, {
  icon: <Icon icon={menu} />,
  edit: Edit,
  save: () => null,
});

import { render, screen, fireEvent } from '@testing-library/react';
import MenuPreview from '../components/MenuPreview';
import { MenuItem } from '../components/TreeEditor';

const mockItems: MenuItem[] = [
    {
        id: 'item-1',
        label: 'Products',
        url: '/products',
        type: 'mega',
        layout: 'grid',
        columns: 4,
        isOpen: true,
        children: [
            {
                id: 'item-1-1',
                label: 'Phones',
                url: '/phones',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            }
        ]
    },
    {
        id: 'item-2',
        label: 'Solutions',
        url: '/solutions',
        type: 'dropdown',
        layout: 'grid',
        columns: 2,
        isOpen: false,
        children: []
    },
    {
        id: 'item-3',
        label: 'Categories',
        url: '/categories',
        type: 'flyout',
        layout: 'list',
        columns: 1,
        isOpen: false,
        children: []
    }
];

describe('MenuPreview', () => {
    it('renders preview toolbar', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('View:')).toBeInTheDocument();
        expect(screen.getByText('Storefront')).toBeInTheDocument();
        expect(screen.getByText('Vertical')).toBeInTheDocument();
        expect(screen.getByText('Horizontal')).toBeInTheDocument();
    });

    it('renders viewport mode buttons', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
        expect(screen.getByLabelText('Tablet')).toBeInTheDocument();
        expect(screen.getByLabelText('Mobile')).toBeInTheDocument();
    });

    it('renders brand logo', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('TechStore')).toBeInTheDocument();
    });

    it('renders sign in button', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders storefront mode by default', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('E-commerce Vertical Menu:')).toBeInTheDocument();
    });

    it('switches to vertical mode when clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Vertical'));

        expect(screen.getByText('Vertical Sidebar Mode')).toBeInTheDocument();
    });

    it('switches to horizontal mode when clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Horizontal'));

        expect(screen.getByText('Traditional horizontal navigation')).toBeInTheDocument();
    });

    it('renders vertical menu list in storefront mode', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Solutions')).toBeInTheDocument();
        expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    it('renders horizontal nav in horizontal mode', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Horizontal'));

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Solutions')).toBeInTheDocument();
    });

    it('renders feature cards in storefront mode', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('Vertical Flyout Menu')).toBeInTheDocument();
        expect(screen.getByText('Mega Menu 4 Columns')).toBeInTheDocument();
        expect(screen.getByText('Multi-level Flyout')).toBeInTheDocument();
    });

    it('renders horizontal features in horizontal mode', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Horizontal'));

        expect(screen.getByText('Standard Dropdown')).toBeInTheDocument();
        expect(screen.getByText('Multi-level Flyout')).toBeInTheDocument();
        expect(screen.getByText('Full-width Mega Menu')).toBeInTheDocument();
    });

    it('renders pin button', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('Pin')).toBeInTheDocument();
    });

    it('toggles pin state when clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Pin'));

        expect(screen.getByText('Pinned')).toBeInTheDocument();
    });

    it('renders mobile menu toggle on mobile view', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));

        expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('opens mobile drawer when toggle is clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));
        fireEvent.click(screen.getByLabelText('Open menu'));

        expect(screen.getByText('Navigation')).toBeInTheDocument();
        expect(screen.getByText('Sign In / Get Started')).toBeInTheDocument();
    });

    it('closes mobile drawer when close button is clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));
        fireEvent.click(screen.getByLabelText('Open menu'));
        fireEvent.click(screen.getByLabelText('Close'));

        expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    });

    it('renders mobile drawer items', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));
        fireEvent.click(screen.getByLabelText('Open menu'));

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Solutions')).toBeInTheDocument();
    });

    it('expands mobile drawer item with children', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));
        fireEvent.click(screen.getByLabelText('Open menu'));

        const expandButton = screen.getByLabelText('Expand');
        fireEvent.click(expandButton);

        expect(screen.getByText('Phones')).toBeInTheDocument();
    });

    it('calls onSelectItem when item is selected', () => {
        const onSelectItem = jest.fn();

        render(<MenuPreview items={mockItems} onSelectItem={onSelectItem} />);

        fireEvent.click(screen.getByText('Products'));

        expect(onSelectItem).toHaveBeenCalledWith('item-1');
    });

    it('renders category dropdown trigger on desktop', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    it('opens category dropdown when clicked', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Categories'));

        expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('renders flyout/accordion toggle in vertical mode', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Vertical'));

        expect(screen.getByText('Flyout')).toBeInTheDocument();
        expect(screen.getByText('Accordion')).toBeInTheDocument();
    });

    it('switches to accordion mode in vertical view', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByText('Vertical'));
        fireEvent.click(screen.getByText('Accordion'));

        expect(screen.getByText('Accordion expand')).toBeInTheDocument();
    });

    it('renders badge on menu items', () => {
        const itemsWithBadge: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Sale',
                url: '/sale',
                type: 'link',
                layout: 'list',
                columns: 1,
                badge: 'HOT',
                badgeColor: 'red',
                children: []
            }
        ];

        render(<MenuPreview items={itemsWithBadge} />);

        expect(screen.getByText('HOT')).toBeInTheDocument();
    });

    it('renders icon on menu items', () => {
        const itemsWithIcon: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Cloud',
                url: '/cloud',
                type: 'link',
                layout: 'list',
                columns: 1,
                icon: 'Cloud',
                children: []
            }
        ];

        render(<MenuPreview items={itemsWithIcon} />);

        expect(screen.getByText('Cloud')).toBeInTheDocument();
    });

    it('renders description on menu items', () => {
        const itemsWithDesc: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Cloud',
                url: '/cloud',
                type: 'link',
                layout: 'list',
                columns: 1,
                description: 'Cloud services',
                children: []
            }
        ];

        render(<MenuPreview items={itemsWithDesc} />);

        expect(screen.getByText('Cloud services')).toBeInTheDocument();
    });

    it('renders image on menu items', () => {
        const itemsWithImage: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Product',
                url: '/product',
                type: 'link',
                layout: 'list',
                columns: 1,
                imageUrl: 'https://example.com/image.jpg',
                children: []
            }
        ];

        render(<MenuPreview items={itemsWithImage} />);

        const image = screen.getByAltText('');
        expect(image).toBeInTheDocument();
        expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
    });

    it('renders empty state when no items', () => {
        render(<MenuPreview items={[]} />);

        expect(screen.getByText('TechStore')).toBeInTheDocument();
    });

    it('renders search button', () => {
        render(<MenuPreview items={mockItems} />);

        expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('applies mobile viewport class', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Mobile'));

        const viewport = document.querySelector('.menu-preview-mobile');
        expect(viewport).toBeInTheDocument();
    });

    it('applies tablet viewport class', () => {
        render(<MenuPreview items={mockItems} />);

        fireEvent.click(screen.getByLabelText('Tablet'));

        const viewport = document.querySelector('.menu-preview-tablet');
        expect(viewport).toBeInTheDocument();
    });

    it('applies desktop viewport class by default', () => {
        render(<MenuPreview items={mockItems} />);

        const viewport = document.querySelector('.menu-preview-desktop');
        expect(viewport).toBeInTheDocument();
    });
});

import { render, screen, fireEvent } from '@testing-library/react';
import PropertiesPanel from '../components/PropertiesPanel';
import { MenuItem } from '../components/TreeEditor';

const mockItem: MenuItem = {
    id: 'item-1',
    label: 'Products',
    url: '/products',
    type: 'mega',
    layout: 'grid',
    columns: 4,
    icon: 'ShoppingBag',
    imageUrl: 'https://example.com/image.jpg',
    description: 'Product categories',
    badge: 'HOT',
    badgeColor: 'red',
    children: [],
    isOpen: true
};

describe('PropertiesPanel', () => {
    it('renders panel with item label', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('renders label input with correct value', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const labelInput = screen.getByLabelText('Label') as HTMLInputElement;
        expect(labelInput.value).toBe('Products');
    });

    it('renders URL input with correct value', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const urlInput = screen.getByLabelText('URL') as HTMLInputElement;
        expect(urlInput.value).toBe('/products');
    });

    it('renders badge input with correct value', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const badgeInput = screen.getByLabelText('Badge') as HTMLInputElement;
        expect(badgeInput.value).toBe('HOT');
    });

    it('renders description textarea with correct value', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
        expect(descInput.value).toBe('Product categories');
    });

    it('calls onUpdate when label changes', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const labelInput = screen.getByLabelText('Label');
        fireEvent.change(labelInput, { target: { value: 'New Label' } });

        expect(onUpdate).toHaveBeenCalledWith({ label: 'New Label' });
    });

    it('calls onUpdate when URL changes', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const urlInput = screen.getByLabelText('URL');
        fireEvent.change(urlInput, { target: { value: '/new-url' } });

        expect(onUpdate).toHaveBeenCalledWith({ url: '/new-url' });
    });

    it('calls onUpdate when badge changes', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const badgeInput = screen.getByLabelText('Badge');
        fireEvent.change(badgeInput, { target: { value: 'NEW' } });

        expect(onUpdate).toHaveBeenCalledWith({ badge: 'NEW' });
    });

    it('calls onUpdate when description changes', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const descInput = screen.getByLabelText('Description');
        fireEvent.change(descInput, { target: { value: 'New description' } });

        expect(onUpdate).toHaveBeenCalledWith({ description: 'New description' });
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={onClose}
            />
        );

        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    it('renders menu type selector', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Link')).toBeInTheDocument();
        expect(screen.getByText('Dropdown')).toBeInTheDocument();
        expect(screen.getByText('Flyout')).toBeInTheDocument();
        expect(screen.getByText('Mega Menu')).toBeInTheDocument();
    });

    it('calls onUpdate when menu type changes', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const dropdownButton = screen.getByText('Dropdown');
        fireEvent.click(dropdownButton);

        expect(onUpdate).toHaveBeenCalledWith({ type: 'dropdown' });
    });

    it('renders submenu layout section for non-link types', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Submenu Layout')).toBeInTheDocument();
    });

    it('does not render submenu layout section for link type', () => {
        const linkItem: MenuItem = {
            ...mockItem,
            type: 'link',
            children: []
        };

        render(
            <PropertiesPanel
                item={linkItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.queryByText('Submenu Layout')).not.toBeInTheDocument();
    });

    it('renders columns slider for grid layout', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Columns:')).toBeInTheDocument();
    });

    it('calls onUpdate when columns change', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const columnsInput = screen.getByRole('slider');
        fireEvent.change(columnsInput, { target: { value: '3' } });

        expect(onUpdate).toHaveBeenCalledWith({ columns: 3 });
    });

    it('renders submenu width selector', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByLabelText('Panel Width')).toBeInTheDocument();
    });

    it('renders alignment selector for dropdown type', () => {
        const dropdownItem: MenuItem = {
            ...mockItem,
            type: 'dropdown'
        };

        render(
            <PropertiesPanel
                item={dropdownItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Alignment')).toBeInTheDocument();
    });

    it('renders card style selector', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Card Style')).toBeInTheDocument();
    });

    it('renders image preview when imageUrl is set', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const image = screen.getByAltText('Preview');
        expect(image).toBeInTheDocument();
        expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
    });

    it('renders sample image buttons', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('Fashion')).toBeInTheDocument();
    });

    it('calls onUpdate when sample image is clicked', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const laptopButton = screen.getByText('Laptop');
        fireEvent.click(laptopButton);

        expect(onUpdate).toHaveBeenCalledWith({
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'
        });
    });

    it('renders icon picker', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('calls onUpdate when icon is selected', () => {
        const onUpdate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={onUpdate}
                onClose={jest.fn()}
            />
        );

        const iconButtons = screen.getAllByRole('button');
        const shieldButton = iconButtons.find(btn =>
            btn.getAttribute('aria-label') === 'Security'
        );
        if (shieldButton) {
            fireEvent.click(shieldButton);
            expect(onUpdate).toHaveBeenCalledWith({ icon: 'Shield' });
        }
    });

    it('renders add child button when onAddChild is provided', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onAddChild={jest.fn()}
            />
        );

        expect(screen.getByText('Add child item')).toBeInTheDocument();
    });

    it('calls onAddChild when add child button is clicked', () => {
        const onAddChild = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onAddChild={onAddChild}
            />
        );

        const addButton = screen.getByText('Add child item');
        fireEvent.click(addButton);

        expect(onAddChild).toHaveBeenCalledWith('item-1');
    });

    it('renders duplicate button when onDuplicate is provided', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onDuplicate={jest.fn()}
            />
        );

        expect(screen.getByLabelText('Duplicate')).toBeInTheDocument();
    });

    it('calls onDuplicate when duplicate button is clicked', () => {
        const onDuplicate = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onDuplicate={onDuplicate}
            />
        );

        const duplicateButton = screen.getByLabelText('Duplicate');
        fireEvent.click(duplicateButton);

        expect(onDuplicate).toHaveBeenCalledWith('item-1');
    });

    it('renders delete button when onDelete is provided', () => {
        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(screen.getByLabelText('Delete')).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', () => {
        const onDelete = jest.fn();

        render(
            <PropertiesPanel
                item={mockItem}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
                onDelete={onDelete}
            />
        );

        const deleteButton = screen.getByLabelText('Delete');
        fireEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith('item-1');
    });

    it('returns null when item is null', () => {
        const { container } = render(
            <PropertiesPanel
                item={null}
                onUpdate={jest.fn()}
                onClose={jest.fn()}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });
});

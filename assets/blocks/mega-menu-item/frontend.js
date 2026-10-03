(function() {
    'use strict';

    const initMegaMenu = (menuElement) => {
        if (!menuElement || menuElement.dataset.initialized) return;
        menuElement.dataset.initialized = 'true';

        const mobileBreakpoint = parseInt(menuElement.dataset.mobileBreakpoint) || 768;
        const submenuTrigger = menuElement.dataset.submenuTrigger || 'hover';
        const dropdownAnimation = menuElement.dataset.dropdownAnimation || 'fade';
        const hoverDelay = parseInt(menuElement.dataset.hoverDelay) || 200;

        const mobileToggle = menuElement.querySelector('.mobile-menu-toggle');
        const menuList = menuElement.querySelector('.mega-menu-list');

        if (mobileToggle && menuList) {
            mobileToggle.addEventListener('click', () => {
                menuList.classList.toggle('mobile-open');
            });
        }

        const menuItems = menuElement.querySelectorAll('.mega-menu-item.has-children');

        menuItems.forEach(item => {
            const submenu = item.querySelector('.sub-menu');
            if (!submenu) return;

            let hoverTimeout;

            const showSubmenu = () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    closeAllSubmenus();
                    submenu.classList.add('submenu-open');
                    if (dropdownAnimation === 'fade') {
                        submenu.style.opacity = '0';
                        submenu.style.transition = 'opacity 0.2s ease';
                        requestAnimationFrame(() => {
                            submenu.style.opacity = '1';
                        });
                    } else if (dropdownAnimation === 'slide') {
                        submenu.style.transform = 'translateY(-10px)';
                        submenu.style.transition = 'transform 0.2s ease';
                        requestAnimationFrame(() => {
                            submenu.style.transform = 'translateY(0)';
                        });
                    }
                }, hoverDelay);
            };

            const hideSubmenu = () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    submenu.classList.remove('submenu-open');
                }, 100);
            };

            if (submenuTrigger === 'hover') {
                item.addEventListener('mouseenter', showSubmenu);
                item.addEventListener('mouseleave', hideSubmenu);
            } else if (submenuTrigger === 'click') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (submenu.classList.contains('submenu-open')) {
                        submenu.classList.remove('submenu-open');
                    } else {
                        closeAllSubmenus();
                        submenu.classList.add('submenu-open');
                    }
                });
            }

            submenu.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
            submenu.addEventListener('mouseleave', hideSubmenu);
        });

        const closeAllSubmenus = () => {
            menuElement.querySelectorAll('.sub-menu.submenu-open').forEach(submenu => {
                submenu.classList.remove('submenu-open');
            });
        };

        document.addEventListener('click', (e) => {
            if (!menuElement.contains(e.target)) {
                closeAllSubmenus();
            }
        });

        const handleResize = () => {
            if (window.innerWidth > mobileBreakpoint) {
                menuList.classList.remove('mobile-open');
            }
        };

        window.addEventListener('resize', handleResize);
    };

    const initAll = () => {
        document.querySelectorAll('.jankx-mega-menu').forEach(initMegaMenu);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    if (window.wp && window.wp.blocks) {
        window.wp.domReady(initAll);
    }
})();

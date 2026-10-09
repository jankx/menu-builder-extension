(function () {
	'use strict';

	function qs(sel, ctx) {
		return (ctx || document).querySelector(sel);
	}

	function qsa(sel, ctx) {
		return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
	}

	function initRoot(root) {
		if (root.getAttribute('data-poly-ready')) {
			return;
		}
		root.setAttribute('data-poly-ready', '1');

		var transform = root.getAttribute('data-transform') || 'drawer-accordion';
		var isPush = transform.indexOf('push-in-') === 0;
		var pushDir = transform === 'push-in-right' ? 'right' : 'left';
		var isVertical = root.classList.contains('poly-frontend--vertical');
		var desktopMq = window.matchMedia('(min-width: 1024px)');

		var toggleBtn = qs('[data-action="toggle-compact"]', root);
		var compact = qs('[data-compact-surface]', root);
		var drawer = qs('[data-push-drawer]', root);
		var scrim = qs('[data-scrim]', root);

		/* ---------- Desktop / vertical nav panels ---------- */
		var wraps = qsa('.poly-nav-item-wrap, .poly-vertical-item-wrap', root);

		function getPanel(wrap) {
			var local = wrap.querySelector(':scope > .poly-submenu');
			if (local) {
				return local;
			}
			/* Vertical mode: the submenu lives inside the pane wrapper. */
			var vPane = wrap.querySelector(
				':scope > .poly-vertical-flyout-pane, :scope > .poly-vertical-accordion-pane'
			);
			if (vPane) {
				var vSub = vPane.querySelector(':scope > .poly-submenu');
				return vSub || vPane;
			}
			var id = wrap.getAttribute('data-item-id');
			if (id) {
				var mega = qs('[data-mega-id="' + id + '"] .poly-submenu', root);
				if (mega) {
					return mega;
				}
			}
			return null;
		}

		function setOpen(wrap, open) {
			wrap.classList.toggle('is-expanded', open);
			var pane = wrap.querySelector(
				'.poly-vertical-flyout-pane, .poly-vertical-accordion-pane'
			);
			if (pane) {
				pane.classList.toggle('is-open', open);
			}
			var panel = getPanel(wrap);
			if (panel) {
				panel.classList.toggle('is-open', open);
			}
			var chev = wrap.querySelector('.poly-nav-chevron');
			if (chev) {
				chev.classList.toggle('is-rotated', open);
			}
		}

		function closeAll(except) {
			wraps.forEach(function (w) {
				if (w !== except) {
					setOpen(w, false);
				}
			});
		}

		wraps.forEach(function (wrap) {
			if (!getPanel(wrap)) {
				return;
			}
			var trigger = wrap.getAttribute('data-trigger') || 'hover';
			var leaveTimer = null;

			wrap.addEventListener('mouseenter', function () {
				if (leaveTimer) {
					clearTimeout(leaveTimer);
					leaveTimer = null;
				}
				if (trigger !== 'hover') {
					return;
				}
				closeAll(wrap);
				setOpen(wrap, true);
			});

			wrap.addEventListener('mouseleave', function () {
				if (trigger !== 'hover') {
					return;
				}
				leaveTimer = setTimeout(function () {
					var panel = getPanel(wrap);
					if (wrap.matches(':hover') || (panel && panel.matches(':hover'))) {
						return;
					}
					setOpen(wrap, false);
				}, 140);
			});

			var link = wrap.querySelector('.poly-nav-link, .poly-vertical-link');
			if (link && link.tagName === 'BUTTON') {
				link.addEventListener('click', function (e) {
					e.preventDefault();
					var willOpen = !wrap.classList.contains('is-expanded');
					closeAll(wrap);
					setOpen(wrap, willOpen);
				});
			}
		});

		/* ---------- Flyout branch switching ---------- */
		qsa('.poly-flyout-shell', root).forEach(function (shell) {
			function activate(id) {
				qsa('.poly-flyout-row', shell).forEach(function (row) {
					row.classList.toggle(
						'is-active',
						row.getAttribute('data-flyout-row') === id
					);
				});
				qsa('.poly-flyout-secondary', shell).forEach(function (panel) {
					panel.classList.toggle(
						'is-active',
						panel.getAttribute('data-flyout-panel') === id
					);
				});
			}

			qsa('.poly-flyout-row', shell).forEach(function (row) {
				var id = row.getAttribute('data-flyout-row');
				row.addEventListener('mouseenter', function () {
					activate(id);
				});
				row.addEventListener('click', function (e) {
					e.stopPropagation();
					activate(id);
				});
			});
		});

		/* ---------- Compact / push mobile menu ---------- */
		function setToggleState(open) {
			if (!toggleBtn) {
				return;
			}
			toggleBtn.classList.toggle('is-open', open);
			toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
		}

		function setCompactOpen(open) {
			if (compact) {
				compact.classList.toggle('is-open', open);
			}
			setToggleState(open);
		}

		function setPushOpen(open) {
			if (drawer) {
				drawer.classList.toggle('is-open', open);
			}
			if (scrim) {
				scrim.classList.toggle('is-open', open);
			}
			document.body.classList.toggle('poly-menu-pushed', open);
			document.body.classList.toggle('poly-menu-push-' + pushDir, open);
			setToggleState(open);
		}

		function isMenuOpen() {
			return isPush
				? !!drawer && drawer.classList.contains('is-open')
				: !!compact && compact.classList.contains('is-open');
		}

		function showRootView() {
			var drillRoot = qs('[data-drill-root]', root);
			if (drillRoot) {
				drillRoot.hidden = false;
			}
			qsa('.poly-drill-detail', root).forEach(function (detail) {
				detail.hidden = true;
			});
		}

		function closeMenu() {
			if (isPush) {
				setPushOpen(false);
			} else {
				setCompactOpen(false);
				showRootView();
			}
		}

		function openMenu() {
			if (isPush) {
				setPushOpen(true);
			} else {
				setCompactOpen(true);
			}
		}

		if (toggleBtn) {
			toggleBtn.addEventListener('click', function () {
				if (isMenuOpen()) {
					closeMenu();
				} else {
					openMenu();
				}
			});
		}
		qsa('[data-action="close-push"]', root).forEach(function (btn) {
			btn.addEventListener('click', function () {
				setPushOpen(false);
			});
		});
		if (scrim) {
			scrim.addEventListener('click', function () {
				setPushOpen(false);
			});
		}
		qsa('[data-action="close-compact"]', root).forEach(function (btn) {
			btn.addEventListener('click', closeMenu);
		});

		/* ---------- Accordion (single-open) ---------- */
		qsa('[data-action="accordion-toggle"]', root).forEach(function (btn) {
			btn.addEventListener('click', function () {
				var item = btn.closest('.poly-accordion-item');
				if (!item) {
					return;
				}
				var willOpen = !item.classList.contains('is-open');
				var list = item.closest('.poly-accordion-list');
				if (list) {
					qsa('.poly-accordion-item.is-open', list).forEach(function (other) {
						if (other !== item) {
							other.classList.remove('is-open');
							var otherChev = other.querySelector('.poly-accordion-chevron');
							if (otherChev) {
								otherChev.classList.remove('is-rotated');
							}
						}
					});
				}
				item.classList.toggle('is-open', willOpen);
				var chev = btn.querySelector('.poly-accordion-chevron');
				if (chev) {
					chev.classList.toggle('is-rotated', willOpen);
				}
			});
		});

		/* ---------- Slide-drilldown ---------- */
		qsa('[data-action="drill-open"]', root).forEach(function (btn) {
			btn.addEventListener('click', function () {
				var item = btn.closest('.poly-accordion-item');
				var id = item && item.getAttribute('data-item-id');
				var detail = id ? qs('[data-drill-id="' + id + '"]', root) : null;
				if (!detail) {
					return;
				}
				var drillRoot = qs('[data-drill-root]', root);
				if (drillRoot) {
					drillRoot.hidden = true;
				}
				detail.hidden = false;
			});
		});
		qsa('[data-action="drill-back"]', root).forEach(function (btn) {
			btn.addEventListener('click', showRootView);
		});

		/* ---------- Outside click + Escape ---------- */
		document.addEventListener('click', function (e) {
			if (!root.contains(e.target)) {
				closeAll();
			}
		});

		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Escape') {
				return;
			}
			closeAll();
			if (isMenuOpen()) {
				closeMenu();
			}
		});

		/* ---------- Sticky header (JS-driven; block box is too short for sticky) ---------- */
		if (root.classList.contains('poly-frontend--sticky')) {
			var header = qs('.poly-site-header', root);
			if (header) {
				var rootDocTop = 0;

				function measure() {
					root.style.minHeight = '';
					rootDocTop = window.scrollY + root.getBoundingClientRect().top;
					root.style.minHeight = header.offsetHeight + 'px';
				}

				function onScroll() {
					header.classList.toggle('is-stuck', window.scrollY >= rootDocTop);
				}

				measure();
				onScroll();
				window.addEventListener('scroll', onScroll, { passive: true });
				window.addEventListener('resize', function () {
					measure();
					onScroll();
				});
				window.addEventListener('load', function () {
					measure();
					onScroll();
				});
			}
		}

		/* ---------- Reset when crossing back to desktop ---------- */
		function onViewportChange() {
			if (desktopMq.matches && isMenuOpen()) {
				closeMenu();
			}
		}

		if (desktopMq.addEventListener) {
			desktopMq.addEventListener('change', onViewportChange);
		} else if (desktopMq.addListener) {
			desktopMq.addListener(onViewportChange);
		}
	}

	function boot() {
		qsa('.poly-frontend').forEach(initRoot);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();

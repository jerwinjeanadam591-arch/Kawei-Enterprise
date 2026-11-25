(function () {
	'use strict';

	var phone = '+255766889893';
	var whatsapp = 'https://wa.me/255766889893';
	var email = 'kaweicivilcontractor@gmail.com';

	function createSkipLink() {
		if (document.querySelector('.skip-link')) return;
		var link = document.createElement('a');
		link.className = 'skip-link';
		link.href = '#main-content';
		link.textContent = 'Skip to main content';
		document.body.insertBefore(link, document.body.firstChild);

		var main = document.querySelector('main');
		if (!main) {
			main = document.querySelector('.slider-area') || document.querySelector('.breadcumb-area');
			if (main) main.id = 'main-content';
		}
	}

	function addWhatsAppButton() {
		if (document.querySelector('.whatsapp-float')) return;
		var link = document.createElement('a');
		link.className = 'whatsapp-float';
		link.href = whatsapp + '?text=' + encodeURIComponent('Hello Kawei Enterprises, I would like to make an enquiry.');
		link.target = '_blank';
		link.rel = 'noopener';
		link.setAttribute('aria-label', 'Chat with Kawei Enterprises on WhatsApp');
		link.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span>';
		document.body.appendChild(link);
	}

	function prepareImages() {
		document.querySelectorAll('img').forEach(function (img, index) {
			if (!img.hasAttribute('loading') && index > 3) img.setAttribute('loading', 'lazy');
			if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
			if (!img.alt) img.alt = '';
		});
	}

	function prepareLinks() {
		document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
			if (!link.rel) link.rel = 'noopener';
		});

		document.querySelectorAll('a[href="#"]').forEach(function (link) {
			link.setAttribute('aria-disabled', 'true');
			link.addEventListener('click', function (event) {
				event.preventDefault();
			});
		});

		document.querySelectorAll('a[href="#"][aria-hidden], a[href="#"][class*="facebook"], a[href="#"][class*="instagram"], a[href="#"][class*="linkedin"], a[href="#"][class*="twitter"], a[href="#"][class*="pinterest"]').forEach(function (link) {
			link.href = whatsapp;
			link.target = '_blank';
			link.rel = 'noopener';
			link.setAttribute('aria-disabled', 'false');
		});
	}

	function prepareForms() {
		document.querySelectorAll('form').forEach(function (form) {
			if (form.dataset.upgradesReady) return;
			form.dataset.upgradesReady = 'true';

			var honeypot = document.createElement('input');
			honeypot.type = 'text';
			honeypot.name = 'website';
			honeypot.tabIndex = -1;
			honeypot.autocomplete = 'off';
			honeypot.className = 'honeypot';
			honeypot.setAttribute('aria-hidden', 'true');
			form.appendChild(honeypot);

			if (form.querySelector('[name="message"]') && !form.querySelector('.privacy-note')) {
				var privacyNote = document.createElement('p');
				privacyNote.className = 'privacy-note';
				privacyNote.innerHTML = 'By submitting this form, you agree to be contacted about your enquiry. <a href="privacy.html">Privacy Policy</a>';
				form.appendChild(privacyNote);
			}

			form.addEventListener('submit', function (event) {
				event.preventDefault();

				if (honeypot.value) return;
				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				var fields = new FormData(form);
				var search = (fields.get('search-field') || '').toString().trim();
				if (search) {
					var pages = [
						{ words: 'home about company', url: 'about.html' },
						{ words: 'service civil building contractor', url: 'service.html' },
						{ words: 'hydro hydropower dam weir', url: 'service-details.html' },
						{ words: 'portfolio project gallery', url: 'portfolio.html' },
						{ words: 'contact quotation quote phone email', url: 'contact.html' },
						{ words: 'team staff management', url: 'team.html' }
					];
					var query = search.toLowerCase();
					var match = pages.find(function (page) {
						return page.words.split(' ').some(function (word) { return query.indexOf(word) !== -1; });
					});
					window.location.href = match ? match.url : 'service.html';
					return;
				}

				var emailValue = (fields.get('email') || '').toString().trim();
				var name = (fields.get('name') || '').toString().trim();
				var subject = (fields.get('subject') || 'Website enquiry').toString().trim();
				var message = (fields.get('message') || '').toString().trim();
				var phoneValue = (fields.get('phone') || '').toString().trim();
				var projectType = (fields.get('project_type') || '').toString().trim();
				var hasMessageFields = fields.has('name') || fields.has('subject') || fields.has('message');

				var status = form.parentElement.querySelector('.form-status') ||
					form.nextElementSibling && form.nextElementSibling.classList && form.nextElementSibling.classList.contains('form-status') ?
					form.nextElementSibling : null;

				if (!status) {
					status = document.createElement('div');
					status.className = 'form-status';
					status.setAttribute('role', 'status');
					status.setAttribute('aria-live', 'polite');
					form.after(status);
				}

				status.className = 'form-status';

				if (!hasMessageFields) {
					var newsletterBody =
						'Please add this email address to the Kawei Enterprises newsletter:\\n\\n' +
						emailValue;
					status.className = 'form-status success';
					status.textContent = 'Opening your email application to confirm your subscription.';
					window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Newsletter subscription') +
						'&body=' + encodeURIComponent(newsletterBody);
					return;
				}

				var body =
					'Name: ' + (name || 'Not provided') + '\\n' +
					'Email: ' + (emailValue || 'Not provided') + '\\n' +
					'Phone: ' + (phoneValue || 'Not provided') + '\\n' +
					'Project type: ' + (projectType || 'Not provided') + '\\n\\n' +
					message;

				status.className = 'form-status success';
				status.textContent = 'Opening your email application. Please send the prepared message to complete your enquiry.';
				window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) +
					'&body=' + encodeURIComponent(body);
			});
		});
	}

	function setLinkActions() {
		document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"]').forEach(function (link) {
			link.setAttribute('data-analytics-action', 'contact');
		});

		document.querySelectorAll('a[href$=".pdf"]').forEach(function (link) {
			link.setAttribute('data-analytics-action', 'download');
		});
	}

	function addStructuredData() {
		if (document.querySelector('script[type="application/ld+json"][data-kawei]')) return;
		var data = {
			'@context': 'https://schema.org',
			'@type': 'LocalBusiness',
			name: 'Kawei Enterprises Co. Ltd',
			description: 'Civil, building, hydropower and project delivery contractor in Mafinga, Iringa, Tanzania.',
			telephone: phone,
			email: email,
			address: {
				'@type': 'PostalAddress',
				streetAddress: 'CCM Building, Wambi',
				addressLocality: 'Mafinga',
				addressRegion: 'Iringa',
				addressCountry: 'TZ'
			}
		};
		var script = document.createElement('script');
		script.type = 'application/ld+json';
		script.dataset.kawei = 'true';
		script.textContent = JSON.stringify(data);
		document.head.appendChild(script);
	}

	function addPageMetadata() {
		var title = document.querySelector('title');
		var description = document.querySelector('meta[name="description"]');
		var pageTitle = title ? title.textContent : 'Kawei Enterprises Co. Ltd';
		var pageDescription = description ? description.content :
			'Civil and building contractors delivering reliable construction and hydropower projects in Mafinga, Iringa, Tanzania.';

		var tags = [
			['meta', 'property', 'og:type', 'website'],
			['meta', 'property', 'og:title', pageTitle],
			['meta', 'property', 'og:description', pageDescription],
			['meta', 'property', 'og:image', 'assets/images/kawei/suma-project.jpg'],
			['meta', 'name', 'twitter:card', 'summary_large_image'],
			['meta', 'name', 'twitter:title', pageTitle],
			['meta', 'name', 'twitter:description', pageDescription]
		];

		tags.forEach(function (tag) {
			var key = tag[1];
			var value = tag[2];
			if (!document.querySelector('[' + key + '="' + value + '"]')) {
				var element = document.createElement(tag[0]);
				element.setAttribute(key, value);
				element.setAttribute(tag[3] === 'summary_large_image' ? 'content' : 'content', tag[3]);
				document.head.appendChild(element);
			}
		});

		if (window.location.protocol !== 'file:' && !document.querySelector('link[rel="canonical"]')) {
			var canonical = document.createElement('link');
			canonical.rel = 'canonical';
			canonical.href = window.location.origin + window.location.pathname;
			document.head.appendChild(canonical);
		}

		document.querySelectorAll('footer').forEach(function (footer) {
			if (footer.querySelector('.privacy-link')) return;
			var privacy = document.createElement('a');
			privacy.href = 'privacy.html';
			privacy.className = 'privacy-link';
			privacy.textContent = 'Privacy Policy';
			footer.appendChild(privacy);
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		createSkipLink();
		addWhatsAppButton();
		prepareImages();
		prepareLinks();
		prepareForms();
		setLinkActions();
		addStructuredData();
		addPageMetadata();
	});
})();

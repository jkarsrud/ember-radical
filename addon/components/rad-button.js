import Component from 'ember-component';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import hbs from 'htmlbars-inline-precompile';

/**
 * The `rad-button` component is used for all user interaction targets in Ember
 * Radical. The component handles a number of housekeeping tasks including:
 * - Outline suppression only on clicks
 * - Tag firing when enabled
 * - Aria and html attributes
 *
 * {{#rad-button}}Rad Button{{/rad-button}}
 *
 * Configuration | Type | Default | Description
 * --- | --- | --- | ---
 * `brand` | {'primary', 'secondary', 'info' etc. } | `null` | Adds classes for a styled button
 * `outline` | boolean | `false` | Adds outline button class. _(Requires a `brand` property.)_
 * `link` | boolean | `false` | Adds classes to make the button look and act like a link
 *
 * @class Component.RadButton
 * @constructor
 * @extends Ember.Component
 */

// Feature Assets
// ---------------------------------------------------------------------------
let taggingAssets = {};

if (TAGGING) {
  taggingAssets = {
    tagging: inject(),

    /**
     * Internal method that handles firiing a tag with or without custom dimensions.
     * @method _fireTag
     * @protected
     * @return {undefined}
     */
    _fireTag() {
      const { tagcategory, tagaction, taglabel, tagvalue, tagcd } =
        this.getProperties('tagcategory', 'tagaction', 'taglabel', 'tagvalue', 'tagcd');

      // Fire off that tag, pass along available props
      this.get('tagging').fireTag({ tagcategory, tagaction, taglabel, tagvalue, tagcd });

      // If we're only tagging once, null out the category to prevent additional fires
      if (this.get('tagonce')) { this.set('tagcategory', null); }
    }
  };
}

export default Component.extend(taggingAssets, {

  // Props
  // ---------------------------------------------------------------------------
  /**
   * Pass a brand to have `btn-${brand}` class applied
   * @property {?string} brand
   * @default null
   * @public
   */
  brand: null,
  /**
   * Pass true to create a button that looks and behaves like an anchor. This is
   * useful for creating accessible interaction targets.
   * @property {boolean} link
   * @default false
   * @public
   */
  link: false,
  /**
   * Pass a {{c-l 'brand'}} along with `true` for `outline` to include outline style
   * classes.
   * @property {boolean} outline
   * @default false
   * @public
   */
  outline: false,
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * @property {string} tagcategory
   * @default ''
   * @public
   */
  tagcategory: '',
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * @property {string} tagaction
   * @default ''
   * @public
   */
  tagaction: '',
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * Set to `null` so the tagging service will properly correct an un-passed value.
   * @property {string} taglabel
   * @default null
   * @public
   */
  taglabel: null,
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * @property {string} tagvalue
   * @default ''
   * @public
   */
  tagvalue: '',
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * @property {Object} tagcd
   * @default null
   * @public
   */
  tagcd: null,
  /**
   * Tagging property. Handles firing a tag on hover when true.
   * @property {boolean} taghover
   * @default false
   * @public
   */
  taghover: false,
  /**
   * Tagging property. See {{c-l class='Service.Tagging'}} for tagging documentation.
   * @property {boolean} tagonce
   * @default false
   * @public
   */
  tagonce: false,

  // State
  // ---------------------------------------------------------------------------
  /**
   * Generate color class using presence of {{c-l 'brand'}} and {{c-l 'outline'}}
   * flags.
   * @property {string} brandClass
   * @protected
   * @param {string} brand
   * @param {string} outline
   */
  brandClass: computed('brand', 'outline', function() {
    if (this.get('outline')) {
      return this.get('brand') ? `btn-outline-${this.get('brand')}` : null;
    } else {
      return this.get('brand') ? `btn-${this.get('brand')}` : null;
    }
  }),

  // Component
  // ---------------------------------------------------------------------------
  /**
   * NOTE: `role` should not be bound here. You can set the role of a button
   * by passing an [ariaRole](http://emberjs.com/api/classes/Ember.Component.html#property_ariaRole) prop.
   * @property {Array} attributeBindings
   * @default ['aria-controls', 'aria-describedby', 'aria-expanded', 'aria-hidden', 'aria-label', 'aria-labelledby', 'data-test', 'disabled', 'type']
   * @public
   */
  attributeBindings: [
    'aria-controls',
    'aria-describedby',
    'aria-expanded',
    'aria-hidden',
    'aria-label',
    'aria-labelledby',
    'data-test',
    'disabled',
    'type'
  ],
  /**
   * @property {Array} classNames
   * @default ['rad-button', 'btn']
   * @public
   */
  classNames: [
    'rad-button',
    'btn'
  ],
  /**
   * @property {Array} classNameBindings
   * @default ['brandClass', 'link:btn-link', 'link:btn-unstyled']
   * @public
   */
  classNameBindings: [
    'brandClass',
    'link:btn-link',
    'link:btn-unstyled'
  ],
  /**
   * @property {string} tagName
   * @default 'button'
   */
  tagName: 'button',
  /**
   * @property {string} type
   * @default 'button'
   */
  type: 'button',

  // Events
  // ---------------------------------------------------------------------------
  /**
   * The `mouseDown` event is used for some utility/housekeeping methods because
   * we use the `click` event to pass in actions.
   *
   * Handle setting the outline on this element to `none` because we know this
   * event is only triggered by actual mouse clicks. Keyboard events don't trigger
   * it, which is a convenient way to know we're good to hide the outline and
   * maintain usability for keyboard users. A++ accessibility!
   *
   * Handle checking for a tagging category and if one exists, fire a tag.
   *
   * If you need to override this event, be sure to call `this._super();`
   * @event mouseDown
   * @protected
   */
  mouseDown() {
    // Hide outline b/c this was a legit mouse click
    // On blur, remove outline style in case the user switches to keyboard
    this.$().css({ outline: 'none', boxShadow: 'none' });
    this.$().on('blur', () => {
      // If this button instance is destroying/destroyed, don't bother
      // (This is an issue with instances of `{{rad-alert}}`)
      if (this.get('isDestroying') || this.get('isDestroyed')) { return; }
      this.$().off('blur').css({ outline: '', boxShadow: '' });
    });

    if (TAGGING) {
      // If a tagcategory is present, handle firing a tag
      if (this.get('tagcategory')) { this._fireTag(); }
    }
  },
  /**
   * The `mouseEnter` checks for a tagging category and hover flag. If they're
   * present a tag is fired.
   *
   * If you need to override this event, be sure to call `this._super();`
   * TODO: Only include this if Tagging feature is enabled
   * @event mouseEnter
   * @protected
   */
  mouseEnter() {
    if (TAGGING) {
      const { taghover, tagcategory } = this.getProperties('taghover', 'tagcategory');

      // If tagcategory is present and hover is flagged, handle firing a tag
      if (taghover && tagcategory) { this._fireTag(); }
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`{{{yield}}}`
});

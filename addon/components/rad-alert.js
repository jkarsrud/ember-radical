import Component from 'ember-component';
import run from 'ember-runloop';
import computed from 'ember-computed';
import hbs from 'htmlbars-inline-precompile';

/**
 * Alerts should be used for contextual messages to the user.
 *
 * ## Usage
 * Alerts accept a `brand` property to change the alert color:
 * ```glimmer
 * {{#rad-alert brand="primary"}}Even hunks were boys once. Pretty little boy hunks!{{/rad-alert}}
 * {{#rad-alert brand="secondary"}}If you’re raking the leaves and it gets all over your driveway, just hose it off dummy.{{/rad-alert}}
 * {{#rad-alert brand="success"}}You have smelly body parts? Smelly under your arms? In the armpits? Just… just put some vinegar on it! Why didn’t you think of that?{{/rad-alert}}
 * {{#rad-alert brand="info"}}I’ll be brack.{{/rad-alert}}
 * {{#rad-alert brand="warning"}}Life comes from eggs. Not just for omelettes, ya dingus, you could make a baby boy or a baby girl too.{{/rad-alert}}
 * {{#rad-alert brand="danger"}}Go to bed early you doofus, ‘cause when you’re sleeping there’s no lonely times, just dreams.{{/rad-alert}}
 * ```
 *
 * #### Non Dismissible
 * By default alerts are dismissible. You can disable this by setting `dismissible`
 * to `false`:
 *
 * ```glimmer
 * {{#rad-alert brand="primary" dismissible=false}}Try to dismiss this, ya dingus.{{/rad-alert}}
 * ```
 *
 * The hooks `onDeactivate` and `onDeactivated` are fired before and after dismisall
 * of an alert:
 * ```glimmer
 * {{#rad-alert brand="primary" onDeactivate=(action "handleDismiss")}}Dismiss me!{{/rad-alert}}
 * ```
 * @class Component.RadAlert
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Props
  // ---------------------------------------------------------------------------
  /**
   * Alert style. Eg: `success`, `info`, `warning`, `danger`
   * @property {string} brand
   * @default ''
   * @public
   */
  brand: '',
  /**
   * If true, the alert will show the close button in upper right corner and hide
   * itself on click. Is defaulted to true, pass `false` to create an alert that
   * cannot be dismissed:
   *
   * ```glimmer
   * {{#rad-alert style='danger' dismissible=false}}
   *   This alert cannot be dismissed.
   * {{/rad-alert}}
   * ```
   * @property {boolean} dismissible
   * @default true
   * @public
   */
  dismissible: true,
  /**
   * Component hook called when the component is dismissed by user. Is called with
   * params of `this`, the component instance and the `evt`.
   * @method onDeactivate
   * @public
   */
  onDeactivate: () => {},
  /**
   * Component hook called after the dismiss logic has fired. Is called with
   * params of `this`, the component instance and the `evt`.
   * @method onDeactivated
   * @public
   */
  onDeactivated: () => {},

  // State
  // ---------------------------------------------------------------------------
  /**
   * Computed css class bound to component. Handled by component to allow for
   * flexibility in future updates to branding class names
   * @property {string} brandClass
   * @param {string} brand
   * @protected
   */
  brandClass: computed('brand', function() {
    return this.get('brand') ? `alert-${this.get('brand')}` : null;
  }),

  // Component
  // ---------------------------------------------------------------------------
  /**
   * A++ accessibility. Tells a screen this component is an alert.
   * @property {string} ariaRole
   * @default 'alert'
   * @protected
   */
  ariaRole: 'alert',
  /**
   * @property {Array} attributeBindings
   * @default ['data-test']
   * @public
   */
  attributeBindings: ['data-test'],
  /**
   * @property {Array} classNames
   * @default ['alert', 'rad-alert']
   * @public
   */
  classNames: ['alert', 'rad-alert'],
  /**
   * @property {Array} classNameBindings
   * @default ['brandClass']
   * @public
   */
  classNameBindings: ['brandClass'],

  // Actions
  // ---------------------------------------------------------------------------
  actions: {
    /**
     * Handles click on alert close by firing deactivate hooks and setting visibility
     * to false
     * @method dismiss
     * @param {Object} evt jQuery event object
     * @protected
     * @action
     */
    dismiss(evt) {
      this.get('onDeactivate')(this, evt); // Consumer Hooks
      // Fade the element out
      this.$().animate({ opacity: 0 }, 300, () => {
        if (this.get('isDestroyed')) { return; }
        // Sets display:none to pull from DOM flow
        run(() => {
          this.set('isVisible', false);
          this.get('onDeactivated')(this, evt); // Consumer Hooks
        });
      });
    }
  },

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    <div class='alert-content'>
      {{yield}}
    </div>

    {{#if dismissible}}
      <div class='alert-close-wrapper'>
        {{#rad-button
          aria-label='close'
          classNames='close'
          link=true
          click=(action 'dismiss')
          data-test=(if data-test (concat data-test '-close'))}}
          {{rad-svg svgId='close'}}
        {{/rad-button}}
      </div>
    {{/if}}
  `
});

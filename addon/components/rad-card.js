import Component from 'ember-component';
import computed from 'ember-computed';
import hbs from 'htmlbars-inline-precompile';

/**
 * Core card.
 *
 * ```handlebars
 * {{#rad-card as |components|}}
 *   {{#components.block}}
 *     {{#components.title}}Card title{{/components.title}}
 *     Card body
 *   {{/components.block}}
 *   {{#components.footer}}Card footer{{/components.footer}}
 * {{/rad-card}}
 * ```
 *
 * {{#rad-card as |components|}}
 *   {{#components.block}}
 *     {{#components.title}}Party Time{{/components.title}}
 *     <img src="http://i.giphy.com/125RIkH7IluIpy.gif"/>
 *   {{/components.block}}
 * {{/rad-card}}
 *
 * @class Component.RadCard
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Props
  // ---------------------------------------------------------------------------
  /**
   * Pass a brand to use to style the component and it's child components.
   * @property {string} brand
   * @default ''
   * @public
   */
  brand: '',

  // State
  // ---------------------------------------------------------------------------
  /**
   * Computed css class for branded cards.
   * @property {String} brandClass
   * @param {string} brand
   * @protected
   */
  brandClass: computed('brand', function() {
    return this.get('brand') ? `card-${this.get('brand')}` : '';
  }),

  // Default Component References
  // ---------------------------------------------------------------------------
  /**
   * @property {string} blockComponent
   * @default 'rad-pure-element'
   * @public
   */
  blockComponent: 'rad-pure-element',
  /**
   * @property {string} footerComponent
   * @default 'rad-pure-element'
   * @public
   */
  footerComponent: 'rad-pure-element',
  /**
   * @property {string} headerComponent
   * @default 'rad-pure-element'
   * @public
   */
  headerComponent: 'rad-pure-element',
  /**
   * @property {string} titleComponent
   * @default 'rad-pure-element'
   * @public
   */
  titleComponent: 'rad-pure-element',

  // Component
  // ---------------------------------------------------------------------------
  /**
   * @property {Array} attributeBindings
   * @default 'data-test'
   * @public
   */
  attributeBindings: ['data-test'],
  /**
   * @property {Array} classNames
   * @default 'card rad-card'
   * @public
   */
  classNames: ['card', 'rad-card'],
  /**
   * @property {Array} classNameBindings
   * @default ['brandClass']
   * @public
   */
  classNameBindings: ['brandClass'],

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{yield
      (hash
        block=(component blockComponent
          elementClassNames='card-block'
          data-test=(if data-test (concat data-test '-block')))
        footer=(component footerComponent
          elementClassNames='card-footer'
          data-test=(if data-test (concat data-test '-footer')))
        header=(component headerComponent
          elementClassNames='card-header'
          data-test=(if data-test (concat data-test '-header')))
        title=(component titleComponent
          elementClassNames='card-title'
          tagName='h4'
          data-test=(if data-test (concat data-test '-title')))
      )
    }}
  `
});

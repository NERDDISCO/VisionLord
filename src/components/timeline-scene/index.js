import { PolymerElement, html } from '/node_modules/@polymer/polymer/polymer-element.js'
import reduxMixin from '../../reduxStore.js'
import { DomRepeat } from '/node_modules/@polymer/polymer/lib/elements/dom-repeat.js'
import '../timeline-animation/index.js'
import { getAnimation } from '../../selectors/index.js'

/*
 * Handle a scene in a timeline
 */
class TimelineScene extends reduxMixin(PolymerElement) {
  static get properties() {
    return {
      scene: Object,
      progress: Number
    }
  }

  _getAnimation(animationId) {
    return getAnimation(this.getState(), { animationId })
  }

  static get template() {
    return html`
      <style>
        h3 {
          font-size: 1em;
          font-weight: normal;
          margin: 0;
        }
      </style>

      <div>
        <h3>[[scene.name]]</h3>

        <template is="dom-repeat" items="[[scene.animations]]" as="animationId">

          <timeline-animation
            animation$="[[_getAnimation(animationId)]]"
            fixture-ids$="[[scene.fixtures]]"
            duration="[[scene.duration]]"
            progress="[[progress]]"></timeline-animation>
        </template>

      </div>
    `
  }
}

customElements.define('timeline-scene', TimelineScene)

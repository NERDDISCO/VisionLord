import { LitElement, html } from '@polymer/lit-element/lit-element.js'
import { repeat } from 'lit-html/directives/repeat.js'
import { store } from '../../reduxStore.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import './timeline-animation.js'
import { getAnimation, getAnimations, getTimelinePlaying } from '../../selectors/index.js'

/*
 * Handle a scene in a timeline
 */
class TimelineScene extends connect(store)(LitElement) {
  static get properties() {
    return {
      scene: { type: Object },
      progress: { type: Number },
      animations: { type: Array }
    }
  }

  constructor() {
    super()
  }

  _stateChanged(state) {
    // @TODO: timeline-manager should update all it's children when the animations in the state are changing
    if (!Object.is(this.animations, getAnimations(state))) {
      this.animations = getAnimations(state)
      this.requestUpdate()
    }
  }

  render() {
    const { scene, progress, playing } = this

    return html`
      <style>
        h3 {
          font-size: 1em;
          font-weight: normal;
          margin: 0;
        }
      </style>

      <div>
        <h3>${scene.name}</h3>
        
        ${repeat(this.scene.animations, animationId => html`

          <div>
            <timeline-animation
              .animation="${getAnimation(store.getState(), { animationId })}"
              .fixtureIds=${scene.fixtures}
              progress=${progress}>
            </timeline-animation>
          </div>

        `)}

      </div>
    `
  }
}

customElements.define('timeline-scene', TimelineScene)
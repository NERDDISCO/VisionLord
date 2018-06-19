import { PolymerElement, html } from '/node_modules/@polymer/polymer/polymer-element.js'
import reduxMixin from '../../reduxStore.js'
import { setSceneName, addAnimationToScene, addFixturesToScene, removeFixtureFromScene, removeAnimationFromScene, addSceneToTimeline, removeScene, resetUniverseAndFixtures } from '../../actions/index.js'
import '../fixture-list/index.js'
import '../animation-list/index.js'

/*
 * Handle a list of scenes
 */
class SceneBee extends reduxMixin(PolymerElement) {
  static get properties() {
    return {
      name: String,
      duration: Number,
      id: String,
      index: Number,
      fixtures: Array,
      fixtureManager: {
        type: Array,
        statePath: 'fixtureManager'
      },
      animations: Array,
      animationManager: {
        type: Array,
        statePath: 'animationManager'
      }
    }
  }

  runScene(e) {
    this.dispatch(addSceneToTimeline(this.id))
  }

  removeScene(e) {
    const { dataset } = e.target
    this.dispatch(removeScene(parseInt(dataset.index, 10)))
  }

  handleAddAnimation(e) {
    const { event, animationId } = e.detail

    // Prevent sending data to server & reset all fields
    event.preventDefault()
    event.target.reset()

    this.dispatch(addAnimationToScene(this.index, animationId))
  }

  handleRemoveAnimation(e) {
    const { animationIndex } = e.detail

    this.dispatch(removeAnimationFromScene(this.index, animationIndex))

    // #35: Reset fixture properties after animation was removed
    // @TODO: Only reset the fixtures that are attached to the scene
    this.dispatch(resetUniverseAndFixtures(0))
  }

  handleAddFixtures(e) {
    const { event, fixtureIds } = e.detail

    // Prevent sending data to server & reset all fields
    event.preventDefault()

    this.dispatch(addFixturesToScene(this.index, fixtureIds))
  }

  handleRemoveFixture(e) {
    const { fixtureIndex } = e.detail

    this.dispatch(removeFixtureFromScene(this.id, fixtureIndex))
  }

  handleNameChange(e) {
    const sceneName = e.target.value
    this.dispatch(setSceneName(this.index, sceneName))
  }

  static get template() {
    return html`
    <style>
      h4 {
        margin: 0.25em 0;
      }

      .name {
        display: inline-block;
        margin: 0;
      }
    </style>

      <div>
        <input class="name" name="name" type="text" on-change="handleNameChange" value="[[name]]"></input>

        <button on-click="removeScene" data-index$="[[index]]">Remove</button>
        <button on-click="runScene" scene-id="[[scene.id]]">Run</button>

        <animation-list
          on-add-animation="handleAddAnimation"
          on-remove-animation="handleRemoveAnimation"
          data-index$="[[index]]"
          animations$="{{animations}}"
          animation-manager$="[[animationManager]]"></animation-list>


        <fixture-list
          on-add-fixtures="handleAddFixtures"
          on-remove-fixture="handleRemoveFixture"
          data-index$="[[index]]"
          fixtures="{{fixtures}}"
          fixture-manager="[[fixtureManager]]"></fixture-list>
      </div>
    `
  }
}

customElements.define('scene-bee', SceneBee)

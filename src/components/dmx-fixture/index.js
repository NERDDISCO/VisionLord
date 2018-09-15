import { LitElement, html } from '/node_modules/@polymer/lit-element/lit-element.js'
import { repeat } from '/node_modules/lit-html/directives/repeat.js'
import { store } from '../../reduxStore.js'
import { setChannels, setFixtureAddress } from '../../actions/index.js'
import '/node_modules/@polymer/polymer/lib/elements/dom-repeat.js'
import '../dmx-fixture-property/index.js'
import * as Fixtures from '../../utils/dmx-fixtures.js'
import { batch } from '../../utils/index.js'

import '/node_modules/@polymer/iron-icons/iron-icons.js'
import '/node_modules/@polymer/iron-icons/maps-icons.js'
import '/node_modules/@polymer/paper-tooltip/paper-tooltip.js'

/*
 * A single DMX fixture with all properties
 */
class DmxFixture extends LitElement {

  static get properties() {
    return {
      name: { type: String },
      id: { type: String },
      type: { type: String },
      address: { type: Number },
      universe: { type: Number },
      _fixture: { type: Object },
      _properties: { type: Object }
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    // Get data out of the form
    const data = new FormData(e.target)
    const address = parseInt(data.get('address'), 10)

    store.dispatch(setFixtureAddress(this.id, address))
  }

  /*
   * A property gets changed on the fixture using the UI
   */
  handleChange(e) {
    const { name, value } = e.detail
    // Set the property of the fixture which will also set the values on the corresponding channels
    this._fixture[name] = value

    // Send all values of all channels to universe 0
    store.dispatch(setChannels(0, [...batch]))

    const now = new Date()

    // Send the universe to the UsbDmxManager
    window.dispatchEvent(new CustomEvent('send-universe-to-usb-dmx-controller', { detail: { now } }))

    // Send the universe to the FivetwelveManager
    window.dispatchEvent(new CustomEvent('send-universe-to-fivetwelve', { detail: { now } }))
  }

  render() {
    // Initialize the fixture based on the type
    this._fixture = new Fixtures[this.type]({
      address: this.address,
      universe: this.universe
    })

    // Get the properties of the fixture
    this._properties = this._fixture.getParamsList()

    const { type, address, _fixture, _properties } = this

    return html`
        <style>
          .grid {
            display: flex;
            flex-direction: row;
            overflow: scroll;
          }

          .property {
            margin: 0 .25em;
          }
        </style>

        <div>
          <div class="grid">
            <div>
              <iron-icon icon="info-outline" id="info"></iron-icon>
              <paper-tooltip for="info">
                ${type} | ${_fixture.weight} kg | ${_fixture.channels} Channels
              </paper-tooltip>
            </div>

            <form id="fixtureMetaProperties" @submit="${e => this.handleSubmit(e)}">
              <div>
                <paper-tooltip for="address">Address</paper-tooltip>
                <input id="address" name="address" type="number" min="0" max="512" value="${address}"/>
              </div>
            </form>
          </div>

          <div class="grid">

            ${repeat(_properties, property => html`
              <dmx-fixture-property
                @change="${e => this.handleChange(e)}"

                .property="${property}"
                name="${property.name}"
                type="${property.type}"
                channels="${property.channels}"

                class="property">
              </dmx-fixture-property>
            `)}

          </div>

        </div>
    `
  }
}

customElements.define('dmx-fixture', DmxFixture)

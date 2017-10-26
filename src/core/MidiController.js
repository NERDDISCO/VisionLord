/*
 * Handle the input / output port of a single MIDI controller.
 *
 * @param {string} controllerId - Unqiue identifier for this controller
 * @param {string} input - The name of the input port
 * @param {string} output - The name of the output port
 */
export default class MidiController {
  constructor(param) {
    this.controllerId = param.controllerId

    // Get a reference to the input port
    this.input = WebMidi.getInputByName(param.input)

    // Get a reference to the output port
    this.output = WebMidi.getOutputByName(param.output)

    // Layout & mapping
    this.layout = param.layout

    // Mapped elements
    this.elementMapping = new Map()

    // Input is defined
    if (this.input) {
      // Map input elements to an internal identifier
      this.mapping()

      // Listen to "noteon" events
      this.input.addListener('noteon', 'all', this.noteon.bind(this))
    }

  }

  /*
   * Handle "noteon" events
   */
  noteon(event) {
    const { data } = event
    const [,
      note,
      velocity] = data

    // Mapping exists for this note
    if (this.elementMapping.get(note) === undefined) {
      console.log('noteon', note, velocity)
    } else {
      const eventData = {
        partId: this.elementMapping.get(note).partId,
        controllerId: this.controllerId
      }

      // @TODO: Hide behind a flag
      // console.log('noteon', eventData)

      window.dispatchEvent(new CustomEvent('MidiController', { detail: eventData }))
    }

  }

  mapping() {
    // Create a mapping for the input elements of the controller
    this.layout.parts.forEach(element => {
      // MIDI note => partId
      this.elementMapping.set(element.note, element)
    })
  }
}

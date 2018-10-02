import RangeParam from '/libs/fivetwelve/lib/param/RangeParam.js'

import DmxDevice from './DmxDevice.js'

export default class BasicDimmer extends DmxDevice {
  constructor(options) {
    super(Object.assign({}, options, {
      params: {
        dimmer: new RangeParam(1, { min: 0, max: 255 }),
      }
    }))

    this.layout = {}
    this.layout.width = 1
    this.layout.height = 1

    this.channels = 1
    this.weight = 1.2
  }
}

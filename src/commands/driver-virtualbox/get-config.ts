import {Command, flags} from '@oclif/command'
import { machineNameFlag } from '@lime.it/blip-core'
import execa = require('execa')
import { VBoxManage } from '../../vbox-manage'

export default class VirtualboxGetConfig extends Command {
  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    'machine-name': machineNameFlag
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(VirtualboxGetConfig)
    
    const result = await VBoxManage.getConfiguration(flags['machine-name']);

    return result;
  }
}
